import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// shadcn/21st.dev-shaped Button, themed to the Mozhippattru washi/gold brand.
// Use this as the base when pulling 21st.dev components that expect `Button`.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default: 'bg-[var(--red)] text-white shadow-[0_6px_18px_rgba(226,65,56,0.28)] hover:bg-[var(--red-hover)] hover:-translate-y-px',
        navy: 'bg-[var(--navy)] text-white hover:brightness-110',
        gold: 'bg-[var(--gold)] text-[#2a2410] hover:brightness-95',
        outline: 'border border-[var(--line-warm)] bg-transparent text-[var(--ink)] hover:border-[var(--ink)]',
        ghost: 'bg-transparent text-[var(--ink)] hover:bg-[rgba(40,32,20,0.05)]',
        soft: 'bg-[var(--paper-2)] text-[var(--ink)] hover:brightness-95',
      },
      size: {
        default: 'h-10 px-5 py-2',
        sm: 'h-8 px-3.5 text-[13px]',
        lg: 'h-12 px-7 text-[15px]',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  ),
)
Button.displayName = 'Button'

export { Button, buttonVariants }
