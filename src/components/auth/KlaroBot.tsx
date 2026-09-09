"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useSpring,
  useAnimationControls,
  AnimatePresence,
  type Variants,
  type MotionValue,
  type AnimationControls,
} from "framer-motion";
import { cn } from "../../lib/utils";

export type BotState =
  | "idle"
  | "scanning"
  | "authenticating"
  | "happy"
  | "peek"
  | "typing"
  | "error";

export interface KlaroBotProps {
  state?: BotState;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  interactive?: boolean;
  showShadow?: boolean;
  glowColor?: string;
  speechTone?: "standard" | "officer";
  speech?: string[];
  className?: string;
  onClick?: () => void;
}

const ERROR_COLOR = "#FF5353";
const PUPIL_COLOR = "#141416";
const EYE_COLOR = "#FFFFFF";

const SIZE_CONFIG = {
  sm: { px: 40, font: 10 },
  md: { px: 60, font: 15 },
  lg: { px: 90, font: 22.5 },
  xl: { px: 128, font: 32 },
  hero: { px: 176, font: 44 },
} as const;

const BODY_GRADIENT = "linear-gradient(180deg, #A8F55D 0%, #94EC40 55%, #7ADB2B 100%)";

const LOAD_TIMES = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1];
const LOAD_LOOP = { repeat: Infinity, duration: 3, ease: "easeInOut", times: LOAD_TIMES } as const;

const ScleraEye: React.FC<{
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
  blink?: boolean;
  wide?: boolean;
  squint?: boolean;
  pose?: { x?: any; y?: any; times?: number[]; duration?: number };
  rollControls?: AnimationControls;
}> = ({ pupilX, pupilY, blink = false, wide = false, squint = false, pose, rollControls }) => (
  <motion.div
    animate={{
      scaleY: blink ? 0.08 : squint ? 0.85 : 1,
      scaleX: wide ? 1.08 : 1,
    }}
    transition={{ duration: 0.12 }}
    className="relative rounded-full shrink-0 overflow-hidden"
    style={{
      width: "0.54em",
      height: "0.96em",
      backgroundColor: EYE_COLOR,
      boxShadow: "0 0.03em 0.1em rgba(20,50,0,0.3)",
    }}
  >
    <motion.div
      style={pose ? undefined : { x: pupilX, y: pupilY }}
      animate={pose ? { x: pose.x ?? 0, y: pose.y ?? 0 } : undefined}
      transition={pose ? { ...LOAD_LOOP, duration: pose.duration ?? 3, times: pose.times ?? LOAD_TIMES } : undefined}
      className="absolute left-1/2 top-1/2"
    >
      <motion.div animate={rollControls}>
        <div
          className="rounded-full"
          style={{
            width: "0.32em",
            height: "0.32em",
            backgroundColor: PUPIL_COLOR,
            marginLeft: "-0.16em",
            marginTop: "-0.16em",
          }}
        >
          <div
            className="rounded-full bg-white/90"
            style={{ width: "0.08em", height: "0.08em", margin: "0.05em 0 0 0.05em" }}
          />
        </div>
      </motion.div>
    </motion.div>
  </motion.div>
);

const HappyArc: React.FC = () => (
  <svg viewBox="0 0 16 12" fill="none" style={{ width: "0.82em", height: "0.58em" }}>
    <path d="M2 10 Q8 1 14 10" stroke={EYE_COLOR} strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const ClosedLid: React.FC<{ squint?: number }> = ({ squint = 1 }) => (
  <div
    className="rounded-full shrink-0"
    style={{
      width: "0.42em",
      height: `calc(0.13em * ${squint})`,
      backgroundColor: EYE_COLOR,
      boxShadow: "0 0 0.15em rgba(255,255,255,0.45)",
    }}
  />
);

const CrossEye: React.FC = () => (
  <svg viewBox="0 0 14 14" fill="none" style={{ width: "0.7em", height: "0.7em" }}>
    <path d="M3 3 L11 11 M11 3 L3 11" stroke={ERROR_COLOR} strokeWidth="2.8" strokeLinecap="round" />
  </svg>
);

const AngryEye: React.FC<{ flip?: boolean }> = ({ flip = false }) => (
  <div className="flex flex-col items-center" style={{ gap: "0.04em" }}>
    <div
      style={{
        width: "0.56em",
        height: "0.14em",
        borderRadius: "9999px",
        backgroundColor: PUPIL_COLOR,
        transform: `rotate(${flip ? -16 : 16}deg)`,
      }}
    />
    <motion.div
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
      className="rounded-full"
      style={{
        width: "0.36em",
        height: "0.56em",
        background: `radial-gradient(circle at 50% 35%, #FF7A6E 0%, ${ERROR_COLOR} 55%, #C93028 100%)`,
        boxShadow: `0 0 0.25em ${ERROR_COLOR}, inset 0 -0.05em 0.1em rgba(0,0,0,0.25)`,
      }}
    />
  </div>
);

export const KlaroBot: React.FC<KlaroBotProps> = ({
  state = "idle",
  size = "md",
  interactive = true,
  showShadow = true,
  glowColor = "#94EC40",
  speechTone = "standard",
  speech,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [angry, setAngry] = useState(false);
  const [thoughtIdx, setThoughtIdx] = useState(0);
  const botRef = useRef<HTMLDivElement>(null);
  const clickCount = useRef(0);
  const angerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!speech?.length || angry) return;
    setThoughtIdx(Math.floor(Math.random() * speech.length));
    const timer = setInterval(() => {
      setThoughtIdx((i) => (i + 1) % speech.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [speech, angry]);

  const handleClick = () => {
    onClick?.();

    pokeControls.start({ scale: [1, 0.86, 1.08, 1], transition: { duration: 0.45, ease: "easeInOut" } });
    if (state === "idle") {
      rollControls.start({
        x: [0, "0.08em", "0.02em", "-0.08em", 0],
        y: [0, "-0.07em", "-0.11em", "-0.07em", 0],
        transition: { duration: 0.65, ease: "easeInOut" },
      });
    }

    if (!speech?.length) return;

    clickCount.current += 1;

    if (angry) return;

    if (clickCount.current % 5 === 0) {
      setAngry(true);
      if (angerTimer.current) clearTimeout(angerTimer.current);
      angerTimer.current = setTimeout(() => setAngry(false), 2600);
      return;
    }

    setThoughtIdx((i) => (i + 1) % speech.length);
  };

  useEffect(
    () => () => {
      if (angerTimer.current) clearTimeout(angerTimer.current);
    },
    []
  );

  const springConfig = { damping: 26, stiffness: 300, mass: 0.35 };
  const pupilX = useSpring(0, springConfig);
  const pupilY = useSpring(0, springConfig);
  const faceX = useSpring(0, springConfig);
  const faceY = useSpring(0, springConfig);
  const tiltX = useSpring(0, springConfig);
  const tiltY = useSpring(0, springConfig);

  const pokeControls = useAnimationControls();
  const rollControls = useAnimationControls();

  const trackingEnabled = interactive && state === "idle";

  useEffect(() => {
    if (!trackingEnabled) {
      pupilX.set(0);
      pupilY.set(0);
      faceX.set(0);
      faceY.set(0);
      tiltX.set(0);
      tiltY.set(0);
      return;
    }

    const { font: f } = SIZE_CONFIG[size];
    const handleMouseMove = (e: MouseEvent) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const normX = Math.max(-1, Math.min(1, (e.clientX - (rect.left + rect.width / 2)) / 220));
      const normY = Math.max(-1, Math.min(1, (e.clientY - (rect.top + rect.height / 2)) / 220));

      pupilX.set(normX * f * 0.11);
      pupilY.set(normY * f * 0.15);
      faceX.set(normX * f * 0.05);
      faceY.set(normY * f * 0.06);
      tiltY.set(normX * 6);
      tiltX.set(-normY * 4);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [trackingEnabled, size, pupilX, pupilY, faceX, faceY, tiltX, tiltY]);

  useEffect(() => {
    if (state !== "idle") return;

    let blinkTimer: NodeJS.Timeout;
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 125);
      blinkTimer = setTimeout(triggerBlink, Math.random() * 3200 + 2400);
    };

    blinkTimer = setTimeout(triggerBlink, 2600);
    return () => clearTimeout(blinkTimer);
  }, [state]);

  const { px, font } = SIZE_CONFIG[size];

  const bodyVariants: Variants = {
    idle: {
      y: [-1.5, 1.5, -1.5],
      transition: { repeat: Infinity, duration: 2.8, ease: "easeInOut" },
    },
    typing: {
      y: [0, 1.2, 0],
      rotate: [-0.5, 0.5, -0.5],
      transition: { repeat: Infinity, duration: 0.8, ease: "easeInOut" },
    },
    scanning: {
      y: [-1, 0.6, -1.6, 0.6, -1],
      rotate: [2, 7, 4, 8.5, 2],
      transition: { repeat: Infinity, duration: 3.4, ease: "easeInOut" },
    },
    authenticating: {
      y: [0, -8, 0, 0, -6, 0, -3, 0],
      rotate: [0, -2, -9, 9, 2, -6, 3, 0],
      scaleX: [1, 0.95, 1.05, 1.05, 0.96, 1.02, 0.98, 1],
      scaleY: [1, 1.07, 0.94, 0.94, 1.06, 0.98, 1.02, 1],
      transition: { ...LOAD_LOOP },
    },
    happy: {
      y: [-4, 0, -4],
      transition: { repeat: Infinity, duration: 0.8, ease: "easeOut" },
    },
    peek: {
      y: 0.5,
      transition: { duration: 0.2 },
    },
    error: {
      x: [-4, 4, -3, 3, -1, 1, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const renderEyes = () => {
    if (angry) {
      return (
        <div className="flex items-center justify-center" style={{ gap: "0.44em" }}>
          <AngryEye />
          <AngryEye flip />
        </div>
      );
    }
    switch (state) {
      case "scanning":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <ScleraEye
              wide
              pose={{
                x: ["0.09em", "0.1em", "-0.07em", "0.1em", "0.09em"],
                y: ["-0.11em", "-0.12em", "-0.08em", "-0.12em", "-0.11em"],
                duration: 3.4,
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            />
            <ScleraEye
              squint
              pose={{
                x: ["0.09em", "0.1em", "-0.07em", "0.1em", "0.09em"],
                y: ["-0.11em", "-0.12em", "-0.08em", "-0.12em", "-0.11em"],
                duration: 3.4,
                times: [0, 0.25, 0.5, 0.75, 1],
              }}
            />
          </div>
        );
      case "typing":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <ScleraEye
              squint
              pose={{ x: ["-0.08em", "0.08em", "-0.08em"], y: "0.12em", duration: 1.6, times: [0, 0.5, 1] }}
            />
            <ScleraEye
              squint
              pose={{ x: ["-0.08em", "0.08em", "-0.08em"], y: "0.12em", duration: 1.6, times: [0, 0.5, 1] }}
            />
          </div>
        );
      case "authenticating":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <ScleraEye
              pose={{
                x: [0, 0, "-0.1em", "0.1em", 0, "-0.08em", 0, 0],
                y: [0, "-0.1em", "-0.03em", "-0.03em", "-0.1em", "-0.05em", 0, 0],
              }}
            />
            <ScleraEye
              pose={{
                x: [0, 0, "-0.1em", "0.1em", 0, "-0.08em", 0, 0],
                y: [0, "-0.1em", "-0.03em", "-0.03em", "-0.1em", "-0.05em", 0, 0],
              }}
            />
          </div>
        );
      case "happy":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <HappyArc />
            <HappyArc />
          </div>
        );
      case "peek":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <motion.div
              animate={{ scaleX: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
            >
              <ClosedLid />
            </motion.div>
            <motion.div
              animate={{ scaleX: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut", delay: 0.3 }}
            >
              <ClosedLid />
            </motion.div>
          </div>
        );
      case "error":
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.44em" }}>
            <CrossEye />
            <CrossEye />
          </div>
        );
      case "idle":
      default:
        return (
          <div className="flex items-center justify-center" style={{ gap: "0.48em" }}>
            <ScleraEye blink={isBlinking} wide={isHovered} pupilX={pupilX} pupilY={pupilY} rollControls={rollControls} />
            <ScleraEye blink={isBlinking} wide={isHovered} pupilX={pupilX} pupilY={pupilY} rollControls={rollControls} />
          </div>
        );
    }
  };

  const renderMouth = () => {
    if (angry) {
      return (
        <svg viewBox="0 0 16 12" fill="none" style={{ width: "0.85em", height: "0.55em" }}>
          <path d="M2 10 Q8 2 14 10" stroke={ERROR_COLOR} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    }
    if (state === "scanning") {
      return (
        <motion.div
          animate={{ x: ["0.05em", "0.07em", "0.03em", "0.07em", "0.05em"] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
          className="rounded-full bg-white/95"
          style={{ width: "0.26em", height: "0.13em" }}
        />
      );
    }
    if (state === "typing") {
      return (
        <motion.div
          animate={{ scaleX: [0.9, 1.15, 0.9] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="rounded-full bg-white/85"
          style={{ width: "0.42em", height: "0.1em" }}
        />
      );
    }
    if (state === "authenticating") {
      return (
        <motion.div
          animate={{ scaleX: [1, 1.25, 1, 1.1, 1.2, 1, 1.05, 1] }}
          transition={{ ...LOAD_LOOP }}
          className="rounded-full bg-white"
          style={{ width: "0.5em", height: "0.18em" }}
        />
      );
    }
    if (state === "happy") {
      return (
        <svg viewBox="0 0 16 12" fill="none" style={{ width: "0.78em", height: "0.48em" }}>
          <path d="M2 3 Q8 11 14 3" stroke={EYE_COLOR} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (state === "error") {
      return (
        <svg viewBox="0 0 16 12" fill="none" style={{ width: "0.78em", height: "0.48em" }}>
          <path d="M2 9 Q8 3 14 9" stroke={ERROR_COLOR} strokeWidth="2.8" strokeLinecap="round" />
        </svg>
      );
    }
    if (state === "peek") {
      return <div className="rounded-full bg-white/80" style={{ width: "0.28em", height: "0.12em" }} />;
    }
    return (
      <motion.div
        animate={{ scaleX: isHovered ? 1.25 : 1 }}
        transition={{ duration: 0.25 }}
        className="rounded-full bg-white/90"
        style={{ width: "0.48em", height: "0.11em" }}
      />
    );
  };

  const NOTE_THEME = {
    body: "linear-gradient(135deg, #ffffff 0%, #f3ffe8 100%)",
    border: "rgba(148, 236, 64, 0.48)",
    text: "#346415",
    filter: "drop-shadow(0 0.35em 0.8em rgba(48, 87, 22, 0.15)) drop-shadow(0 0.08em 0.2em rgba(48, 87, 22, 0.1))",
  };

  const renderThoughtBubble = () => (
    <AnimatePresence>
      {state === "scanning" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.3, y: 8 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -2.5, 0, -1.5, 0],
            rotate: [3, -4, 5, -3, 3],
          }}
          exit={{ opacity: 0, scale: 0.3, y: 6 }}
          transition={{ y: { repeat: Infinity, duration: 2.6, ease: "easeInOut" }, rotate: { repeat: Infinity, duration: 3.4, ease: "easeInOut" } }}
          className="absolute -top-[1.3em] right-[-0.1em] z-30 flex flex-col items-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center rounded-full bg-white font-black shadow-lg"
            style={{
              width: "1.2em",
              height: "1.2em",
              fontSize: "0.7em",
              color: "#5CB818",
              boxShadow: "0 0.08em 0.3em rgba(20,50,0,0.25)",
            }}
          >
            ?
          </motion.div>
          <div className="rounded-full bg-white/95 shadow-sm" style={{ width: "0.3em", height: "0.3em", marginTop: "0.06em", marginRight: "0.55em" }} />
          <div className="rounded-full bg-white/85 shadow-sm" style={{ width: "0.19em", height: "0.19em", marginTop: "0.05em", marginRight: "0.95em" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  const isError = state === "error" || angry;
  const mood: BotState = angry ? "error" : state;

  return (
    <div
      ref={botRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="img"
      aria-label={`Klaro bot — ${angry ? "angry" : state}`}
      className={cn("relative select-none cursor-pointer group shrink-0 flex flex-col items-center justify-center", className)}
      style={{ width: px, height: px, fontSize: font }}
    >
      <AnimatePresence>
        {speech?.length && !angry && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="absolute z-40 pointer-events-none"
            style={{ bottom: "calc(100% + 0.65em)", left: "50%", x: "-50%", width: "max-content", maxWidth: "min(82vw, 19em)" }}
          >
            <div className="relative flex flex-col items-center" style={{ filter: NOTE_THEME.filter }}>
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                className="relative overflow-visible rounded-[1.35em] border backdrop-blur-sm"
                style={{
                  padding: "0.9em 1.15em",
                  background: NOTE_THEME.body,
                  borderColor: NOTE_THEME.border,
                  boxShadow: "inset 0 0.08em 0 rgba(255,255,255,0.9)",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={thoughtIdx}
                    initial={{ opacity: 0, y: 6, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="relative z-10 block whitespace-normal text-center font-semibold leading-[1.35]"
                    style={{ fontSize: Math.max(11, font * 0.72), color: NOTE_THEME.text }}
                  >
                    {speech[thoughtIdx % speech.length]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 320, damping: 22 }}
                className="relative flex flex-col items-center"
              >
                <div
                  className="rounded-full border"
                  style={{ width: "0.3em", height: "0.3em", marginTop: "0.14em", marginLeft: "1.1em", background: NOTE_THEME.body, borderColor: NOTE_THEME.border }}
                />
                <div
                  className="rounded-full border"
                  style={{ width: "0.2em", height: "0.2em", marginTop: "0.09em", marginLeft: "0.45em", background: NOTE_THEME.body, borderColor: NOTE_THEME.border }}
                />
                <div
                  className="rounded-full border"
                  style={{ width: "0.11em", height: "0.11em", marginTop: "0.07em", marginLeft: "-0.1em", background: NOTE_THEME.body, borderColor: NOTE_THEME.border }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={bodyVariants}
        animate={mood}
        className="relative z-10 w-full h-full flex items-center justify-center"
        style={{
          rotateX: trackingEnabled && !angry ? tiltX : 0,
          rotateY: trackingEnabled && !angry ? tiltY : 0,
          transformPerspective: 500,
        }}
      >
        {renderThoughtBubble()}

        <motion.div animate={pokeControls} className="relative z-10 w-full h-full flex items-center justify-center">
        <div
          className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden"
          style={{
            borderRadius: "26%",
            background: BODY_GRADIENT,
            border: "1px solid rgba(113,113,122,0.35)",
            boxShadow:
              "0 0.15em 0.45em rgba(0,0,0,0.18), inset 0 0.1em 0.14em rgba(255,255,255,0.6), inset 0 -0.2em 0.4em rgba(20,60,0,0.22)",
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[45%] pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent)" }}
          />

          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{ borderRadius: "26%", boxShadow: `inset 0 0 0.6em ${ERROR_COLOR}66` }}
            />
          )}

          <motion.div style={{ x: faceX, y: faceY }} className="relative z-10 flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={angry ? "angry" : state}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {renderEyes()}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div className="relative z-10 flex justify-center" style={{ marginTop: "0.52em" }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={angry ? "angry" : state}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex justify-center"
              >
                {renderMouth()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        </motion.div>
      </motion.div>

      {showShadow && (
        <motion.div
          animate={
            state === "authenticating"
              ? {
                  scaleX: [1, 0.85, 1, 1, 0.88, 1, 0.95, 1],
                  opacity: [0.2, 0.12, 0.2, 0.2, 0.14, 0.2, 0.17, 0.2],
                }
              : state === "happy"
              ? { scaleX: [0.8, 1.05, 0.8], opacity: [0.12, 0.2, 0.12] }
              : { scaleX: [0.92, 1, 0.92], opacity: [0.15, 0.25, 0.15] }
          }
          transition={{
            repeat: Infinity,
            duration: state === "authenticating" ? 3 : state === "happy" ? 0.8 : 2.8,
            ease: "easeInOut",
            times: state === "authenticating" ? LOAD_TIMES : undefined,
          }}
          className="absolute left-1/2 -translate-x-1/2 -bottom-[0.25em] rounded-[100%] blur-[1.5px] pointer-events-none"
          style={{ width: "60%", height: "0.18em", backgroundColor: "rgba(20,50,0,0.35)" }}
        />
      )}
    </div>
  );
};
