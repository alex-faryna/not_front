import {create} from "zustand/react";

export interface ShopState {
  bears: number
  increase: (by: number) => void
}

export const useShopStore = create<ShopState>()((set) => ({
  bears: 0,
  increase: (val: number) => set(state => ({ bears: state.bears + val })),
}));