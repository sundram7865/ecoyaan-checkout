"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { CartData } from "../types";
import toast, { Toaster } from "react-hot-toast";
import {
  Trash2, ArrowRight, ShieldCheck, Leaf, Minus, Plus,
  ShoppingBag, Truck, Tag, Ticket, X, CheckCircle2, ChevronDown,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CouponSection — collapsible widget that lives inside the summary panel
// ─────────────────────────────────────────────────────────────────────────────
function CouponSection() {
  const applyCoupon   = useCheckoutStore((s) => s.applyCoupon);
  const removeCoupon  = useCheckoutStore((s) => s.removeCoupon);
  const appliedCoupon = useCheckoutStore((s) => s.appliedCoupon);

  const [open, setOpen]         = useState(!!appliedCoupon);
  const [code, setCode]         = useState("");
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [shaking, setShaking]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 450);
  };

  const handleToggle = () => {
    setOpen((v) => {
      if (!v) setTimeout(() => inputRef.current?.focus(), 80);
      return !v;
    });
    setFeedback(null);
  };

  const handleApply = () => {
    if (!code.trim()) {
      triggerShake();
      setFeedback({ success: false, message: "Enter a coupon code first." });
      return;
    }
    const result = applyCoupon(code);
    setFeedback(result);
    if (result.success) {
      setCode("");
    } else {
      triggerShake();
    }
  };

  const handleRemove = () => {
    removeCoupon();
    setCode("");
    setFeedback(null);
  };

  const discountLabel = appliedCoupon
    ? appliedCoupon.discountType === "percentage"
      ? `${appliedCoupon.discountValue}% off`
      : `₹${appliedCoupon.discountValue} off`
    : "";

  return (
    <div className="border-t border-stone-800 pt-5 mb-1">
      {/* ── Accordion trigger ──────────────────────────────────────── */}
      <button
        onClick={handleToggle}
        className="flex items-center justify-between w-full text-left group mb-3"
      >
        <div className="flex items-center gap-2">
          <Ticket
            size={13}
            className={`transition ${appliedCoupon ? "text-emerald-400" : "text-stone-500 group-hover:text-emerald-400"}`}
          />
          <span className={`text-xs font-medium transition ${appliedCoupon ? "text-emerald-400" : "text-stone-400 group-hover:text-stone-300"}`}>
            {appliedCoupon ? `${appliedCoupon.code} — ${discountLabel}` : "Have a coupon code?"}
          </span>
        </div>
        <ChevronDown
          size={13}
          className={`text-stone-600 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Collapsible body ───────────────────────────────────────── */}
      {open && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {appliedCoupon ? (
            /* Applied pill */
            <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-emerald-300 text-xs font-bold tracking-wide">{appliedCoupon.code}</p>
                  <p className="text-emerald-500 text-[10px] font-medium">{discountLabel} applied</p>
                </div>
              </div>
              <button
                onClick={handleRemove}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-stone-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                aria-label="Remove coupon"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            /* Input row */
            <>
              <div
                className={shaking ? "animate-[shake_0.45s_ease-in-out]" : ""}
                style={
                  shaking
                    ? { animation: "shake 0.45s ease-in-out" }
                    : {}
                }
              >
                <style>{`
                  @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-5px); }
                    40%     { transform: translateX(5px); }
                    60%     { transform: translateX(-4px); }
                    80%     { transform: translateX(4px); }
                  }
                `}</style>
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value.toUpperCase());
                      setFeedback(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApply()}
                    placeholder="e.g. SAVE10"
                    className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white placeholder:text-stone-600 placeholder:font-normal tracking-widest focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition"
                  />
                  <button
                    onClick={handleApply}
                    className="px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 text-xs font-bold tracking-wide transition-all active:scale-95 flex-shrink-0"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {feedback && (
                <p className={`text-[11px] font-semibold flex items-center gap-1.5 ${feedback.success ? "text-emerald-400" : "text-rose-400"}`}>
                  {feedback.success ? <CheckCircle2 size={11} /> : <X size={11} />}
                  {feedback.message}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CartClient
// ─────────────────────────────────────────────────────────────────────────────
export default function CartClient({ initialData }: { initialData: CartData }) {
  const router = useRouter();
  const {
    cart, setCartData, updateQuantity, removeItem,
    shippingFee, discount, getCouponDiscount, appliedCoupon,
  } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (cart.length === 0) {
      setCartData(initialData.cartItems, initialData.shipping_fee, initialData.discount_applied);
    } else {
      cart.forEach((item) => {
        const max = item.max_stock ?? 99;
        if (item.quantity > max) updateQuantity(item.product_id, max);
      });
    }
  }, [isMounted, cart.length]);

  if (!isMounted) return null;

  // ── Totals ────────────────────────────────────────────────────────────────
  const subtotal       = cart.reduce((acc, item) => acc + item.product_price * (item.quantity || 1), 0);
  const couponDiscount = getCouponDiscount();                              // ← from store
  const grandTotal     = Math.max(0, subtotal + shippingFee - discount - couponDiscount);
  const totalSavings   = discount + couponDiscount;
  const itemCount      = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleIncrease = (id: number, currentQty: number, maxStock: number) => {
    if (currentQty >= maxStock) {
      toast.error(`Only ${maxStock} in stock`, {
        style: { borderRadius: "14px", fontWeight: 600, fontSize: "13px", background: "#1c1917", color: "#fff" },
        iconTheme: { primary: "#f97316", secondary: "#fff" },
      });
      return;
    }
    updateQuantity(id, currentQty + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
      <Toaster position="top-center" />

      {/* ── LEFT: Items ─────────────────────────────────────────────── */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} className="text-stone-400" />
            <h2 className="text-sm font-bold text-stone-500 uppercase tracking-widest">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-medium">Free returns · 30 days</span>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl border border-stone-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">Your cart is empty</h3>
            <p className="text-stone-400 mb-8 text-sm">Add eco-friendly products and make a difference.</p>
            <button
              onClick={() => router.push("/")}
              className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-stone-800 transition-all text-sm tracking-wide"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => {
              const currentQty = item.quantity || 1;
              const maxStock   = item.max_stock ?? 99;
              const isMaxedOut = currentQty >= maxStock;
              return (
                <div
                  key={item.product_id}
                  className="group bg-white rounded-2xl border border-stone-100 p-5 hover:border-stone-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex gap-5 items-start">
                    <div className="relative w-[88px] h-[88px] rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h3 className="font-semibold text-stone-900 text-sm leading-snug">{item.product_name}</h3>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Tag size={10} className="text-emerald-500" />
                            <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wide">Eco Certified</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-rose-500 hover:bg-rose-50 transition flex-shrink-0"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.product_id, Math.max(1, currentQty - 1))}
                            className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm hover:bg-stone-100 transition active:scale-90 border border-stone-100"
                          >
                            <Minus size={13} className="text-stone-600" />
                          </button>
                          <span className="w-9 text-center font-bold text-sm text-stone-900">{currentQty}</span>
                          <button
                            onClick={() => handleIncrease(item.product_id, currentQty, maxStock)}
                            disabled={isMaxedOut}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm transition active:scale-90 border ${
                              isMaxedOut
                                ? "bg-stone-100 border-stone-100 text-stone-300 cursor-not-allowed"
                                : "bg-white border-stone-100 hover:bg-stone-100 text-stone-600"
                            }`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-stone-900 text-base">₹{item.product_price * currentQty}</p>
                          {currentQty > 1 && (
                            <p className="text-[11px] text-stone-400">₹{item.product_price} each</p>
                          )}
                        </div>
                      </div>
                      {maxStock <= 15 && (
                        <p className={`text-[11px] font-semibold mt-2 ${isMaxedOut ? "text-rose-500" : "text-amber-500"}`}>
                          {isMaxedOut ? "Maximum stock reached" : `Only ${maxStock} left in stock`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {cart.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: "Free shipping over ₹500" },
              { icon: Leaf, text: "100% Eco-certified" },
              { icon: ShieldCheck, text: "Secure checkout" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="bg-stone-50 rounded-xl px-3 py-2.5 flex items-center gap-2">
                <Icon size={13} className="text-emerald-500 flex-shrink-0" />
                <span className="text-[11px] font-medium text-stone-500 leading-tight">{text}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: Order Summary ────────────────────────────────────── */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl sticky top-8">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-stone-800">
            <h2 className="text-lg font-bold text-white tracking-tight">Order Summary</h2>
            <p className="text-stone-500 text-xs mt-1">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>
          </div>

          <div className="px-8 py-6">
            {/* Line items */}
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={item.product_id} className="flex justify-between items-start gap-3">
                  <span className="text-stone-400 text-xs leading-relaxed flex-1">
                    {item.product_name}
                    <span className="text-stone-600"> ×{item.quantity}</span>
                  </span>
                  <span className="text-white text-xs font-semibold flex-shrink-0">
                    ₹{item.product_price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Coupon widget ──────────────────────────────────────── */}
            <CouponSection />

            {/* Price breakdown */}
            <div className="border-t border-stone-800 pt-5 space-y-3 mb-6">

              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-stone-200 font-medium">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {/* Existing discount (from server / promo) */}
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Discount</span>
                  <span className="text-emerald-400 font-medium">−₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Shipping</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? <span className="text-emerald-400">Free</span>
                    : <span className="text-stone-200">₹{shippingFee.toLocaleString("en-IN")}</span>}
                </span>
              </div>

              {/* Coupon row — full breakdown when applied */}
              {couponDiscount > 0 && appliedCoupon && (
                <>
                  {/* Separator */}
                  <div className="border-t border-stone-800/60 pt-3 mt-1" />

                  {/* Coupon code + % label */}
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <Ticket size={11} />
                      {appliedCoupon.code}
                      <span className="text-emerald-600 font-medium text-[11px]">
                        ({appliedCoupon.discountValue}% off)
                      </span>
                    </span>
                    <span className="text-emerald-400 font-bold">
                      −₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* Before / after mini-comparison */}
                  <div className="bg-stone-800/50 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-stone-500 text-[10px] font-medium mb-0.5">Before</p>
                      <p className="text-stone-400 text-xs font-semibold line-through">
                        ₹{(subtotal + shippingFee - discount).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-emerald-500 text-xs font-black tracking-wide">→</div>
                    <div className="text-center">
                      <p className="text-emerald-400 text-[10px] font-medium mb-0.5">After coupon</p>
                      <p className="text-white text-xs font-bold">
                        ₹{grandTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-emerald-500 text-[10px] font-medium mb-0.5">You save</p>
                      <p className="text-emerald-400 text-xs font-bold">
                        ₹{totalSavings.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Total */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Total Payable</p>
                  {/* Strike original if coupon active */}
                  {couponDiscount > 0 && (
                    <p className="text-stone-600 text-sm line-through mt-0.5">
                      ₹{(subtotal + shippingFee - discount).toLocaleString("en-IN")}
                    </p>
                  )}
                  <p className="text-white text-3xl font-black mt-0.5 tracking-tight">
                    ₹{grandTotal.toLocaleString("en-IN")}
                  </p>
                  {totalSavings > 0 && (
                    <p className="text-emerald-500 text-[10px] font-semibold mt-1">
                      🎉 You save ₹{totalSavings.toLocaleString("en-IN")} on this order
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-[10px] font-semibold">Incl. all taxes</p>
                  {couponDiscount > 0 && appliedCoupon && (
                    <p className="text-emerald-600 text-[10px] font-bold mt-1">
                      {appliedCoupon.discountValue}% coupon applied
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push("/shipping")}
              disabled={cart.length === 0}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-900 font-bold text-sm tracking-wide transition-all shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Proceed to Checkout <ArrowRight size={17} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-stone-600 font-medium mt-5">
              <ShieldCheck size={13} className="text-emerald-600" />
              256-bit SSL Secured
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

