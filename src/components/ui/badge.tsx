import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Brand-themed badge/pill (washi/gold). shadcn/21st.dev-shaped.
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(226,65,56,0.12)] text-[var(--red)]',
        gold: 'bg-[rgba(194,151,75,0.16)] text-[var(--gold)]',
        navy: 'bg-[rgba(22,26,51,0.1)] text-[var(--navy)]',
        success: 'bg-[#eefaf1] text-[#16a34a]',
        warning: 'bg-[#fff7ea] text-[#c2974b]',
        muted: 'bg-[var(--paper-2)] text-[var(--ink-soft)]',
        outline: 'border border-[var(--line-warm)] text-[var(--ink)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
