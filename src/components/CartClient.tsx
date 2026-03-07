"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { CartData } from "../types";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, ArrowRight, ShieldCheck, Leaf, Minus, Plus, ShoppingBag, Truck, Tag } from "lucide-react";

export default function CartClient({ initialData }: { initialData: CartData }) {
  const router = useRouter();
  const { cart, setCartData, updateQuantity, removeItem, shippingFee } = useCheckoutStore();
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

  const subtotal = cart.reduce((acc, item) => acc + item.product_price * (item.quantity || 1), 0);
  const grandTotal = subtotal + shippingFee;
  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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

        {/* Section label */}
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
              const maxStock = item.max_stock ?? 99;
              const isMaxedOut = currentQty >= maxStock;

              return (
                <div
                  key={item.product_id}
                  className="group bg-white rounded-2xl border border-stone-100 p-5 hover:border-stone-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex gap-5 items-start">
                    {/* Image */}
                    <div className="relative w-[88px] h-[88px] rounded-xl overflow-hidden bg-stone-50 border border-stone-100 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.product_name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    </div>

                    {/* Details */}
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
                        {/* Qty */}
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

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-black text-stone-900 text-base">₹{item.product_price * currentQty}</p>
                          {currentQty > 1 && (
                            <p className="text-[11px] text-stone-400">₹{item.product_price} each</p>
                          )}
                        </div>
                      </div>

                      {/* Stock warning */}
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

        {/* Perks bar */}
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

            {/* Divider */}
            <div className="border-t border-stone-800 pt-5 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Subtotal</span>
                <span className="text-stone-200 font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Shipping</span>
                <span className="text-stone-200 font-medium">₹{shippingFee}</span>
              </div>
            </div>

            {/* Total */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Total Payable</p>
                  <p className="text-white text-3xl font-black mt-0.5 tracking-tight">₹{grandTotal}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 text-[10px] font-semibold">Incl. all taxes</p>
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