import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Context for the map instance
interface MapContextType {
  map: maplibregl.Map | null;
  isLoaded: boolean;
}

const MapContext = createContext<MapContextType>({ map: null, isLoaded: false });

export const useMap = () => useContext(MapContext);

interface MapProps extends Omit<maplibregl.MapOptions, 'container'> {
  children?: React.ReactNode;
  className?: string;
  onMapClick?: (e: maplibregl.MapMouseEvent & maplibregl.EventData) => void;
}

export const Map: React.FC<MapProps> = ({ children, className, style, center, zoom, onMapClick, ...options }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const mapInstance = new maplibregl.Map({
      container: containerRef.current,
      style: style || 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: center || [0, 0],
      zoom: zoom || 1,
      ...options,
    });

    mapInstance.on('load', () => {
      setIsLoaded(true);
    });

    mapInstance.on('click', (e) => {
      if (onMapClick) onMapClick(e);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, []);

  // Update map state when props change
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
    }
  }, [center, map]);

  useEffect(() => {
    if (map && zoom !== undefined) {
      map.setZoom(zoom);
    }
  }, [zoom, map]);

  useEffect(() => {
    if (map && style) {
      map.setStyle(style);
    }
  }, [style, map]);

  return (
    <div ref={containerRef} className={`relative w-full h-full ${className}`}>
      <MapContext.Provider value={{ map, isLoaded }}>
        {isLoaded && children}
      </MapContext.Provider>
    </div>
  );
};

interface MapMarkerProps extends Omit<maplibregl.MarkerOptions, 'element'> {
  longitude: number;
  latitude: number;
  children?: React.ReactNode;
}

export const MapMarker: React.FC<MapMarkerProps> = ({ longitude, latitude, children, ...options }) => {
  const { map } = useMap();
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;

    const marker = new maplibregl.Marker({
      ...options,
      element: elementRef.current || undefined,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    markerRef.current = marker;

    return () => {
      marker.remove();
    };
  }, [map]);

  useEffect(() => {
    if (markerRef.current) {
      markerRef.current.setLngLat([longitude, latitude]);
    }
  }, [longitude, latitude]);

  return children ? (
    <div style={{ display: 'none' }}>
      <div ref={elementRef}>{children}</div>
    </div>
  ) : null;
};

interface MapControlsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  showZoom?: boolean;
  showCompass?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({ 
  position = 'top-right', 
  showZoom = true, 
  showCompass = true 
}) => {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;

    const nav = new maplibregl.NavigationControl({
      showZoom,
      showCompass,
    });

    map.addControl(nav, position);

    return () => {
      map.removeControl(nav);
    };
  }, [map, position, showZoom, showCompass]);

  return null;
};
