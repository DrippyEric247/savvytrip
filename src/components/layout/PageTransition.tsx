import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type PageTransitionProps = {
  children: ReactNode
}

/** Subtle route enter animation — respects prefers-reduced-motion via CSS. */
export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [location.pathname])

  return (
    <div className={['page-transition', visible ? 'page-transition-visible' : ''].join(' ')}>
      {children}
    </div>
  )
}
