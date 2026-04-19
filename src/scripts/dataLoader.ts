export interface Location {
  name: string;
  address: string;
  mapsUrl: string;
  booksyUrl: string;
  image: string;
}

export interface Config {
  name: string;
  slogan: string;
  logo: string;
  socials: {
    instagram: string;
    tiktok: string;
    whatsapp: string;
  };
  booksyId: string;
  driveEndpoint?: string;
  locations: Location[];
  schedule: Array<{ days: string; hours: string }>;
  reviews?: Array<{ author: string; text: string; rating: number; date: string }>;
}

export interface GalleryItem {
  id: string | number;
  image: string;
  category: string;
  title: string;
}

import configData from '../data/config.json';
import galleryData from '../data/gallery.json';

export const loadData = async (): Promise<{ config: Config, gallery: GalleryItem[] }> => {
  const config = configData as Config;
  let gallery = galleryData as GalleryItem[];

  if (config.driveEndpoint) {
    try {
      const response = await fetch(config.driveEndpoint);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          gallery = data;
        } else {
          console.warn('Drive endpoint no devolvió un array, usando fallback local', data);
        }
      }
    } catch (e) {
      console.warn('Falla cargando desde Drive, usando fallback local', e);
    }
  }

  return { config, gallery };
};
