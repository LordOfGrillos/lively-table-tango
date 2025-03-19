
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nanoid(): string {
  // A more robust implementation that creates a 9-character ID
  return Math.random().toString(36).substring(2, 10) + 
         Math.random().toString(36).substring(2, 6);
}
