"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { AddressSchema } from "../lib/validations";
import { Address, SavedAddress } from "../types";
import {
  ArrowRight, ArrowLeft, MapPin, Truck,
  Plus, Check, Pencil, Trash2, X,
  Home, Briefcase, Tag, AlertCircle, ShoppingBag, Ticket,
} from "lucide-react";

const PRESET_LABELS = ["Home", "Work", "Other"] as const;

function LabelIcon({ label }: { label: string }) {
  const l = label.toLowerCase();
  if (l === "home") return <Home size={12} />;
  if (l === "work") return <Briefcase size={12} />;
  return <Tag size={12} />;
}

// ── Modal ────────────────────────────────────────────────────────────
interface ModalProps {
  onSave: (data: Address, label: string) => void;
  onClose: () => void;
  editing?: SavedAddress;
}

function AddressModal({ onSave, onClose, editing }: ModalProps) {
  const isPreset = (v: string) => PRESET_LABELS.includes(v as typeof PRESET_LABELS[number]);

  const [selectedLabel, setSelectedLabel] = useState(
    editing ? (isPreset(editing.label) ? editing.label : "Other") : "Home"
  );
  const [customLabel, setCustomLabel] = useState(
    editing && !isPreset(editing.label) ? editing.label : ""
  );

  const { register, handleSubmit, formState: { errors } } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
    defaultValues: editing ?? {},
  });

  const onSubmit = (data: Address) => {
    const label = selectedLabel === "Other" ? (customLabel.trim() || "Other") : selectedLabel;
    onSave(data, label);
  };

  const field = (err: boolean) =>
    `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all placeholder-stone-400 text-stone-900 ${
      err
        ? "border-rose-400 bg-rose-50/30 ring-1 ring-rose-300"
        : "border-stone-200 bg-stone-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-7 py-5 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
              <MapPin size={16} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-stone-900 tracking-tight">
              {editing ? "Edit Address" : "Add New Address"}
            </h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition">
            <X size={17} />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[70vh] px-7 py-6">
          <div className="mb-6">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Label</p>
            <div className="flex gap-2">
              {PRESET_LABELS.map((opt) => (
                <button key={opt} type="button" onClick={() => setSelectedLabel(opt)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                    selectedLabel === opt
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-stone-200 text-stone-500 hover:border-stone-300 bg-white"
                  }`}
                >
                  <LabelIcon label={opt} /> {opt}
                </button>
              ))}
            </div>
            {selectedLabel === "Other" && (
              <input value={customLabel} onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Parents' Home" maxLength={20} className={`${field(false)} mt-3`} />
            )}
          </div>

          <form id="addr-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">Full Name *</label>
                <input {...register("fullName")} placeholder="John Doe" className={field(!!errors.fullName)} />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.fullName.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">Email *</label>
                <input type="email" {...register("email")} placeholder="john@example.com" className={field(!!errors.email)} />
                {errors.email && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.email.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">Phone *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-stone-400 text-sm font-semibold">+91</span>
                  <input {...register("phone")} placeholder="9876543210" maxLength={10} className={`${field(!!errors.phone)} pl-12`} />
                </div>
                {errors.phone && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.phone.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">PIN Code *</label>
                <input {...register("pinCode")} placeholder="110001" maxLength={6} className={field(!!errors.pinCode)} />
                {errors.pinCode && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.pinCode.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">City *</label>
                <input {...register("city")} placeholder="New Delhi" className={field(!!errors.city)} />
                {errors.city && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.city.message}</p>}
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block mb-1.5">State *</label>
                <input {...register("state")} placeholder="Delhi" className={field(!!errors.state)} />
                {errors.state && <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle size={10} />{errors.state.message}</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="flex gap-3 px-7 py-5 bg-stone-50 border-t border-stone-100">
          <button type="button" onClick={onClose}
            className="flex-1 py-3 rounded-xl border-2 border-stone-200 text-stone-700 text-sm font-bold hover:bg-stone-100 transition">
            Cancel
          </button>
          <button type="submit" form="addr-form"
            className="flex-1 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold transition shadow-md active:scale-95">
            {editing ? "Save Changes" : "Add Address"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Address Card ─────────────────────────────────────────────────────
function AddressCard({ addr, isSelected, onSelect, onEdit, onDelete }: {
  addr: SavedAddress; isSelected: boolean;
  onSelect: () => void; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <div onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 select-none ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/60"
          : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        isSelected ? "border-emerald-500 bg-emerald-500" : "border-stone-300 bg-white"
      }`}>
        {isSelected && <Check size={11} className="text-white" strokeWidth={3} />}
      </div>
      <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg mb-3 uppercase tracking-wide ${
        isSelected ? "bg-emerald-100 text-emerald-700" : "bg-stone-100 text-stone-500"
      }`}>
        <LabelIcon label={addr.label} />
        {addr.label}
      </div>
      <p className="font-bold text-stone-900 text-sm leading-snug">{addr.fullName}</p>
      <p className="text-stone-400 text-xs mt-0.5">{addr.email}</p>
      <p className="text-stone-400 text-xs">+91 {addr.phone}</p>
      <p className="text-stone-500 text-xs font-medium mt-2">{addr.city}, {addr.state} — {addr.pinCode}</p>
      <div className="flex items-center gap-0.5 mt-4 pt-3 border-t border-stone-100">
        <button onClick={(e) => { e.stopPropagation(); onEdit(); }}
          className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition">
          <Pencil size={11} /> Edit
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-600 px-2.5 py-1.5 rounded-lg hover:bg-rose-50 transition">
          <Trash2 size={11} /> Delete
        </button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────
export default function ShippingClient() {
  const router = useRouter();
  const {
    cart, shippingFee, discount, address,
    savedAddresses, selectedAddressId,
    addAddress, updateAddress, deleteAddress, selectAddress,
    getCouponDiscount, appliedCoupon,
  } = useCheckoutStore();

  const [isMounted, setIsMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingAddr, setEditingAddr] = useState<SavedAddress | null>(null);

  useEffect(() => { setIsMounted(true); }, []);
  useEffect(() => {
    if (isMounted && cart.length === 0) router.push("/");
  }, [isMounted, cart.length, router]);

  if (!isMounted || cart.length === 0) return null;

  // ── Shared totals (same formula as CartClient) ──────────────────────────
  const subtotal       = cart.reduce((acc, item) => acc + item.product_price * (item.quantity || 1), 0);
  const couponDiscount = getCouponDiscount();
  const grandTotal     = Math.max(0, subtotal + shippingFee - discount - couponDiscount);
  const totalSavings   = discount + couponDiscount;

  const canProceed = !!selectedAddressId && !!address;

  const handleSave = (data: Address, label: string) => {
    if (editingAddr) updateAddress(editingAddr.id, data, label);
    else addAddress(data, label);
    setShowModal(false);
    setEditingAddr(null);
  };

  const openAdd  = () => { setEditingAddr(null); setShowModal(true); };
  const openEdit = (addr: SavedAddress) => { setEditingAddr(addr); setShowModal(true); };

  return (
    <>
      {showModal && (
        <AddressModal
          editing={editingAddr ?? undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditingAddr(null); }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 pb-28">

        {/* ── LEFT ──────────────────────────────────────────────── */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={16} className="text-stone-400" />
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Delivery Address</p>
              </div>
              <p className="text-stone-500 text-sm">
                {savedAddresses.length === 0
                  ? "Add your first delivery address"
                  : savedAddresses.length === 1
                  ? "Tap the card to select it for delivery"
                  : `${savedAddresses.length} saved — tap one to select`}
              </p>
            </div>
            <button onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition shadow-md active:scale-95">
              <Plus size={14} /> Add New
            </button>
          </div>

          {savedAddresses.length === 0 && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-stone-200 p-14 text-center">
              <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin size={22} className="text-stone-300" />
              </div>
              <p className="text-stone-500 text-sm font-medium mb-1">No addresses saved yet</p>
              <p className="text-stone-400 text-xs mb-5">Add an address to continue to payment</p>
              <button onClick={openAdd}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700">
                <Plus size={14} /> Add your first address
              </button>
            </div>
          )}

          {savedAddresses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => (
                <AddressCard key={addr.id} addr={addr}
                  isSelected={selectedAddressId === addr.id}
                  onSelect={() => selectAddress(addr.id)}
                  onEdit={() => openEdit(addr)}
                  onDelete={() => deleteAddress(addr.id)}
                />
              ))}
              <button onClick={openAdd}
                className="border-2 border-dashed border-stone-200 hover:border-emerald-300 rounded-2xl min-h-[160px] flex flex-col items-center justify-center gap-2.5 text-stone-300 hover:text-emerald-500 transition-all group">
                <div className="w-10 h-10 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:bg-emerald-50 transition">
                  <Plus size={17} />
                </div>
                <span className="text-xs font-bold">Add Address</span>
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Summary ──────────────────────────────────────── */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-stone-900 rounded-3xl overflow-hidden shadow-2xl sticky top-8">
            <div className="px-7 pt-7 pb-5 border-b border-stone-800 flex items-center gap-3">
              <ShoppingBag size={17} className="text-emerald-400" />
              <h3 className="font-bold text-white text-sm tracking-tight">Order Summary</h3>
            </div>

            <div className="px-7 py-6 space-y-3">
              {/* Line items */}
              {cart.map((item) => (
                <div key={item.product_id} className="flex justify-between gap-3">
                  <span className="text-stone-400 text-xs leading-relaxed">
                    {item.product_name}<span className="text-stone-600"> ×{item.quantity}</span>
                  </span>
                  <span className="text-white text-xs font-semibold flex-shrink-0">
                    ₹{item.product_price * item.quantity}
                  </span>
                </div>
              ))}

              {/* Price breakdown */}
              <div className="border-t border-stone-800 pt-4 space-y-3">
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
                    <span className="text-emerald-400 font-semibold">−₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
              </div>

              {/* Total box */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Total</p>
                    {couponDiscount > 0 && (
                      <p className="text-stone-600 text-xs line-through mt-0.5">
                        ₹{(subtotal + shippingFee - discount).toLocaleString("en-IN")}
                      </p>
                    )}
                    <p className="text-white text-2xl font-black mt-0.5">
                      ₹{grandTotal.toLocaleString("en-IN")}
                    </p>
                    {totalSavings > 0 && (
                      <p className="text-emerald-500 text-[10px] font-semibold mt-1">
                        🎉 You save ₹{totalSavings.toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                  {canProceed && (
                    <div className="text-right max-w-[110px]">
                      <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Delivering to</p>
                      <p className="text-stone-300 text-[11px] mt-0.5 leading-tight">{address?.city}, {address?.state}</p>
                    </div>
                  )}
                </div>
              </div>

              {canProceed && (
                <div className="flex items-center gap-2 bg-stone-800 rounded-xl px-4 py-3">
                  <Truck size={14} className="text-emerald-400 flex-shrink-0" />
                  <p className="text-stone-300 text-xs">Estimated delivery: <span className="font-semibold text-white">3–5 business days</span></p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ══ STICKY BOTTOM BAR ══════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex-1 hidden sm:block min-w-0">
              {canProceed ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <p className="text-xs text-stone-600 font-medium truncate">
                    Delivering to <span className="font-bold text-stone-900">{address?.fullName}</span> · {address?.city}
                  </p>
                </div>
              ) : savedAddresses.length > 0 ? (
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-600 font-semibold">Tap an address card above to select it</p>
                </div>
              ) : (
                <p className="text-xs text-stone-400 font-medium">Add a delivery address to continue</p>
              )}
            </div>
            <button onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-5 py-3 border-2 border-stone-200 hover:border-stone-300 text-stone-700 font-bold text-sm rounded-xl transition-all hover:bg-stone-50 active:scale-95 flex-shrink-0">
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <button
              onClick={() => { if (canProceed) router.push("/payment"); }}
              disabled={!canProceed}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all flex-shrink-0 ${
                canProceed
                  ? "bg-stone-900 hover:bg-stone-800 text-white shadow-md hover:shadow-lg active:scale-95"
                  : "bg-stone-100 text-stone-400 cursor-not-allowed"
              }`}
            >
              Continue to Payment <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}