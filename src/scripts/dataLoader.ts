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
}

export interface GalleryItem {
  id: number;
  image: string;
  category: string;
  title: string;
}

export const loadData = async (): Promise<{ config: Config, gallery: GalleryItem[] }> => {
  const [configRes, galleryRes] = await Promise.all([
    fetch('/src/data/config.json'),
    fetch('/src/data/gallery.json')
  ]);
  
  const config = await configRes.json();
  const gallery = await galleryRes.json();
  
  return { config, gallery };
};
