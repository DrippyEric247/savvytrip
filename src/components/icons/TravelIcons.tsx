import type { RouteMode } from '../../data/mockData'

const iconClass = 'h-4 w-4 shrink-0'

export function ModeIcon({ mode }: { mode: RouteMode }) {
  switch (mode) {
    case 'flight':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M21 8.5l-15 4.5-4-2.5v-2l4 1.5L21 3v5.5zM3 15.5l4 1.5 15-4.5V18l-15 4.5-4-2.5v-4.5z"
            fill="currentColor"
            opacity="0.9"
          />
        </svg>
      )
    case 'train':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 15.5V8c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v7.5M4 15.5h16M6 18h3M15 18h3M8 10h8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'rideshare':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 17l1.5-7h11L19 17M6.5 10h11M8 7l1-2h6l1 2"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="7.5" cy="17" r="1.4" fill="currentColor" />
          <circle cx="16.5" cy="17" r="1.4" fill="currentColor" />
        </svg>
      )
    case 'hotel':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 20V9l8-4 8 4v11M9 20v-5h6v5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return null
  }
}
