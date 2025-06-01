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
  page: Page,
  bears: number,
  increase: (by: number) => void,
  setPage: (val: string) => void,
  loadItems: () => void,
}

export const useShopStore = create<ShopState>()((set) => ({
  page: 'home',
  bears: 0,
  items: [],
  increase: (val: number) => set(state => ({ bears: state.bears + val })),
  setPage: (page: Page) => set(() => ({ page })),
  loadItems: async () => {
    set(() => ({ loading: true }));
    const response = await fetch('https://not-contest-cdn.openbuilders.xyz/api/items.json');
    const { data: items } = await response.json();
    set(() => ({ items }));
  }
}));

export const usePage = () => useShopStore(
  useShallow(({ page, setPage }) => ({ page, setPage })),
);

export const useItems = () => useShopStore(
  useShallow(({ items, loadItems }) => ({ items, loadItems })),
);