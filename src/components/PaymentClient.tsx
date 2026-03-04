"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCheckoutStore } from "../store/useCheckoutStore";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function PaymentClient() {
  const router = useRouter();
  const { cart, shippingFee, address, clearCart } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (cart.length === 0 && !isSuccess) {
        router.push("/");
      } else if (!address && !isSuccess) {
        router.push("/shipping");
      }
    }
  }, [isMounted, cart.length, address, isSuccess, router]);

  if (!isMounted || (!address && !isSuccess) || (cart.length === 0 && !isSuccess)) {
    return null;
  }

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product_price * (item.quantity || 1),
    0
  );

  const grandTotal = subtotal + shippingFee;

  const handlePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setOrderId(`ECO-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
    }, 2000);
  };

  /* ================= SUCCESS UI ================= */

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-10 bg-white rounded-3xl shadow-2xl border border-emerald-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="text-emerald-600 w-12 h-12" />
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
          Payment Successful!
        </h2>
        <p className="text-gray-500 mb-8 text-lg">
          Your eco-friendly order is confirmed 🌱
        </p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <p className="text-sm text-gray-500 font-medium mb-1">
            Order Reference
          </p>
          <p className="text-2xl font-black text-gray-900 tracking-wider">
            {orderId}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Confirmation sent to{" "}
            <span className="font-semibold text-gray-800">
              {address?.email}
            </span>
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 font-sans">
      {/* LEFT SIDE */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-8">
        
        {/* Shipping Card */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="text-emerald-500" />
            Shipping Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 text-lg">
                {address.fullName}
              </p>
              <p>{address.email}</p>
              <p>+91 {address.phone}</p>
            </div>

            <div className="space-y-1">
              <p>
                {address.city}, {address.state}
              </p>
              <p>PIN: {address.pinCode}</p>
              <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
                <CheckCircle2 size={14} /> Verified Address
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/shipping")}
            className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
          >
            Edit Address
          </button>
        </div>

        {/* Cart Card */}
        <div className="bg-white p-8 rounded-3xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-emerald-500" />
            Order Items
          </h3>

          <div className="space-y-5">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-none"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden relative border border-gray-100">
                  <Image
                    src={item.image}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-grow">
                  <p className="font-semibold text-gray-900">
                    {item.product_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <div className="text-lg font-bold text-gray-900">
                  ₹{item.product_price * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/")}
            className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 underline underline-offset-4"
          >
            Edit Cart
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 sticky top-8">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-2">
            <CreditCard className="text-emerald-500" />
            Payment Summary
          </h2>

          <div className="space-y-4 mb-6 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                ₹{shippingFee}
              </span>
            </div>
          </div>

          <div className="border-t border-dashed border-gray-300 pt-6 mb-8">
            <div className="flex justify-between items-end">
              <div>
                <span className="block text-sm text-gray-500">
                  Total Amount
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  Grand Total
                </span>
              </div>

              <span className="text-4xl font-black text-emerald-600">
                ₹{grandTotal}
              </span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full font-bold py-4 px-4 rounded-2xl transition-all flex justify-center items-center gap-2 shadow-md transform ${
              isProcessing
                ? "bg-emerald-800 text-white cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700 hover:-translate-y-1 active:scale-95 text-white hover:shadow-2xl"
            }`}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={18} />
                Pay Securely ₹{grandTotal}
              </>
            )}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium text-center">
            <ShieldCheck size={16} />
            256-bit encrypted secure simulated payment
          </div>
        </div>
      </div>
    </div>
  );
}