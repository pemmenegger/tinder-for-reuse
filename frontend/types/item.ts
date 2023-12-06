import { ItemRead } from "./api/item";

export type Item = ItemRead & {
  date: string;
  location: string;
  price_tag: string;
};

export type MapMarker = {
  id: number;
  lat: number;
  lng: number;
  iconUrl: string;
  iconScaledSize: {
    width: number;
    height: number;
  };
  results: any[];
  ResultComponent: React.ComponentType<any>;
};
