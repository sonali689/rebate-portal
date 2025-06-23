import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Feature-flag: hide/show all “bill” UI
export const ENABLE_BILL = process.env.NEXT_PUBLIC_ENABLE_BILL === "true";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

