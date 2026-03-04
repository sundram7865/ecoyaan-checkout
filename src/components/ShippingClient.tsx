"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCheckoutStore } from "../store/useCheckoutStore";
import { AddressSchema } from "../lib/validations";
import { Address } from "../types";
import { ArrowRight, ArrowLeft, MapPin, Truck } from "lucide-react";

export default function ShippingClient() {
  const router = useRouter();
  const { cart, shippingFee, address, setAddress } = useCheckoutStore();
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Address>({
    resolver: zodResolver(AddressSchema),
    defaultValues: address || {
      fullName: "",
      email: "",
      phone: "",
      pinCode: "",
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Protect the route: If cart is empty, redirect back to cart
  useEffect(() => {
    if (isMounted && cart.length === 0) {
      router.push("/");
    }
  }, [isMounted, cart.length, router]);

  if (!isMounted || cart.length === 0) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product_price * (item.quantity || 1), 0);
  const grandTotal = subtotal + shippingFee;

  const onSubmit = (data: Address) => {
    setAddress(data);
    router.push("/payment");
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 font-sans">
      
      {/* Form Section */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Shipping Address</h2>
              <p className="text-gray-500">Where should we send your eco-friendly order?</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                <input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className={`${inputClass} ${errors.fullName ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input
                  {...register("email")}
                  placeholder="john@example.com"
                  type="email"
                  className={`${inputClass} ${errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">+91</span>
                  <input
                    {...register("phone")}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`${inputClass} pl-12 ${errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">PIN Code</label>
                <input
                  {...register("pinCode")}
                  placeholder="110001"
                  maxLength={6}
                  className={`${inputClass} ${errors.pinCode ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                />
                {errors.pinCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pinCode.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                <input
                  {...register("city")}
                  placeholder="New Delhi"
                  className={`${inputClass} ${errors.city ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1 font-medium">{errors.city.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                <input
                  {...register("state")}
                  placeholder="Delhi"
                  className={`${inputClass} ${errors.state ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"}`}
                />
                {errors.state && <p className="text-red-500 text-xs mt-1 font-medium">{errors.state.message}</p>}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                <ArrowLeft size={20} /> Back
              </button>
              <button
                type="submit"
                className="w-2/3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-4 px-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Continue to Payment <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Mini Summary Section */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="text-emerald-500" /> Order Outline
          </h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6">
            {cart.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium pr-4">
                  {item.quantity}x {item.product_name}
                </span>
                <span className="text-gray-900 font-bold">₹{item.product_price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Standard Shipping</span>
              <span className="text-gray-900 font-bold">₹{shippingFee}</span>
            </div>
          </div>

          <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center border border-emerald-100">
            <span className="font-bold text-emerald-900">Total to Pay</span>
            <span className="text-2xl font-black text-emerald-600">₹{grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}