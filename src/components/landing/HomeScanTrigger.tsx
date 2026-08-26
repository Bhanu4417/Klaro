"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ImageIcon, X, Sparkles } from "lucide-react";
import { ScanFlow } from "../scan/ScanFlow";

export function HomeScanTrigger() {
  const [showFlow, setShowFlow] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [showChoice, setShowChoice] = useState(false);
  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setImageName(file.name);
    setShowChoice(false);
    setShowFlow(true);
    e.target.value = "";
  };

  return (
    <>
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />

      <button
        onClick={() => setShowChoice(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#D5D2D4] text-sm font-bold text-zinc-800 hover:bg-zinc-50 shadow-sm transition"
      >
        <Sparkles className="w-4 h-4 text-[#417F14]" />
        Try scanning any photo
        <Camera className="w-4 h-4 text-zinc-500" />
      </button>

      <AnimatePresence>
        {showChoice && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm" onClick={() => setShowChoice(false)} />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed inset-x-3 bottom-6 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[380px] sm:max-w-[calc(100vw-2rem)] z-[71] p-4 rounded-[22px] bg-[#FCFCFB] border border-[#D5D2D4] shadow-xl mx-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold">Add product photo</h4>
                <button onClick={() => setShowChoice(false)} className="p-1.5 rounded-full hover:bg-zinc-100">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Any image works — we just animate. No real OCR.</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => cameraRef.current?.click()} className="p-4 rounded-2xl bg-[#94EC40]/15 border border-[#B8F27D] flex flex-col items-center gap-2">
                  <Camera className="w-6 h-6 text-[#346415]" />
                  <span className="text-xs font-bold">Take photo</span>
                  <span className="text-[10px] text-zinc-500">Camera</span>
                </button>
                <button onClick={() => galleryRef.current?.click()} className="p-4 rounded-2xl bg-white border border-[#D5D2D4] flex flex-col items-center gap-2">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs font-bold">Choose</span>
                  <span className="text-[10px] text-zinc-500">Gallery</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ScanFlow
        isOpen={showFlow}
        imageUrl={imageUrl}
        imageName={imageName}
        onClose={() => {
          setShowFlow(false);
          if (imageUrl) URL.revokeObjectURL(imageUrl);
        }}
        onPost={() => {
          // redirect to dashboard to see it
          window.location.href = "/dashboard";
        }}
        onSave={() => {
          setShowFlow(false);
        }}
      />
    </>
  );
}
