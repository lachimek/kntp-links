import React, { ReactNode } from 'react'
import { server } from 'config'

interface Props {
  href: string
  uid: string
  linkId: number
  children: ReactNode
  className?: string
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

const TrackedLink: React.FC<Props> = ({
  href,
  uid,
  linkId,
  children,
  className,
  setIsOpen,
}) => {
  const trackLink = async (linkId: number) => {
    if (setIsOpen) setIsOpen(false)
    const response = await fetch(`${server}/api/link/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ linkId: linkId, uid: uid }),
    })
    console.log('response: ', response)
  }

  if (className)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        className={className}
        onClick={() => trackLink(linkId)}
        onAuxClick={() => trackLink(linkId)}
      >
        {children}
      </a>
    )
  else
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener"
        onClick={() => trackLink(linkId)}
        onAuxClick={() => trackLink(linkId)}
      >
        {children}
      </a>
    )
}

export default TrackedLink
