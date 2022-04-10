import React, { useState, useEffect } from 'react'

/**
 * Hook that alerts clicks outside of the passed ref
 */
export default function useOutsideClick(ref: any) {
  const [outsideClick, setOutsideClick] = useState(false)

  function reset() {
    setOutsideClick(false)
  }
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOutsideClick(true)
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
      setOutsideClick(false)
    }
  }, [ref])

  return { outsideClick, reset }
}
