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
  const { cart, setCartData, updateQuantity, removeItem, shippingFee } =
    useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (cart.length === 0) {
      setCartData(
        initialData.cartItems,
        initialData.shipping_fee,
        initialData.discount_applied
      );
    } else {
      cart.forEach((item) => {
        const max = item.max_stock ?? 99;
        if (item.quantity > max) {
          updateQuantity(item.product_id, max);
        }
      });
    }
  }, [isMounted, cart.length]);

  if (!isMounted) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product_price * (item.quantity || 1),
    0
  );

  const grandTotal = subtotal + shippingFee;

  const handleIncrease = (
    id: number,
    currentQty: number,
    maxStock: number
  ) => {
    if (currentQty >= maxStock) {
      toast.error(`Only ${maxStock} items available in stock.`);
      return;
    }
    updateQuantity(id, currentQty + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      <Toaster position="top-center" />

      {/* LEFT SECTION */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-8">
        {cart.length === 0 ? (
          <div className="bg-white p-14 rounded-3xl border border-gray-100 text-center shadow-md">
            <Leaf className="mx-auto h-16 w-16 text-emerald-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Your cart feels light 🌿
            </h3>
            <p className="text-gray-500 mb-8">
              Add eco-friendly products and make a difference.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          cart.map((item) => {
            const currentQty = item.quantity || 1;
            const maxStock = item.max_stock ?? 99;
            const isMaxedOut = currentQty >= maxStock;

            return (
              <div
                key={item.product_id}
                className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row gap-8">
                  <div className="relative w-full sm:w-36 h-36 rounded-2xl overflow-hidden border bg-gray-50">
                    <Image
                      src={item.image}
                      alt={item.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.product_name}
                        </h3>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-gray-400 hover:text-red-500 transition p-2"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <p className="text-2xl font-black text-emerald-600 mt-2">
                        ₹{item.product_price}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center bg-gray-100 rounded-xl p-1">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              Math.max(1, currentQty - 1)
                            )
                          }
                          className="w-10 h-10 rounded-lg bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-bold text-lg">
                          {currentQty}
                        </span>
                        <button
                          onClick={() =>
                            handleIncrease(
                              item.product_id,
                              currentQty,
                              maxStock
                            )
                          }
                          disabled={isMaxedOut}
                          className={`w-10 h-10 rounded-lg shadow-sm transition active:scale-95 ${
                            isMaxedOut
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-white hover:bg-gray-50"
                          }`}
                        >
                          +
                        </button>
                      </div>

                      {maxStock <= 15 && (
                        <span
                          className={`text-sm font-medium ${
                            isMaxedOut
                              ? "text-amber-600"
                              : "text-gray-500"
                          }`}
                        >
                          {isMaxedOut
                            ? "Maximum stock reached"
                            : `Only ${maxStock} left`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 sticky top-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Order Summary
          </h2>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal}
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                ₹{shippingFee}
              </span>
            </div>
          </div>

          <div className="border-t pt-6 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-lg font-bold text-gray-900">
                  Grand Total
                </p>
              </div>
              <p className="text-4xl font-black text-emerald-600">
                ₹{grandTotal}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/shipping")}
            disabled={cart.length === 0}
            className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            Secure Checkout <ArrowRight size={20} />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            256-bit secure checkout
          </div>
        </div>
      </div>
    </div>
  );
}