import { getMockCartData } from "../lib/mockData";
import CartClient from "../components/CartClient";

export default async function CartPage() {
  const cartData = await getMockCartData();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Shopping Cart
          </h1>
          <p className="text-gray-500 mt-3 text-lg">
            Review your eco-friendly selections before proceeding to checkout.
          </p>
        </div>

        <CartClient initialData={cartData} />
      </div>
    </main>
  );
}