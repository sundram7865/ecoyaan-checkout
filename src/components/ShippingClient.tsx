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

  useEffect(() => {
    if (isMounted && cart.length === 0) {
      router.push("/");
    }
  }, [isMounted, cart.length, router]);

  if (!isMounted || cart.length === 0) return null;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product_price * (item.quantity || 1),
    0
  );

  const grandTotal = subtotal + shippingFee;

  const onSubmit = (data: Address) => {
    setAddress(data);
    router.push("/payment");
  };

  const baseInput =
    "w-full px-4 py-3 rounded-xl border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-gray-900 placeholder-gray-400";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* LEFT - FORM */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
              <MapPin size={26} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">
                Shipping Details
              </h2>
              <p className="text-gray-500 mt-1">
                Enter your delivery information carefully.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className={`${baseInput} mt-2 ${
                    errors.fullName ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className={`${baseInput} mt-2 ${
                    errors.email ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Phone & PIN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-medium">
                    +91
                  </span>
                  <input
                    {...register("phone")}
                    placeholder="9876543210"
                    maxLength={10}
                    className={`${baseInput} pl-12 ${
                      errors.phone ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  PIN Code
                </label>
                <input
                  {...register("pinCode")}
                  placeholder="110001"
                  maxLength={6}
                  className={`${baseInput} mt-2 ${
                    errors.pinCode ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.pinCode && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  City
                </label>
                <input
                  {...register("city")}
                  placeholder="New Delhi"
                  className={`${baseInput} mt-2 ${
                    errors.city ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.city && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  State
                </label>
                <input
                  {...register("state")}
                  placeholder="Delhi"
                  className={`${baseInput} mt-2 ${
                    errors.state ? "border-red-500 ring-1 ring-red-500" : "border-gray-200"
                  }`}
                />
                {errors.state && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.state.message}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
              >
                <ArrowLeft size={18} /> Back to Cart
              </button>

              <button
                type="submit"
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Continue to Payment <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT - SUMMARY */}
      <div className="lg:col-span-5 xl:col-span-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 sticky top-10">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
            <Truck className="text-emerald-500" />
            Order Summary
          </h3>

          <div className="space-y-3 mb-8 max-h-64 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between text-sm"
              >
                <span className="text-gray-600">
                  {item.quantity} × {item.product_name}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{item.product_price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 space-y-4">
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

          <div className="mt-8 bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex justify-between items-center">
            <span className="font-bold text-emerald-900">
              Total to Pay
            </span>
            <span className="text-3xl font-black text-emerald-600">
              ₹{grandTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}