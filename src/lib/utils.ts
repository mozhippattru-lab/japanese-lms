import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/21st.dev-style class combiner. `cn('p-2', cond && 'bg-red')`.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
