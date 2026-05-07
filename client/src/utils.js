import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for conditional classNames with Tailwind merge support
 * Prevents conflicting Tailwind classes like bg-red-500 + bg-blue-500
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}