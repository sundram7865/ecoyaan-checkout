import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Address, SavedAddress } from "../types";

interface CheckoutState {
  // ── Cart ──────────────────────────────────────────────────────────
  cart: Product[];
  shippingFee: number;
  discount: number;

  // ── Addresses ─────────────────────────────────────────────────────
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null; // null = user hasn't explicitly chosen yet
  address: Address | null;          // mirrors the selected address for payment page

  // ── Cart Actions ──────────────────────────────────────────────────
  setCartData: (items: Product[], shipping: number, discount: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;

  // ── Address Actions ───────────────────────────────────────────────
  addAddress: (address: Address, label: string) => void;
  updateAddress: (id: string, address: Address, label: string) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;      // explicit user tap only
  deselectAddress: () => void;
  setAddress: (address: Address) => void;   // legacy compat
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      cart: [],
      shippingFee: 0,
      discount: 0,
      savedAddresses: [],
      selectedAddressId: null,
      address: null,

      // ── Cart ──────────────────────────────────────────────────────
      setCartData: (items, shipping, discount) =>
        set({ cart: items, shippingFee: shipping, discount }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product_id !== id) return item;
            const maxStock = item.max_stock ?? 99;
            return { ...item, quantity: Math.max(1, Math.min(quantity, maxStock)) };
          }),
        })),

      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product_id !== id),
        })),

      // Does NOT touch savedAddresses — those are permanent user data
      clearCart: () =>
        set({ cart: [], address: null, shippingFee: 0, discount: 0, selectedAddressId: null }),

      // ── Addresses ─────────────────────────────────────────────────
      // addAddress does NOT auto-select — user must explicitly tap a card
      addAddress: (address, label) =>
        set((state) => {
          const id = `addr_${Date.now()}`;
          const newAddr: SavedAddress = { ...address, id, label };
          return {
            savedAddresses: [...state.savedAddresses, newAddr],
            // intentionally do NOT set selectedAddressId here
          };
        }),

      updateAddress: (id, address, label) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) =>
            a.id === id ? { ...address, id, label } : a
          ),
          // refresh active address if the edited one was selected
          address: state.selectedAddressId === id ? address : state.address,
        })),

      deleteAddress: (id) =>
        set((state) => {
          const remaining = state.savedAddresses.filter((a) => a.id !== id);
          const wasSelected = state.selectedAddressId === id;
          return {
            savedAddresses: remaining,
            // if deleted address was selected → deselect completely
            selectedAddressId: wasSelected ? null : state.selectedAddressId,
            address: wasSelected ? null : state.address,
          };
        }),

      // Only called when user explicitly taps a card
      selectAddress: (id) =>
        set((state) => {
          const found = state.savedAddresses.find((a) => a.id === id);
          if (!found) return {};
          return { selectedAddressId: id, address: found };
        }),

      deselectAddress: () =>
        set({ selectedAddressId: null, address: null }),

      setAddress: (address) => set({ address }),
    }),
    {
      name: "ecoyaan-checkout-v3",
      storage: createJSONStorage(() => localStorage),
    }
  )
);