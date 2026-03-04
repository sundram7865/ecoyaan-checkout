import PaymentClient from "../../components/PaymentClient";

export default function PaymentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Premium Progress Stepper */}
        <div className="mb-14 flex items-center justify-center">
          <div className="flex items-center gap-6 text-sm font-semibold">
            
            {/* Step 1 */}
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold shadow-sm">
                1
              </div>
              <span className="hidden sm:inline">Cart</span>
            </div>

            <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold shadow-sm">
                2
              </div>
              <span className="hidden sm:inline">Shipping</span>
            </div>

            <div className="w-16 h-1 bg-emerald-500 rounded-full"></div>

            {/* Step 3 */}
            <div className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold shadow-md scale-110">
                3
              </div>
              <span className="hidden sm:inline">Payment</span>
            </div>

          </div>
        </div>

        <PaymentClient />
      </div>
    </main>
  );
}