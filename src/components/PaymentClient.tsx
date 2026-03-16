"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { Address } from "../types";
import {
  CheckCircle2, CreditCard, Lock, MapPin,
  Package, ShieldCheck, Loader2, ArrowLeft,
  Check, Leaf, Ticket,
} from "lucide-react";

export default function PaymentClient() {
  const router = useRouter();
  const {
    cart, shippingFee, discount, address,
    getCouponDiscount, appliedCoupon,
    clearCart,
  } = useCheckoutStore();

  const [isMounted, setIsMounted]       = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [orderId, setOrderId]           = useState("");

  // Snapshot everything BEFORE clearCart wipes the store
  const [confirmedAddress, setConfirmedAddress]             = useState<Address | null>(null);
  const [confirmedTotal, setConfirmedTotal]                 = useState(0);
  const [confirmedSavings, setConfirmedSavings]             = useState(0);
  const [confirmedCouponCode, setConfirmedCouponCode]       = useState<string | null>(null);
  const [confirmedCouponDiscount, setConfirmedCouponDiscount] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isMounted || isSuccess) return;
    if (cart.length === 0) router.push("/");
    else if (!address) router.push("/shipping");
  }, [isMounted, cart.length, address, isSuccess, router]);

  if (!isMounted || (!address && !isSuccess) || (cart.length === 0 && !isSuccess)) return null;

  // ── Shared totals (single source of truth) ──────────────────────────────
  const subtotal       = cart.reduce((acc, item) => acc + item.product_price * (item.quantity || 1), 0);
  const couponDiscount = getCouponDiscount();
  const grandTotal     = Math.max(0, subtotal + shippingFee - discount - couponDiscount);
  const totalSavings   = discount + couponDiscount;

  const handlePayment = () => {
    // Snapshot before clearCart nulls everything
    setConfirmedAddress(address);
    setConfirmedTotal(grandTotal);
    setConfirmedSavings(totalSavings);
    setConfirmedCouponCode(appliedCoupon?.code ?? null);
    setConfirmedCouponDiscount(couponDiscount);

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setOrderId(`ECO-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
    }, 2200);
  };

  // ── Success Screen ───────────────────────────────────────────────────────
  if (isSuccess) {
    const a = confirmedAddress!;
    return (
      <div className="max-w-lg mx-auto mt-4">
        <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl">
          {/* Top band */}
          <div className="bg-emerald-500 px-10 py-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
            />
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-sm border border-white/30">
                <CheckCircle2 className="text-white w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Order Confirmed!</h2>
              <p className="text-emerald-100 mt-2 text-sm flex items-center justify-center gap-1.5">
                <Leaf size={14} /> Your eco-friendly order is on its way
              </p>
            </div>
          </div>

          <div className="px-8 py-8 space-y-4">
            {/* Order ID */}
            <div className="bg-stone-800 rounded-2xl p-5">
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-1.5">Order Reference</p>
              <p className="text-2xl font-black text-white tracking-wider">{orderId}</p>
              <p className="text-xs text-stone-500 mt-2.5">
                Confirmation sent to <span className="font-semibold text-stone-300">{a.email}</span>
              </p>
            </div>

            {/* Address + Total */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-800 rounded-2xl p-4">
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-2">Delivering to</p>
                <p className="font-bold text-white text-sm">{a.fullName}</p>
                <p className="text-stone-400 text-xs mt-0.5">{a.city}, {a.state}</p>
                <p className="text-stone-500 text-xs">PIN {a.pinCode}</p>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Amount Paid</p>
                <p className="font-black text-white text-2xl tracking-tight">
                  ₹{confirmedTotal.toLocaleString("en-IN")}
                </p>
                <p className="text-emerald-400 text-[10px] mt-1 font-semibold">Payment successful</p>
              </div>
            </div>

            {/* Savings recap — only if user saved something */}
            {confirmedSavings > 0 && (
              <div className="bg-stone-800/60 border border-stone-700 rounded-2xl px-5 py-4">
                <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest mb-3">Savings Summary</p>
                <div className="space-y-2">
                  {confirmedCouponDiscount > 0 && confirmedCouponCode && (
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Ticket size={11} /> {confirmedCouponCode}
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        −₹{confirmedCouponDiscount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-stone-400">Other discounts</span>
                      <span className="text-emerald-400 font-semibold">
                        −₹{discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-stone-700 pt-2 flex justify-between text-sm">
                    <span className="text-white font-bold">Total saved</span>
                    <span className="text-emerald-400 font-black">
                      ₹{confirmedSavings.toLocaleString("en-IN")} 🎉
                    </span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => router.push("/")}
              className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-sm transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const safeAddress = address!;

  // ── Main Payment Screen ──────────────────────────────────────────────────
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 pb-28">

      {/* ── LEFT ── */}
      <div className="lg:col-span-7 xl:col-span-8 space-y-4">

        {/* Shipping address card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <MapPin size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">Shipping Address</h3>
            </div>
            <button onClick={() => router.push("/shipping")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
              Change
            </button>
          </div>
          <div className="flex gap-6 text-sm">
            <div className="flex-1">
              <p className="font-bold text-stone-900">{safeAddress.fullName}</p>
              <p className="text-stone-400 text-xs mt-0.5">{safeAddress.email}</p>
              <p className="text-stone-400 text-xs">+91 {safeAddress.phone}</p>
            </div>
            <div className="flex-1">
              <p className="text-stone-700 text-xs font-semibold">{safeAddress.city}, {safeAddress.state}</p>
              <p className="text-stone-400 text-xs mt-0.5">PIN: {safeAddress.pinCode}</p>
              <div className="flex items-center gap-1 mt-2">
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check size={9} className="text-white" strokeWidth={3} />
                </div>
                <p className="text-[11px] font-semibold text-emerald-600">Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package size={14} className="text-emerald-600" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm">
                Order Items
                <span className="ml-2 bg-stone-100 text-stone-500 text-xs font-bold px-2 py-0.5 rounded-lg">{cart.length}</span>
              </h3>
            </div>
            <button onClick={() => router.push("/")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 underline underline-offset-4">
              Edit Cart
            </button>
          </div>
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.product_id} className="flex items-center gap-4 py-3 border-b border-stone-50 last:border-none">
                <div className="w-14 h-14 bg-stone-50 rounded-xl overflow-hidden relative border border-stone-100 flex-shrink-0">
                  <Image src={item.image} alt={item.product_name} fill className="object-cover" unoptimized />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-stone-900 text-sm truncate">{item.product_name}</p>
                  <p className="text-xs text-stone-400 mt-0.5">Qty: {item.quantity}</p>
                </div>
                <p className="font-black text-stone-900 text-sm flex-shrink-0">
                  ₹{item.product_price * (item.quantity || 1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Payment panel ── */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl sticky top-8">
          <div className="px-7 pt-7 pb-5 border-b border-stone-800 flex items-center gap-3">
            <CreditCard size={17} className="text-emerald-400" />
            <h2 className="font-bold text-white text-sm tracking-tight">Payment Summary</h2>
          </div>

          <div className="px-7 py-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-stone-200 font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Discount</span>
                  <span className="text-emerald-400 font-medium">−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? <span className="text-emerald-400">Free</span>
                    : <span className="text-stone-200">₹{shippingFee.toLocaleString("en-IN")}</span>}
                </span>
              </div>

              {/* Coupon row */}
              {couponDiscount > 0 && appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Ticket size={11} />
                    {appliedCoupon.code}
                    <span className="text-emerald-600 text-[10px]">({appliedCoupon.discountValue}% off)</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    −₹{couponDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {/* Total box */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-1">Amount Payable</p>
              {couponDiscount > 0 && (
                <p className="text-stone-600 text-sm line-through">
                  ₹{(subtotal + shippingFee - discount).toLocaleString("en-IN")}
                </p>
              )}
              <p className="text-white text-3xl font-black tracking-tight">
                ₹{grandTotal.toLocaleString("en-IN")}
              </p>
              {totalSavings > 0 && (
                <p className="text-emerald-500 text-[10px] font-semibold mt-1">
                  🎉 You save ₹{totalSavings.toLocaleString("en-IN")} on this order
                </p>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg ${
                isProcessing
                  ? "bg-emerald-700 text-white cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-400 text-stone-900 hover:shadow-emerald-500/30 active:scale-[0.98]"
              }`}
            >
              {isProcessing ? (
                <><Loader2 size={17} className="animate-spin text-white" /><span className="text-white">Processing...</span></>
              ) : (
                <><Lock size={15} /> Pay ₹{grandTotal.toLocaleString("en-IN")} Securely</>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 font-medium">
              <ShieldCheck size={13} className="text-emerald-600" />
              256-bit encrypted · Simulated payment
            </div>
          </div>
        </div>
      </div>

      {/* ══ STICKY BOTTOM BAR (mobile) ══════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl lg:hidden">
        <div className="px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => router.push("/shipping")}
            className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-stone-200 text-stone-700 font-bold text-sm rounded-xl transition active:scale-95">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all shadow-md ${
              isProcessing
                ? "bg-emerald-700 text-white cursor-not-allowed"
                : "bg-emerald-500 hover:bg-emerald-400 text-stone-900 active:scale-95"
            }`}
          >
            {isProcessing
              ? <><Loader2 size={15} className="animate-spin text-white" /><span className="text-white">Processing...</span></>
              : <><Lock size={14} /> Pay ₹{grandTotal.toLocaleString("en-IN")}</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}