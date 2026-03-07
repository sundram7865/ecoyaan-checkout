import ShippingClient from "../../components/ShippingClient";
import CheckoutStepper from "../../components/CheckoutStepper";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">Checkout</h1>
          <p className="text-stone-400 mt-2 text-sm">Secure · Eco-friendly · Carbon neutral delivery</p>
        </div>
        <CheckoutStepper current={2} />
        <ShippingClient />
      </div>
    </main>
  );
}