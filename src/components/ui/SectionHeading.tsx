import type { ReactNode } from 'react'

type SectionHeadingProps = {
  id: string
  eyebrow?: string
  title: string
  description?: string
  action?: ReactNode
}

export function SectionHeading({ id, eyebrow, title, description, action }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" id={id}>
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">{eyebrow}</p>
        ) : null}
        <h2 className="font-outfit text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
