import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge.
 * This function is used to merge tailwind classes without conflicts.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}