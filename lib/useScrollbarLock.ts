'use client'

import { useEffect } from 'react'

/**
 * Hook to prevent layout shift when dropdowns/modals open by maintaining scrollbar space
 */
export function useScrollbarLock(isOpen: boolean) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const originalStyle = window.getComputedStyle(document.body)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    if (isOpen && scrollbarWidth > 0) {
      // Add padding to compensate for scrollbar width
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      // Remove padding when closed
      document.body.style.paddingRight = originalStyle.paddingRight
    }

    // Cleanup on unmount
    return () => {
      document.body.style.paddingRight = originalStyle.paddingRight
    }
  }, [isOpen])
}

/**
 * Hook to get the scrollbar width
 */
export function useScrollbarWidth() {
  if (typeof window === 'undefined') return 0
  
  return window.innerWidth - document.documentElement.clientWidth
}
