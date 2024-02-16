import type { Element } from "./Element";

interface PageType {
  id: string;
  name: string;
  ref?: HTMLDivElement;
  width: number;
  height: number;
  elements: Element[];  
}

interface PageStore {
  [key: string]: PageType;
}

export type { PageType, PageStore };