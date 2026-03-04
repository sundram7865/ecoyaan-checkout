import ShippingClient from "../../components/ShippingClient";

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="mb-10 flex items-center justify-center space-x-4 text-sm font-bold">
          <span className="text-emerald-600 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">1</div> Cart
          </span>
          <div className="w-12 h-0.5 bg-emerald-200"></div>
          <span className="text-gray-900 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center">2</div> Shipping
          </span>
          <div className="w-12 h-0.5 bg-gray-200"></div>
          <span className="text-gray-400 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">3</div> Payment
          </span>
        </div>

        <ShippingClient />
      </div>
    </main>
  );
}