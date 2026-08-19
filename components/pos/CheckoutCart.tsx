"use client";

import React, { useState } from "react";
import { checkoutEquipment } from "@/app/actions/pos";
import { motion, AnimatePresence } from "motion/react";

interface CheckoutCartProps {
  patron: {
    id: string;
    studentId: string;
  } | null;
  items: Array<{
    id: string;
    name: string;
    assetTag: string;
    operationalStatus: string;
    location?: string | null;
    imageUrl?: string | null;
  }>;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onRestoreCart?: (items: any[]) => void;
  onCheckoutSuccess: () => void;
}

export function CheckoutCart({
  patron,
  items,
  onRemoveItem,
  onClearCart,
  onRestoreCart,
  onCheckoutSuccess,
}: CheckoutCartProps) {
  // Default to 1 Month (30 days) from now
  const getDefaultReturnDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    d.setHours(16, 0, 0, 0); // 16:00
    return d.toISOString().slice(0, 16);
  };

  const [expectedReturn, setExpectedReturn] = useState<string>(getDefaultReturnDate());
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleQuickDuration = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(16, 0, 0, 0);
    setExpectedReturn(d.toISOString().slice(0, 16));
  };

  const handleCheckout = async () => {
    if (!patron) {
      setErrorToast("Please scan or select a student patron before checkout.");
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    if (items.length === 0) {
      setErrorToast("No equipment items in the checkout cart.");
      setTimeout(() => setErrorToast(null), 4000);
      return;
    }

    // Capture state snapshot for optimistic rollback
    const itemsSnapshot = [...items];
    const patronId = patron.id;
    const returnDate = new Date(expectedReturn);
    const loanNotes = notes.trim() || undefined;

    // Optimistic Update: Immediately clear cart and notify parent
    onClearCart();
    setSuccessToast(`✓ Checkout initiated for ${itemsSnapshot.length} item(s)...`);
    setTimeout(() => setSuccessToast(null), 3000);

    // Silent background execution
    try {
      setIsSubmitting(true);
      const res = await checkoutEquipment({
        patronId,
        inventoryIds: itemsSnapshot.map((i) => i.id),
        expectedReturn: returnDate,
        notes: loanNotes,
      });

      if (res.success) {
        onCheckoutSuccess();
      }
    } catch (err: any) {
      console.error("Background checkout error:", err);
      // Graceful rollback: restore items to cart and show error toast
      if (onRestoreCart) {
        onRestoreCart(itemsSnapshot);
      }
      setErrorToast(err.message || "Checkout failed. Cart state restored.");
      setTimeout(() => setErrorToast(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 relative flex flex-col justify-between h-full shadow-2xl font-mono">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold text-zinc-400">
              Checkout Basket
            </span>
            <span className="bg-[#FFED00] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {items.length} item{items.length === 1 ? "" : "s"}
            </span>
          </div>
          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-zinc-500 hover:text-red-400 text-xs transition-colors"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Item List */}
        <div className="mt-4 space-y-2 max-h-56 overflow-y-auto pr-1">
          {items.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              <svg
                className="w-8 h-8 mx-auto mb-2 text-zinc-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              Scan equipment barcodes or click available gear below.
            </div>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between bg-[#0D0D0D] border border-[#262626] rounded-2xl p-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{item.name}</div>
                  <div className="flex items-center gap-2 text-[11px] mt-0.5">
                    <span className="text-[#009FE3] font-bold">[{item.assetTag}]</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-zinc-500 hover:text-red-400 p-1.5 rounded-full transition-colors"
                  title="Remove"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Expected Return Date Picker with 1-Month Default */}
        <div className="mt-5 pt-4 border-t border-[#262626]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-zinc-400 font-bold">Rental Duration (Default 1 Month)</label>
            <div className="flex items-center gap-1">
              {[
                { label: "+1w", days: 7 },
                { label: "+2w", days: 14 },
                { label: "+1mo (30d)", days: 30 },
                { label: "+2mo (60d)", days: 60 },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={() => handleQuickDuration(btn.days)}
                  className="px-2 py-0.5 bg-[#0D0D0D] hover:bg-[#262626] border border-[#262626] text-[10px] rounded-full text-zinc-300 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
          <input
            type="datetime-local"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white text-xs rounded-xl px-3 py-2.5 outline-none transition-colors"
          />
        </div>

        {/* Optional Notes */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Add loan notes or project context (optional)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[#0D0D0D] border border-[#262626] focus:border-[#FFED00] text-white text-xs rounded-xl px-3 py-2 outline-none placeholder:text-zinc-600 transition-colors"
          />
        </div>
      </div>

      {/* Footer & Checkout Action */}
      <div className="mt-6 pt-4 border-t border-[#262626]">
        {/* Non-blocking Toast Alerts */}
        <AnimatePresence>
          {errorToast && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-xs text-[#E6007E] bg-[#E6007E]/10 border border-[#E6007E]/30 rounded-xl p-2.5 flex items-center justify-between"
            >
              <span>{errorToast}</span>
              <button
                type="button"
                onClick={() => setErrorToast(null)}
                className="text-zinc-500 hover:text-white ml-2"
              >
                ✕
              </button>
            </motion.div>
          )}

          {successToast && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 text-xs text-[#009FE3] bg-[#009FE3]/10 border border-[#009FE3]/30 rounded-xl p-2.5 text-center font-bold"
            >
              {successToast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button with exact text "Confirm checkout" */}
        <button
          type="button"
          disabled={items.length === 0 || !patron}
          onClick={handleCheckout}
          className={`w-full py-3.5 rounded-full text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
            items.length === 0 || !patron
              ? "bg-[#262626] text-zinc-500 cursor-not-allowed"
              : "bg-[#FFED00] hover:bg-[#ffe600] text-black shadow-[#FFED00]/20 hover:scale-[1.01] active:scale-[0.99]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>Confirm checkout</span>
        </button>
      </div>
    </div>
  );
}
