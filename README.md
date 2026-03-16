# Ecoyaan Checkout Flow

> **Frontend Engineering Assignment** Multi-step checkout built with Next.js 16, Zustand, React Hook Form, and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=flat-square&logo=vercel)](https://ecoyaan-checkout-pi.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

🔗 **[ecoyaan-checkout-pi.vercel.app](https://ecoyaan-checkout-pi.vercel.app/)**

## What Was Built

A production-quality, three-step checkout flow:

**Cart → Shipping → Payment → Order Confirmation**

Each step was engineered with real-world constraints in mind: SSR data loading, hydration safety, persistent cross-page state, multi-address management, form validation, and stock protection. Not just a UI exercise.

## Engineering Highlights

### Server-Side Rendering
Cart data is fetched in a Next.js async Server Component before the page reaches the browser. The client receives a fully populated page on first paint: no loading spinners, no layout shift, SEO-ready.

```ts
// app/page.tsx - Server Component
export default async function CartPage() {
  const cartData = await getMockCartData(); // runs on server
  return <CartClient initialData={cartData} />;
}
```

### State Architecture: Zustand + localStorage
A single Zustand store manages the entire checkout session. Switching from `sessionStorage` to `localStorage` ensures state survives hard reloads. The store is carefully designed so `clearCart()` wipes order data but **preserves saved addresses**, because those belong to the user, not the order.

```ts
clearCart: () =>
  set({ cart: [], address: null, shippingFee: 0, selectedAddressId: null })
  // savedAddresses intentionally untouched
```

### Multi-Address Management
Users can save, edit, delete, and select from multiple delivery addresses, each labelled (Home / Work / Other). Key design decision: **addresses are never auto-selected**. `selectedAddressId` is only set via an explicit user tap, preventing stale persisted state from silently bypassing the selection step.

```ts
// addAddress does NOT set selectedAddressId
// selectAddress is the only setter, called on explicit card tap
addAddress: (address, label) =>
  set((state) => ({
    savedAddresses: [...state.savedAddresses, { ...address, id, label }],
    // no selectedAddressId update here
  }))
```

### Form Validation: React Hook Form + Zod
Type-safe schema validation with precise error messages, minimal re-renders, and zero controlled component overhead.

```ts
export const AddressSchema = z.object({
  email:   z.string().email("Please enter a valid email address"),
  phone:   z.string().regex(/^\d{10}$/, "Must be exactly 10 digits"),
  pinCode: z.string().regex(/^\d{6}$/, "Invalid PIN code"),
  // ...
});
```

### Payment State Snapshot Bug Fix
A non-obvious bug: when "Pay" is clicked, `clearCart()` sets `address: null` in the store, but the success screen still needs to display the address. The fix is snapshotting address and total into local component state **before** the store is cleared.

```ts
const handlePayment = () => {
  setConfirmedAddress(address);  // snapshot first
  setConfirmedTotal(grandTotal); // snapshot first
  setTimeout(() => {
    clearCart();                 // now safe to wipe
    setIsSuccess(true);
  }, 2200);
};
```

### Hydration Safety
All client components that read from the Zustand store are guarded with an `isMounted` flag before rendering. This prevents Next.js hydration mismatches when server HTML and client store state differ on first render.

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR Server Components, file-based routing |
| Language | TypeScript (strict) | End-to-end type safety |
| Styling | Tailwind CSS | Utility-first, zero runtime |
| State | Zustand + persist | Lightweight, no boilerplate, localStorage sync |
| Forms | React Hook Form + Zod | Uncontrolled inputs, schema-driven validation |
| Notifications | React Hot Toast | Non-blocking stock limit feedback |
| Icons | Lucide React | Tree-shakeable, consistent |
| Deployment | Vercel | Zero-config Next.js |

## Project Structure

```
app/
├── page.tsx                   # Cart (SSR Server Component)
├── shipping/page.tsx          # Shipping page
└── payment/page.tsx           # Payment page

components/
├── CartClient.tsx             # Cart UI + quantity controls
├── ShippingClient.tsx         # Address management + modal
├── PaymentClient.tsx          # Payment summary + success state
└── CheckoutStepper.tsx        # Shared progress indicator

store/
└── useCheckoutStore.ts        # Zustand store (cart + addresses)

lib/
├── mockData.ts                # SSR mock data source
└── validations.ts             # Zod schemas

types/
└── index.ts                   # Product, Address, SavedAddress
```

## Running Locally

```bash
git clone https://github.com/sundram7865/ecoyaan-checkout
cd ecoyaan-checkout
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Edge Cases Handled

| Scenario | Handling |
|---|---|
| Cart empty on shipping/payment page | Redirect to cart |
| No address selected on shipping | Continue button disabled, hint shown |
| Address auto-selected from previous session | Never happens, no auto-select by design |
| Quantity exceeds stock | Button disabled + toast notification |
| `address` nulled by `clearCart` on success screen | Pre-snapshotted into local state |
| Page reload mid-checkout | Full state restored from localStorage |
| Hydration mismatch (server vs client store) | `isMounted` guard on all store reads |

## If Extended to Production

- Real payment gateway via **Stripe** or **Razorpay**
- Address auto-fill from PIN code lookup (India Post API)
- **Optimistic UI** for quantity updates
- Order history page with server-side pagination
- Authentication with **NextAuth.js**
- Unit tests with **Jest + React Testing Library**
- E2E tests with **Playwright**

## Author

**Sundram Kumar Mishra** Frontend Developer

[![GitHub](https://img.shields.io/badge/GitHub-sundram7865-black?style=flat-square&logo=github)](https://github.com/sundram7865)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-sundram1mishra-blue?style=flat-square&logo=linkedin)](https://linkedin.com/in/sundram1mishra)
