import { cn } from '@/lib/utils'

type Color = 'green' | 'blue' | 'yellow' | 'red' | 'gray'

const APPLICATION_STATUS_COLORS: Record<string, Color> = {
  REGISTERED:    'gray',
  PAID:          'blue',
  IN_PROGRESS:   'yellow',
  UNDER_REVIEW:  'yellow',
  SUBMITTED:     'green',
  COMPLETED:     'green',
}

const colorMap: Record<Color, string> = {
  green:  'badge-green',
  blue:   'badge-blue',
  yellow: 'badge-yellow',
  red:    'badge-red',
  gray:   'badge-gray',
}

interface BadgeProps {
  label:     string
  color?:    Color
  status?:   string
  className?: string
}

export function Badge({ label, color, status, className }: BadgeProps) {
  const resolvedColor = color ?? (status ? APPLICATION_STATUS_COLORS[status] ?? 'gray' : 'gray')
  return (
    <span className={cn(colorMap[resolvedColor], className)}>
      <span className={cn('status-dot', {
        'bg-brand-500':  resolvedColor === 'green',
        'bg-blue-500':   resolvedColor === 'blue',
        'bg-yellow-500': resolvedColor === 'yellow',
        'bg-red-500':    resolvedColor === 'red',
        'bg-slate-400':  resolvedColor === 'gray',
      })} />
      {label}
    </span>
  )
}
