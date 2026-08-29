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
  /** Fun one-liners shown in a speech bubble when the bot is clicked.
       Spam-click it and it gets angry. Omit to keep clicks silent. */
  speech?: string[];
  className?: string;
  onClick?: () => void;
}

const ERROR_COLOR = "#FF5353";
const PUPIL_COLOR = "#141416";
const EYE_COLOR = "#FFFFFF";

/* Compact footprint per size. Everything scales via `em` */
const SIZE_CONFIG = {
  sm: { px: 40, font: 10 },
  md: { px: 60, font: 15 },
  lg: { px: 90, font: 22.5 },
  xl: { px: 128, font: 32 },
  hero: { px: 176, font: 44 },
} as const;

/* Vibrant brand green - electric, vivid Klaro neon */
const BODY_GRADIENT = "linear-gradient(180deg, #A8F55D 0%, #94EC40 55%, #7ADB2B 100%)";

/* Duolingo-style loading workout: one choreographed 3s loop.
   hop → tilt left → tilt right → wiggle → bob → settle, then repeat. */
const LOAD_TIMES = [0, 0.14, 0.28, 0.42, 0.56, 0.7, 0.84, 1];
const LOAD_LOOP = { repeat: Infinity, duration: 3, ease: "easeInOut", times: LOAD_TIMES } as const;

/* ---------- Eye primitives ---------- */

/* White sclera with a roaming black eyeball.
   Either driven by cursor springs (pupilX/pupilY) or a scripted `pose`. */
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
      {/* Annoyed eye-roll layer — driven imperatively on click */}
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
          {/* Pupil catchlight */}
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

/* Angry eye: slanted brow over a fully red glowing eye, like a classic angry face */
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
  speech,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);
  const [angry, setAngry] = useState(false);
  const botRef = useRef<HTMLDivElement>(null);
  const clickCount = useRef(0);
  const bubbleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const angerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Click → bulge squash-and-spring, annoyed eye-roll, then the speech bubble.
     Every 5th click tips it over into an angry face. */
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

    /* Every 5th click → anger episode, then the chatter resumes fresh */
    if (clickCount.current % 5 === 0) {
      setBubble(null);
      setAngry(true);
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
      if (angerTimer.current) clearTimeout(angerTimer.current);
      angerTimer.current = setTimeout(() => setAngry(false), 2600);
      return;
    }

    const msg = speech[(clickCount.current - 1) % speech.length];
    setBubble(msg);
    if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 2400);
  };

  useEffect(
    () => () => {
      if (bubbleTimer.current) clearTimeout(bubbleTimer.current);
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

  /* Poke bulge + annoyed eye-roll, fired on every click */
  const pokeControls = useAnimationControls();
  const rollControls = useAnimationControls();

  // Cursor tracking only in idle
  const trackingEnabled = interactive && state === "idle";

  /* Pupils roam the full sclera slack toward the cursor; the whole face
     drifts along at half strength so the follow reads clearly. */
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

      pupilX.set(normX * f * 0.11); // full horizontal slack inside the sclera
      pupilY.set(normY * f * 0.15);
      faceX.set(normX * f * 0.05); // face leans with the gaze
      faceY.set(normY * f * 0.06);
      tiltY.set(normX * 6);
      tiltX.set(-normY * 4);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [trackingEnabled, size, pupilX, pupilY, faceX, faceY, tiltX, tiltY]);

  /* Natural blinking in idle */
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

  /* Floating body levitation & reaction animations */
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
      // Person-thinking body language: slow pondering head-tilt with a thoughtful bob
      y: [-1, 0.6, -1.6, 0.6, -1],
      rotate: [2, 7, 4, 8.5, 2],
      transition: { repeat: Infinity, duration: 3.4, ease: "easeInOut" },
    },
    authenticating: {
      // Duolingo-style workout: hop, tilt left, tilt right, wiggle, bob, settle
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
      /* Angry face: slanted brows + pulsing red glowing eyes */
      return (
        <div className="flex items-center justify-center" style={{ gap: "0.44em" }}>
          <AngryEye />
          <AngryEye flip />
        </div>
      );
    }
    switch (state) {
      case "scanning":
        /* Thinking gaze: eyes drift up as if pondering, wander side to side */
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
        /* Reading: pupils sweep across the line, looking down */
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
        /* Eyes ride along with the workout: up on hops, look left, look right */
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
        /* Password: eyes calmly shut — one clean line per eye, soft sleep breathing */
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
      /* Deep angry frown, like the classic grumpy face */
      return (
        <svg viewBox="0 0 16 12" fill="none" style={{ width: "0.85em", height: "0.55em" }}>
          <path d="M2 10 Q8 2 14 10" stroke={ERROR_COLOR} strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    }
    if (state === "scanning") {
      /* Thoughtful "hmm" — a small line drifted to one side */
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
      /* Open excited smile pumping with the workout */
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

  /* Clean floating thought bubble: white disc with a green "?" and a
     trailing pair of thought dots — no stalk, no black. */
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
          {/* Thought-bubble trail dots leading back to the head */}
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
      {/* Speech bubble — pops on click, cycles through the one-liners */}
      <AnimatePresence>
        {bubble && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="absolute z-40 whitespace-nowrap rounded-xl bg-white font-semibold shadow-lg pointer-events-none"
            style={{
              bottom: "calc(100% + 0.5em)",
              left: "50%",
              x: "-50%",
              fontSize: Math.max(11, font * 0.75),
              padding: "0.4em 0.8em",
              color: "#3f6212",
            }}
          >
            {bubble}
            <div
              className="absolute left-1/2 bg-white"
              style={{ width: "0.55em", height: "0.55em", bottom: "-0.24em", transform: "translateX(-50%) rotate(45deg)" }}
            />
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

        {/* Poke bulge — squashes in on click, springs back out */}
        <motion.div animate={pokeControls} className="relative z-10 w-full h-full flex items-center justify-center">
          {/* VIBRANT BRAND GREEN SQUIRCLE BODY */}
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
          {/* Top-light sheen */}
          <div
            className="absolute inset-x-0 top-0 h-[45%] pointer-events-none"
            style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.28), transparent)" }}
          />

          {/* Error alarm ring */}
          {isError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.35, 0.7, 0.35] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{ borderRadius: "26%", boxShadow: `inset 0 0 0.6em ${ERROR_COLOR}66` }}
            />
          )}

          {/* Eyes — morph smoothly (angry ↔ normal and between states) */}
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

          {/* Mouth — morphs in sync with the eyes */}
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

      {/* Floor levitation shadow — pumps with the loading workout */}
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
