export interface CommunityProfile {
  id: string;
  name: string;
  avatarUrl: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  floatDuration?: number;
  floatDistance?: number;
  message?: string;
  messageDelay?: number;
  messagePosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top" | "bottom";
  messageRotation?: number;
}
