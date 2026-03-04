import ShippingClient from "../../components/ShippingClient";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Modern Stepper */}
        <div className="mb-14 flex items-center justify-center gap-6 text-sm font-semibold">
          <div className="flex items-center gap-2 text-emerald-600">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              1
            </div>
            Cart
          </div>

          <div className="w-16 h-0.5 bg-emerald-300"></div>

          <div className="flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center">
              2
            </div>
            Shipping
          </div>

          <div className="w-16 h-0.5 bg-gray-200"></div>

          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              3
            </div>
            Payment
          </div>
        </div>

        <ShippingClient />
      </div>
    </main>
  );
}