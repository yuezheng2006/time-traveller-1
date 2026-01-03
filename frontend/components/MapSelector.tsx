import React, { useState, useCallback, useMemo } from 'react';
import { Crosshair, AlertTriangle, Loader2, Search, Navigation, Globe, Map as MapIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Map, MapMarker, MapControls } from './MapComponents';
import { getImageSrc } from '../types';

interface MapSelectorProps {
  onSelect: (coords: { lat: number; lng: number }) => void;
}

const DEFAULT_CENTER: [number, number] = [116.4074, 39.9042]; // Beijing
const CARTO_DARK = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const SATELLITE_STYLE = {
  version: 8,
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      tileSize: 256,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community',
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

export const MapSelector: React.FC<MapSelectorProps> = ({ onSelect }) => {
  const { t } = useTranslation();
  
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(12);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const currentStyle = useMemo(() => isSatellite ? SATELLITE_STYLE : CARTO_DARK, [isSatellite]);

  const handleMapClick = useCallback((e: any) => {
    const { lng, lat } = e.lngLat;
    const newCoords = { lat, lng };
    setSelectedCoords(newCoords);
    onSelect(newCoords);
    setSearchError(null);
  }, [onSelect]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      console.log('[MapSelector] Search result:', data);
      setIsSearching(false);

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        console.log('[MapSelector] Flying to:', lat, lng);

        setCenter([lng, lat]);
        setZoom(15);
        setSelectedCoords({ lat, lng });
        onSelect({ lat, lng });
        setSearchQuery('');
      } else {
        setSearchError(t('map.search_error_not_found'));
      }
    } catch {
      setIsSearching(false);
      setSearchError(t('map.search_error_failed'));
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setSearchError(t('map.geolocation_not_supported'));
      return;
    }

    setIsLocating(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setIsLocating(false);
        setCenter([lng, lat]);
        setZoom(15);
        setSelectedCoords({ lat, lng });
        onSelect({ lat, lng });
      },
      (error) => {
        setIsLocating(false);
        setSearchError(t('map.geolocation_failed'));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden group">
      <Map 
        style={currentStyle as any}
        center={center}
        zoom={zoom}
        onMapClick={handleMapClick}
        className="w-full h-full"
      >
        <MapControls position="bottom-right" />
        
        {selectedCoords && (
          <MapMarker 
            longitude={selectedCoords.lng} 
            latitude={selectedCoords.lat}
          >
            <div className="w-6 h-6 bg-cyber-500 border-2 border-white rounded-full shadow-[0_0_15px_rgba(14,165,233,0.8)] animate-bounce" />
          </MapMarker>
        )}
      </Map>

      {/* Search Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-40">
        <div className="max-w-md mx-auto">
          <div className="relative group/search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder={t('map.search_placeholder')}
              className="w-full bg-black/80 backdrop-blur-md border border-cyber-500/30 rounded-xl py-3 pl-11 pr-24 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyber-500 focus:ring-1 focus:ring-cyber-500/50 transition-all shadow-2xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyber-500" />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-1.5 bg-cyber-500 hover:bg-cyber-400 disabled:bg-cyber-900 disabled:text-slate-500 text-black text-xs font-bold rounded-lg transition-all"
              >
                {isSearching ? <Loader2 className="w-3 h-3 animate-spin" /> : t('map.go')}
              </button>
            </div>
          </div>
          
          <div className="mt-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUseMyLocation}
                disabled={isLocating}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-cyber-500/20 rounded-full text-[10px] font-mono text-cyber-400 hover:text-white hover:border-cyber-500 transition-all"
              >
                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                {isLocating ? t('map.locating') : t('map.use_my_location')}
              </button>
            </div>

            <button
              onClick={() => setIsSatellite(!isSatellite)}
              className={`flex items-center gap-1.5 px-3 py-1.5 backdrop-blur-sm border rounded-full text-[10px] font-mono transition-all ${
                isSatellite 
                  ? 'bg-cyber-500 border-cyber-500 text-black' 
                  : 'bg-black/60 border-cyber-500/20 text-cyber-400 hover:text-white hover:border-cyber-500'
              }`}
            >
              {isSatellite ? <MapIcon className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
              {isSatellite ? t('map.street_mode') || 'Street' : t('map.satellite_mode') || 'Satellite'}
            </button>
          </div>

          {searchError && (
            <div className="mt-3 bg-red-900/80 backdrop-blur-md border border-red-500/30 rounded-lg p-2.5 text-[10px] font-mono text-red-200 flex items-center gap-2 animate-shake">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{searchError}</span>
            </div>
          )}
        </div>
      </div>

      {/* Coordinate HUD */}
      {selectedCoords && (
        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
          <div className="bg-black/80 backdrop-blur-md border border-cyber-500/20 rounded-lg p-2 px-4 text-[10px] font-mono text-cyber-400 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5 border-r border-cyber-500/20 pr-3">
              <Crosshair className="w-3 h-3 text-cyber-500" />
              <span>{selectedCoords.lat.toFixed(6)}, {selectedCoords.lng.toFixed(6)}</span>
            </div>
            <div className="text-slate-500 uppercase tracking-tighter">
              Orbital Sync Active
            </div>
          </div>
        </div>
      )}

      {/* Style Attribution (Overridden for clean UI) */}
      <div className="absolute bottom-2 right-2 z-10 text-[8px] text-slate-600 font-mono pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
        &copy; CARTO &copy; OpenStreetMap &copy; Esri
      </div>
    </div>
  );
};
