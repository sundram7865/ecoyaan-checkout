# 🌱 Ecoyaan Checkout Flow – Frontend Engineering Assignment

A modern **multi-step checkout flow** built with **Next.js 16, React, Tailwind CSS, and Zustand**, demonstrating **Server-Side Rendering (SSR), state management, form validation, and responsive UI**.

This project simulates a real **e-commerce checkout experience**, guiding users through:

1️⃣ Cart Review  
2️⃣ Shipping Details  
3️⃣ Payment Confirmation  

The application focuses on **clean architecture, intuitive UX, and modern frontend engineering practices**.

---

# 🚀 Live Demo

Deployed on Vercel

🔗 Live App:  
`https://ecoyaan-checkout-pi.vercel.app/`

---

# 📸 Screens

### 🛒 Cart Page
- Displays products using **Server Side Rendered mock data**
- Users can **increase/decrease quantity**
- Quantity **cannot exceed available stock**
- Shows **subtotal, shipping fee, and grand total**

### 📦 Shipping Page
- Collects user shipping details
- Uses **React Hook Form + Zod validation**
- Validates:
  - Email format
  - 10 digit phone number
  - Required fields
  - PIN Code

### 💳 Payment Page
- Displays **final order summary**
- Shows **shipping address**
- Simulated **secure payment**
- Generates a **fake order ID**
- Shows **success confirmation UI**

---

# 🧠 Key Engineering Concepts Demonstrated

### 1️⃣ Server Side Rendering (SSR)

Cart data is **fetched during server render**, ensuring the page loads with data immediately.

Benefits:
- Faster first paint
- SEO friendly
- Avoids loading states for cart items

SSR provides the **initial cart state** to the client.

---

### 2️⃣ Global State Management (Zustand)

A **central checkout store** manages state across pages:

- Cart items
- Shipping fee
- Address details
- Quantity updates
- Item removal
- Cart clearing after payment

This avoids **prop drilling** and keeps components clean.

Store Example:

```ts
useCheckoutStore()
```

Shared state across:

- Cart page
- Shipping page
- Payment page

---

### 3️⃣ Form Validation

Shipping form uses:

- **React Hook Form**
- **Zod schema validation**

Benefits:

- Type-safe validation
- Minimal re-renders
- Clean error messages
- Strong input constraints

Example validations:

- Valid email
- Phone number length
- Required address fields
- PIN code length

---

### 4️⃣ Stock Limit Protection

Cart quantity **cannot exceed product stock**.

Implemented with:

- UI button disabling
- Validation before increment
- Toast error notifications

Example logic:

```ts
if (currentQty >= maxStock) {
  toast.error(`Only ${maxStock} items available in stock`)
}
```

This simulates **real e-commerce inventory protection**.

---

### 5️⃣ Hydration Safe Rendering

Client components use:

```ts
isMounted state
```

This prevents **Next.js hydration mismatches** when using client-side stores.

---

### 6️⃣ Multi-Step Checkout Flow

User journey:

```
Cart → Shipping → Payment → Success
```

Navigation rules implemented:

- Redirect to cart if cart is empty
- Redirect to shipping if address missing
- Clear cart after successful payment

---

# 🧱 Project Architecture

```
app/
 ├── page.tsx                # Cart Page (SSR)
 ├── shipping/
 │    └── page.tsx
 ├── payment/
 │    └── page.tsx

components/
 ├── CartClient.tsx
 ├── ShippingClient.tsx
 ├── PaymentClient.tsx

store/
 └── useCheckoutStore.ts

lib/
 └── validations.ts

types/
 └── index.ts
```

Architecture highlights:

- **Server Components for page layout**
- **Client Components for interaction**
- **Centralized state via Zustand**
- **Separation of concerns**

---

# 🎨 UI/UX Design Decisions

Focus was placed on **modern and intuitive UX**.

Features implemented:

✔ Step progress indicator  
✔ Responsive grid layout  
✔ Card-based UI  
✔ Animated success state  
✔ Sticky order summary  
✔ Smooth hover and button transitions  
✔ Mobile responsive design  

Icons powered by **Lucide Icons**.

---

# 📦 Tech Stack

| Technology | Purpose |
|------------|--------|
| Next.js 16 | React Framework |
| React 19 | UI Library |
| Tailwind CSS | Styling |
| Zustand | Global State |
| React Hook Form | Form Handling |
| Zod | Form Validation |
| Lucide Icons | UI Icons |
| React Hot Toast | Notifications |
| Vercel | Deployment |

---

# 📊 Mock Data (SSR)

Cart data is loaded using mock JSON:

```json
{
  "cartItems": [
    {
      "product_id": 101,
      "product_name": "Bamboo Toothbrush (Pack of 4)",
      "product_price": 299,
      "quantity": 2,
      "image": "via.placeholder.com/150",
      max_stock: 10
    },
    {
      "product_id": 102,
      "product_name": "Reusable Cotton Produce Bags",
      "product_price": 450,
      "quantity": 1,
      "image": "via.placeholder.com/150",
      max_stock: 5
    }
  ],
  "shipping_fee": 50,
  "discount_applied": 0
}
```

---

# 💻 Running Locally

Clone the repository:

```bash
git clone https://github.com/yourusername/ecoyaan-checkout
```

Navigate into project:

```bash
cd ecoyaan-checkout
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open browser:

```
http://localhost:3000
```

---

# 🔐 Simulated Payment Flow

Payment is simulated using:

```ts
setTimeout(() => {
  setIsSuccess(true)
  setOrderId(`ECO-${randomNumber}`)
}, 2000)
```

Features:

- Processing loader
- Secure payment UI
- Random order ID generation
- Cart cleared after payment

---

# 📱 Responsive Design

The UI is optimized for:

- Desktop
- Tablet
- Mobile

Techniques used:

- Tailwind responsive grid
- Flexible layouts
- Mobile-first spacing

---

# 🧪 Edge Cases Handled

✔ Cart empty state  
✔ Quantity exceeding stock  
✔ Direct navigation to payment  
✔ Form validation errors  
✔ Hydration mismatch prevention  

---

# 📈 Possible Future Improvements

If this were production ready:

- Real payment gateway integration (Stripe)
- Authentication
- Real product inventory API
- Order history page
- Address auto-fill via PIN lookup
- Unit tests with Jest/RTL

---

# 👨‍💻 Author

Sundram Kumar Mishra

Frontend Developer | React | Next.js | UI Engineering

GitHub:  
`https://github.com/yourusername`

LinkedIn:  
`https://linkedin.com/in/sundram1mishra`

---

# 🙏 Thank You

Thank you **Team Ecoyaan** for the opportunity.

This assignment was a great exercise to demonstrate:

- Next.js Server Rendering
- Checkout flow architecture
- Modern React patterns
- UX-focused frontend engineering
