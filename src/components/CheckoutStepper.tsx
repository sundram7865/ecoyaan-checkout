"use client";

import { Check } from "lucide-react";

const STEPS = [
  { label: "Cart", sub: "Review items" },
  { label: "Shipping", sub: "Delivery address" },
  { label: "Payment", sub: "Secure checkout" },
] as const;

export default function CheckoutStepper({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center mb-14">
      {STEPS.map((step, idx) => {
        const num = idx + 1;
        const done = num < current;
        const active = num === current;

        return (
          <div key={step.label} className="flex items-center">
            <div className="flex flex-col items-center gap-2 min-w-[72px]">
              <div
                className={`
                  w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300 border-2
                  ${done
                    ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                    : active
                    ? "bg-stone-900 border-stone-900 text-white shadow-lg shadow-stone-200 scale-110"
                    : "bg-white border-stone-200 text-stone-400"
                  }
                `}
              >
                {done ? <Check size={15} strokeWidth={3} /> : <span className="text-xs">{num}</span>}
              </div>
              <div className="text-center hidden sm:block">
                <p className={`text-xs font-bold tracking-wide ${active ? "text-stone-900" : done ? "text-emerald-600" : "text-stone-400"}`}>
                  {step.label}
                </p>
                <p className={`text-[10px] ${active ? "text-stone-500" : "text-stone-300"}`}>
                  {step.sub}
                </p>
              </div>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="w-16 sm:w-24 h-px mx-3 mb-6 sm:mb-0 relative bg-stone-200 overflow-hidden rounded-full">
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 rounded-full bg-emerald-400 ${
                    done ? "w-full" : active ? "w-1/2" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}