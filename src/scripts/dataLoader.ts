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
  locations: Location[];
  schedule: Array<{ days: string; hours: string }>;
  reviews?: Array<{ author: string; text: string; rating: number; date: string }>;
}

export interface GalleryItem {
  id: number;
  image: string;
  category: string;
  title: string;
}

import configData from '../data/config.json';
import galleryData from '../data/gallery.json';

export const loadData = async (): Promise<{ config: Config, gallery: GalleryItem[] }> => {
  return { config: configData as Config, gallery: galleryData as GalleryItem[] };
};
