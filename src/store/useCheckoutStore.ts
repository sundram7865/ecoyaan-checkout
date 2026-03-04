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
  removeItem: (id: number) => void;
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
            
          cart: state.cart.map((item) => {
            if (item.product_id === id) {
              const maxStock = item.max_stock ?? 99;
              const safeQuantity = Math.max(1, Math.min(quantity, maxStock));
              console.log("Max stock:", maxStock, "Requested:", quantity, "Safe quantity:", safeQuantity);
              return { ...item, quantity: safeQuantity };
            }
            return item;
          }),
        })),

      removeItem: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product_id !== id),
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