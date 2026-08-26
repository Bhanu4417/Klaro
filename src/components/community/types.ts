export interface CommunityProfile {
  id: string;
  name: string;
  avatarUrl: string;
  // Position as percentage on the right canvas (0 to 100)
  x: number; // percentage from left
  y: number; // percentage from top
  size: number; // avatar diameter in px
  delay: number; // entrance delay in seconds
  floatDuration?: number; // duration of ambient floating
  floatDistance?: number; // distance in px of floating bob
  message?: string;
  messageDelay?: number; // delay before bubble appears
  messagePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom";
  messageRotation?: number; // subtle angle e.g. -1.5 to 1.5 deg
}
