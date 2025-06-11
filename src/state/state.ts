import {create} from "zustand/react";
import {useShallow} from "zustand/react/shallow";
import {useTonConnectUI} from "@tonconnect/ui-react";
import {useCallback} from "react";

type Page = 'home' | 'item' | 'profile';

export interface Item {
  id: number,
  name: string,
  category: string,
  description: string,
  price: number,
  currency: "NOT" | string,
  left: number,
  tags: Record<string, string>,
  images: string[]
}

export interface HistoryEntry {
  timestamp: number,
  id: number,
  total: number,
  currency: "NOT" | string,
}

export interface ShopState {
  loading: boolean,
  items: Item[],
  loadItems: () => void,

  search: boolean;
  setSearch: (search: boolean) => void;
  searchQuery: string;
  doSearch: (val: string) => void;
  clearSearch: () => void;

  cart: Record<number, number>;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;

  activeImages: Record<number, number>;
  setActiveImage: (id: number, index: number) => void;

  loadingHistory: boolean;
  history: HistoryEntry[];
  loadHistory: () => void;

  selected: number;
  select: (val: number) => void;

  page: Page,
  setPage: (val: string) => void;
}

const delay = ms => new Promise(res => setTimeout(res, ms));

export const useShopStore = create<ShopState>()((set) => ({
  loading: false,
  items: [],
  loadItems: async () => {
    set(() => ({ loading: true }));
    try {
      const response = await fetch('https://not-contest-cdn.openbuilders.xyz/api/items.json');
      const { data: items } = await response.json();
      await delay(1000);
      set(() => ({ items, loading: false }));
    } catch (_: unknown) {
      set(() => ({ loading: false }));
    }
  },

  search: false,
  setSearch: (search: boolean) => set(() => ({ search, ...(!search && { searchQuery: '' }) })),
  searchQuery: '',
  doSearch: (searchQuery: string) => set(() => ({ searchQuery })),
  clearSearch: () => set(() => ({ searchQuery: '' })),

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

  activeImages: {},
  setActiveImage: (id: number, index: number) => set(({ activeImages }) =>
    ({ activeImages: { ...activeImages, [id]: index } })),

  loadingHistory: false,
  history: [],
  loadHistory: async () => {
    set(() => ({ loadingHistory: true }));
    try {
      const response = await fetch('https://not-contest-cdn.openbuilders.xyz/api/history.json');
      const { data: history } = await response.json();
      await delay(1000);
      set(() => ({ history, loadingHistory: false }));
    } catch (_) {
      set(() => ({ loadingHistory: false }));
    }
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
  useShallow(({ items, loadItems, loading }) => ({ items, loadItems, loading })),
);

export const useCart = () => useShopStore(
  useShallow(({ cart, addToCart, removeFromCart }: ShopState) => ({ cart, addToCart, removeFromCart })),
);

export const useItem = () => useShopStore(
  useShallow(({ items, selected, select }: ShopState) => ({ select, item: items.find(item => item.id === selected) })),
);

export const useHistory = () => useShopStore(
  useShallow(({ items, history, loadingHistory, loadHistory }: ShopState) => ({
    loadHistory,
    loadingHistory,
    history,
    items,
  })),
);

export const useActiveImage = () => useShopStore(
  useShallow(({ activeImages, setActiveImage }: ShopState) => ({ activeImages, setActiveImage })),
);

export const useSearch = () => useShopStore(
  useShallow(({ searchQuery, doSearch, clearSearch, search, setSearch }: ShopState) => ({ searchQuery, doSearch, clearSearch, search, setSearch })),
);

export const usePurchase = () => {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  setOptions({
    uiPreferences: {
      theme: 'SYSTEM',
      borderRadius: 's',
    }
  });

  const fn = useCallback(() => {
    void tonConnectUI.openModal();
  }, [tonConnectUI]);

  return fn;
}