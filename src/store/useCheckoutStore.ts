import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, Address } from '../types';

interface CheckoutState {
  cart: Product[];
  shippingFee: number;
  discount: number;
  address: Address | null;
  setCartData: (items: Product[], shipping: number, discount: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  setAddress: (address: Address) => void;
  clearCart: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      cart: [],
      shippingFee: 0,
      discount: 0,
      address: null,

      setCartData: (items, shipping, discount) =>
        set({ cart: items, shippingFee: shipping, discount }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product_id === id ? { ...item, quantity } : item
          ),
        })),

      setAddress: (address) => set({ address }),

      clearCart: () => set({ cart: [], address: null, shippingFee: 0, discount: 0 }),
    }),
    {
      name: 'ecoyaan-checkout-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);