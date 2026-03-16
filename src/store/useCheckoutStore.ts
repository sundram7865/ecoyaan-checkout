import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Product, Address, SavedAddress } from "../types";

// ── Coupon definitions ────────────────────────────────────────────────────────
export interface CouponResult {
  success: boolean;
  message: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "flat";
  discountValue: number; // e.g. 10 → 10% or ₹10 flat
}

// ── Valid coupon table — all give 15 % off ────────────────────────────────
// Add new codes here; no logic changes needed anywhere else.
const VALID_COUPONS: Record<string, Omit<AppliedCoupon, "code">> = {
  ECO15:     { discountType: "percentage", discountValue: 15 },
  GREEN15:   { discountType: "percentage", discountValue: 15 },
  EARTH15:   { discountType: "percentage", discountValue: 15 },
  SUSTAIN15: { discountType: "percentage", discountValue: 15 },
  ECOYAAN15: { discountType: "percentage", discountValue: 15 },
};

// ── State interface ───────────────────────────────────────────────────────────
interface CheckoutState {
  // ── Cart ──────────────────────────────────────────────────────────
  cart: Product[];
  shippingFee: number;
  discount: number;
  couponCode: string | null;
  appliedCoupon: AppliedCoupon | null; // full coupon details after validation

  // ── Addresses ─────────────────────────────────────────────────────
  savedAddresses: SavedAddress[];
  selectedAddressId: string | null;
  address: Address | null;

  // ── Cart Actions ──────────────────────────────────────────────────
  setCartData: (items: Product[], shipping: number, discount: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  setCouponCode: (code: string) => void;

  // ── Derived helpers ───────────────────────────────────────────────
  getCouponDiscount: () => number; // call inside components

  // ── Address Actions ───────────────────────────────────────────────
  addAddress: (address: Address, label: string) => void;
  updateAddress: (id: string, address: Address, label: string) => void;
  deleteAddress: (id: string) => void;
  selectAddress: (id: string) => void;
  deselectAddress: () => void;
  setAddress: (address: Address) => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      cart: [],
      shippingFee: 0,
      discount: 0,
      couponCode: null,
      appliedCoupon: null,
      savedAddresses: [],
      selectedAddressId: null,
      address: null,

      // ── Cart ────────────────────────────────────────────────────────
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

      clearCart: () =>
        set({
          cart: [],
          address: null,
          shippingFee: 0,
          discount: 0,
          couponCode: null,
          appliedCoupon: null,
          selectedAddressId: null,
        }),

      // ── Coupon ──────────────────────────────────────────────────────
      /**
       * Validates the coupon code and, on success, stores the full coupon
       * details so the cart can derive the discount amount at render time.
       * Returns { success, message } so the UI can show inline feedback
       * without needing its own state.
       */
      applyCoupon: (code: string): CouponResult => {
        const normalised = code.trim().toUpperCase();

        if (!normalised) {
          return { success: false, message: "Please enter a coupon code." };
        }

        // Already applied the same coupon
        if (get().appliedCoupon?.code === normalised) {
          return { success: false, message: `"${normalised}" is already applied.` };
        }

        const coupon = VALID_COUPONS[normalised];

        if (!coupon) {
          return { success: false, message: `"${normalised}" is not a valid coupon.` };
        }

        set({
          couponCode: normalised,
          appliedCoupon: { code: normalised, ...coupon },
        });

        const label =
          coupon.discountType === "percentage"
            ? `${coupon.discountValue}% off`
            : `₹${coupon.discountValue} off`;

        return { success: true, message: `Coupon applied — ${label}!` };
      },

      removeCoupon: () =>
        set({ couponCode: null, appliedCoupon: null }),

      setCouponCode: (code) => set({ couponCode: code }),

      /**
       * Returns the rupee amount to deduct based on the applied coupon.
       * Call this inside your component:
       *   const couponDiscount = useCheckoutStore((s) => s.getCouponDiscount());
       */
      getCouponDiscount: (): number => {
        const { appliedCoupon, cart, discount } = get();
        if (!appliedCoupon) return 0;

        // Coupon applies on product subtotal only (after any existing discount)
        const subtotal = Math.max(
          0,
          cart.reduce((sum, item) => sum + item.product_price * (item.quantity ?? 1), 0) - discount
        );

        if (appliedCoupon.discountType === "percentage") {
          return Math.round((subtotal * appliedCoupon.discountValue) / 100);
        }
        // flat — never exceed the subtotal
        return Math.min(appliedCoupon.discountValue, subtotal);
      },

      // ── Addresses ───────────────────────────────────────────────────
      addAddress: (address, label) =>
        set((state) => {
          const id = `addr_${Date.now()}`;
          const newAddr: SavedAddress = { ...address, id, label };
          return { savedAddresses: [...state.savedAddresses, newAddr] };
        }),

      updateAddress: (id, address, label) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((a) =>
            a.id === id ? { ...address, id, label } : a
          ),
          address: state.selectedAddressId === id ? address : state.address,
        })),

      deleteAddress: (id) =>
        set((state) => {
          const remaining = state.savedAddresses.filter((a) => a.id !== id);
          const wasSelected = state.selectedAddressId === id;
          return {
            savedAddresses: remaining,
            selectedAddressId: wasSelected ? null : state.selectedAddressId,
            address: wasSelected ? null : state.address,
          };
        }),

      selectAddress: (id) =>
        set((state) => {
          const found = state.savedAddresses.find((a) => a.id === id);
          if (!found) return {};
          return { selectedAddressId: id, address: found };
        }),

      deselectAddress: () => set({ selectedAddressId: null, address: null }),

      setAddress: (address) => set({ address }),
    }),
    {
      name: "ecoyaan-checkout-v4", // bumped — new shape
      storage: createJSONStorage(() => localStorage),
    }
  )
);