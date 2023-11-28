import { ItemRead } from "./api/item";

export type Item = ItemRead & {
  date: string;
  location: string;
  price_tag: string;
};
