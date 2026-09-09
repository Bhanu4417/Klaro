"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Paperclip, X } from "lucide-react";

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
}

export function ImageLightbox({ src, onClose }: ImageLightboxProps) {
  return (
    <AnimatePresence>
      {src && (
        <div key="image-lightbox" className="fixed inset-0 z-[100010] flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B0B0D]/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative z-[100011] w-full max-w-[560px] rounded-[24px] bg-[#FCFCFB] border border-white/80 shadow-[0_24px_60px_rgba(0,0,0,0.32),inset_0_1px_1px_rgba(255,255,255,0.95)] p-2.5 space-y-2.5"
          >
            <div className="flex items-center justify-between px-1.5 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#94EB41] text-[rgb(18,18,18)] flex items-center justify-center border border-[#80D42F] shadow-xs">
                  <Paperclip className="w-3.5 h-3.5 -rotate-45" strokeWidth={2} />
                </div>
                <span
                  className="text-xs font-[900] text-zinc-950 tracking-tight"
                  style={{ fontFamily: 'satoshi, "satoshi Fallback", sans-serif', fontWeight: 900 }}
                >
                  Evidence Photo
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-black/5 text-zinc-400 hover:text-zinc-900 active:scale-90 transition-all"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <img
              src={src}
              alt="Evidence"
              className="w-full max-h-[68vh] object-contain rounded-[18px] bg-zinc-100 border border-[#D5D2D4]"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
