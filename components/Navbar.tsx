import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { AiOutlineArrowRight } from 'react-icons/ai'
import useOutsideClick from 'hooks/useOutsideClick'

interface Props {
  session: Session
}

const Navbar: React.FC<Props> = ({ session }) => {
  const mobileNavRef = useRef(null)
  const [navOpen, setNavOpen] = useState(false)
  const { outsideClick, reset } = useOutsideClick(mobileNavRef)

  useEffect(() => {
    if (outsideClick && navOpen) {
      setNavOpen(false)
      reset()
    }
  }, [outsideClick])

  return (
    <nav className="flex w-full justify-between py-4 px-8">
      <a
        href="/"
        className="font-sans text-2xl font-bold no-underline transition-colors hover:text-gray-300"
      >
        KNTP-LINKS
      </a>

      {session ? (
        <div>
          <div className="hidden items-center lg:flex">
            <h1 className="pr-6 text-lg">
              Zalogowano jako {session.user?.name}
            </h1>

            <Link href="/panel">
              <a className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black">
                Panel użytkownika
              </a>
            </Link>
            <button
              className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
              onClick={() => signOut({ callbackUrl: window.location.origin })}
            >
              Wyloguj
            </button>
          </div>

          <GiHamburgerMenu
            className={`cursor-pointer text-2xl text-white hover:text-gray-300 sm:hidden ${
              navOpen ? 'invisible' : 'visible'
            }`}
            onClick={() => setNavOpen(true)}
          />
          {navOpen && (
            <div
              className="absolute top-0 right-0 z-10 h-full w-3/5 bg-black bg-opacity-70 p-5 lg:hidden"
              ref={mobileNavRef}
            >
              <AiOutlineArrowRight
                className="mb-4 cursor-pointer text-2xl hover:text-gray-300"
                onClick={() => setNavOpen(false)}
              />
              <div className="flex flex-col space-y-5">
                <h1 className="pr-6 text-lg">
                  Zalogowano jako <br /> {session.user?.name}
                </h1>

                <Link href="/panel">
                  <a
                    className="rounded-md border-2 border-white py-2 text-center transition-colors hover:bg-white hover:text-black"
                    onClick={() => setNavOpen(false)}
                  >
                    Panel użytkownika
                  </a>
                </Link>
                <button
                  className="rounded-md border-2 border-white py-2 text-center transition-colors hover:bg-white hover:text-black"
                  onClick={() =>
                    signOut({ callbackUrl: window.location.origin })
                  }
                >
                  Wyloguj
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
          onClick={() => signIn()}
        >
          Zaloguj
        </button>
      )}
    </nav>
  )
}

export default Navbar
