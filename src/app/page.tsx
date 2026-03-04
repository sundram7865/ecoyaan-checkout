import { getMockCartData } from "../lib/mockData";
import CartClient from "../components/CartClient";

export default async function CartPage() {
  const cartData = await getMockCartData();

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Cart</h1>
          <p className="text-gray-500 mt-2">Review your eco-friendly products before checkout.</p>
        </div>
        <CartClient initialData={cartData} />
      </div>
    </main>
  );
}