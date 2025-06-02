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

  cart: Record<number, number>;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  // activeImage

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
    console.log(items);
    set(() => ({ items, loading: false }));
  },

  cart: {},
  // check for how many left
  addToCart: (id: number) => set(({ cart }) => ({ cart: { ...cart, [id]: (cart[id] || 0) + 1 } })),
  removeFromCart: (id: number) => set(({ cart }) => {
    const { [id]: key, ...other } = cart || { };
    const count = key || 0;
    if (count <= 1) {
      return { cart: { ...other } };
    }
    return { cart: { ...other, [id]: key - 1 } };
  }),

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

export const useCart = () => useShopStore(
  useShallow(({ cart, addToCart, removeFromCart }: ShopState) => ({ cart, addToCart, removeFromCart })),
);

export const useItem = () => useShopStore(
  useShallow(({ items, selected, select }: ShopState) => ({ select, item: items.find(item => item.id === selected) })),
);