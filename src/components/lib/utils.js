import { clsx, ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) { //  <-  Make sure 'export' is here
  return twMerge(clsx(inputs));
}