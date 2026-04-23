export interface Skyscraper {
  _id: string;
  name: string;
  city: string;
  country: string;
  heightM: number;
  floors?: number;
  yearBuilt?: number;
  lat: number;
  lng: number;
  architect?: string;
}
