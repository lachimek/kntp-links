import React, { Component, ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: ReactNode
  headerText: string
  onClose?: Function
}

const Modal: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  children,
  headerText,
  onClose,
}) => {
  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        if (onClose) onClose()
      }
    }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [])

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          variants={{
            visible: {
              opacity: 1,
              transition: {
                duration: 0,
              },
            },
            hidden: {
              opacity: 0,
              transition: {
                duration: 0.3,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed top-[30%] z-20 h-auto max-w-sm rounded-md bg-white px-4 py-2 text-black drop-shadow-xl sm:max-w-xl lg:left-[50%] lg:translate-x-[-50%]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-baseline justify-between pb-2">
            <h1 className="text-xl ">{headerText}</h1>
            <button
              className="rounded-xl py-2 px-3 transition-colors hover:bg-black hover:text-white"
              onClick={() => {
                setIsOpen(!isOpen)
                if (onClose) onClose()
              }}
            >
              &#10005;
            </button>
          </div>
          <div className="flex-grow border-t border-gray-700 py-2"></div>
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default Modal
