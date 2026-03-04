"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { CartData } from "../types";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Leaf, ShieldCheck, ArrowRight } from "lucide-react";

export default function CartClient({ initialData }: { initialData: CartData }) {
  const router = useRouter();
  const { cart, setCartData, updateQuantity, removeItem, shippingFee } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);

  // Hydration sync
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Initialize data OR Auto-heal broken cached data
  useEffect(() => {
    if (!isMounted) return;

    if (cart.length === 0) {
      setCartData(
        initialData.cartItems,
        initialData.shipping_fee,
        initialData.discount_applied
      );
    } else {
      // Auto-healing logic: If a user's cache has 20 items but max is 10, silently fix it.
      cart.forEach((item) => {
        const max = item.max_stock ?? 99;
        if (item.quantity > max) {
          updateQuantity(item.product_id, max);
        }
      });
    }
  }, [isMounted, cart.length, initialData, setCartData, updateQuantity, cart]);

  if (!isMounted) {
    return (
      <div className="animate-pulse flex gap-10">
        <div className="w-2/3 space-y-6">
          <div className="h-40 bg-gray-200 rounded-3xl w-full"></div>
          <div className="h-40 bg-gray-200 rounded-3xl w-full"></div>
        </div>
        <div className="w-1/3 h-96 bg-gray-200 rounded-3xl"></div>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product_price * (item.quantity || 1),
    0
  );
  const grandTotal = subtotal + shippingFee;

  const handleIncrease = (id: number, currentQty: number, maxStock: number) => {
    if (currentQty >= maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`, {
        style: { borderRadius: '12px', background: '#333', color: '#fff' },
        iconTheme: { primary: '#f59e0b', secondary: '#fff' },
      });
      return;
    }
    updateQuantity(id, currentQty + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
      <Toaster position="top-center" />
      
      {/* Cart Items Section */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-6">
        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-gray-100 text-center shadow-sm">
            <Leaf className="mx-auto h-12 w-12 text-emerald-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven&apos;t added any eco-friendly products yet.</p>
          </div>
        ) : (
          cart.map((item) => {
            const currentQty = item.quantity || 1;
            const maxStock = item.max_stock ?? 99;
            const isMaxedOut = currentQty >= maxStock;

            return (
              <div
                key={item.product_id}
                className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-6 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Eco Badge */}
                <div className="absolute top-4 left-4 bg-emerald-100/80 backdrop-blur-sm text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1.5 z-10">
                  <Leaf size={12} /> Eco-Pick
                </div>

                <div className="relative w-full sm:w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.product_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                </div>
                
                <div className="flex-grow w-full py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight pr-4">
                        {item.product_name}
                      </h3>
                      <p className="text-xl font-black text-emerald-600 mt-2">₹{item.product_price}</p>
                    </div>
                    <button 
                      onClick={() => removeItem(item.product_id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 rounded-full hover:bg-red-50"
                      title="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-200">
                      <button
                        onClick={() => updateQuantity(item.product_id, Math.max(1, currentQty - 1))}
                        className="w-9 h-9 rounded-lg bg-white flex items-center justify-center hover:bg-gray-100 text-gray-700 shadow-sm transition-all"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-gray-800">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => handleIncrease(item.product_id, currentQty, maxStock)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shadow-sm ${
                          isMaxedOut
                            ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                            : "bg-white hover:bg-gray-100 text-gray-700"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    {maxStock <= 15 && (
                      <p className={`text-xs font-semibold ${isMaxedOut ? 'text-amber-600' : 'text-gray-500'}`}>
                        {isMaxedOut ? 'Max quantity reached' : `Only ${maxStock} left in stock`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Summary Section */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            Order Summary
          </h2>
          
          <div className="space-y-4 text-gray-600 mb-6">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-600">Subtotal</span>
              <span className="font-bold text-gray-900">₹{subtotal}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="font-medium text-gray-600">Standard Shipping</span>
              <span className="font-bold text-gray-900">₹{shippingFee}</span>
            </div>
          </div>

          <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-sm font-medium text-gray-500 mb-1">Total Amount</span>
                <span className="text-lg font-bold text-gray-900">Grand Total</span>
              </div>
              <span className="text-4xl font-black text-emerald-600 tracking-tight">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/shipping")}
            disabled={cart.length === 0}
            className={`w-full font-bold py-4 px-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-xl transform hover:-translate-y-1 ${
              cart.length === 0 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white"
            }`}
          >
            Secure Checkout <ArrowRight size={20} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500 font-medium">
            <ShieldCheck size={16} className="text-emerald-500" />
            Safe, secure, and eco-friendly packaging
          </div>
        </div>
      </div>
    </div>
  );
}