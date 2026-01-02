import { LocationStyle } from '../types';

export const getStyleLabel = (style: string, t: any): string => {
  const labels: Record<string, string> = {
    [LocationStyle.REALISTIC]: t('styles.labels.realistic'),
    [LocationStyle.CYBERPUNK]: t('styles.labels.cyberpunk'),
    [LocationStyle.VINTAGE]: t('styles.labels.vintage'),
    [LocationStyle.PAINTING]: t('styles.labels.painting'),
    [LocationStyle.SURREAL]: t('styles.labels.surreal'),
    [LocationStyle.DISPOSABLE]: t('styles.labels.disposable'),
    [LocationStyle.PHOTOBOOK]: t('styles.labels.photobook'),
    [LocationStyle.AERIAL]: t('styles.labels.aerial'),
    [LocationStyle.CINEMATIC_GRID]: t('styles.labels.cinematic_grid'),
    [LocationStyle.PHOTO_GRID_3X3]: t('styles.labels.photo_grid_3x3'),
    [LocationStyle.CCTV]: t('styles.labels.cctv'),
    [LocationStyle.WEATHER_REALTIME]: t('styles.labels.weather_realtime'),
    [LocationStyle.LIGHT_LEAK]: t('styles.labels.light_leak'),
    [LocationStyle.HYPER_CANDID]: t('styles.labels.hyper_candid'),
    [LocationStyle.PHOTO_RESTORATION]: t('styles.labels.photo_restoration'),
    [LocationStyle.PIXAR_3D]: t('styles.labels.pixar_3d'),
  };
  return labels[style] || style;
};

export const getStyleDescription = (style: string, t: any): string => {
  const descriptions: Record<string, string> = {
    [LocationStyle.REALISTIC]: t('styles.realistic'),
    [LocationStyle.CYBERPUNK]: t('styles.cyberpunk'),
    [LocationStyle.VINTAGE]: t('styles.vintage'),
    [LocationStyle.PAINTING]: t('styles.painting'),
    [LocationStyle.SURREAL]: t('styles.surreal'),
    [LocationStyle.DISPOSABLE]: t('styles.disposable'),
    [LocationStyle.PHOTOBOOK]: t('styles.photobook'),
    [LocationStyle.AERIAL]: t('styles.aerial'),
    [LocationStyle.CINEMATIC_GRID]: t('styles.cinematic_grid'),
    [LocationStyle.PHOTO_GRID_3X3]: t('styles.photo_grid_3x3'),
    [LocationStyle.CCTV]: t('styles.cctv'),
    [LocationStyle.WEATHER_REALTIME]: t('styles.weather_realtime'),
    [LocationStyle.LIGHT_LEAK]: t('styles.light_leak'),
    [LocationStyle.HYPER_CANDID]: t('styles.hyper_candid'),
    [LocationStyle.PHOTO_RESTORATION]: t('styles.photo_restoration'),
    [LocationStyle.PIXAR_3D]: t('styles.pixar_3d'),
  };
  return descriptions[style] || style;
};
