import type { InputHTMLAttributes } from 'react'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 disabled:opacity-50'

type TravelInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

export function TravelInput({ label, className = '', id, ...rest }: TravelInputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <label htmlFor={inputId} className="block space-y-1.5 text-sm">
      <span className="text-slate-400">{label}</span>
      <input id={inputId} className={[inputClass, className].join(' ')} {...rest} />
    </label>
  )
}
