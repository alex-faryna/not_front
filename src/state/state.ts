import {create} from "zustand/react";
import {useShallow} from "zustand/react/shallow";

type Page = 'home' | 'item' | 'profile';

export interface Item {
  id: number,
  name: string,
  category: string,
  description: string,
  price: number,
  currency: "NOT",
  left: number,
  tags: Record<string, string>,
  images: string[]
}

export interface ShopState {
  loading: boolean,
  items: Item[],
  loadItems: () => void,

  selected: number;
  select: (val: number) => void,

  page: Page,
  setPage: (val: string) => void,
}

export const useShopStore = create<ShopState>()((set) => ({
  loading: false,
  items: [],
  loadItems: async () => {
    set(() => ({ loading: true }));
    const response = await fetch('https://not-contest-cdn.openbuilders.xyz/api/items.json');
    const { data: items } = await response.json();
    set(() => ({ items, loading: false }));
  },

  selected: -1,
  select: (selected: number) => set(() => ({ selected })),

  page: 'home',
  setPage: (page: Page) => set(() => ({ page })),
}));

export const usePage = () => useShopStore(
  useShallow(({ page, setPage }) => ({ page, setPage })),
);

export const useItems = () => useShopStore(
  useShallow(({ items, loadItems }) => ({ items, loadItems })),
);

export const useItem = () => useShopStore(
  useShallow(({ items, selected, select }) => ({ select, item: items.find(item => item.id === selected) })),
);