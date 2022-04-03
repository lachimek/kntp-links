import { useSession, signIn, signOut } from 'next-auth/react'
import Head from 'next/head'

export const NavbarLayout: React.FC = (props) => {
  const { data: session } = useSession()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-night text-white">
      <Head>
        <title>KNTP-LINKS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex w-full justify-between px-8 pt-4">
        <a
          href="/"
          className="font-sans text-2xl font-bold no-underline transition-colors hover:text-gray-300"
        >
          KNTP-LINKS
        </a>

        {session ? (
          <div className="flex items-center">
            <h1 className="pr-6 text-lg">
              Zalogowano jako {session.user?.name}
            </h1>
            <a
              href="/links"
              className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
            >
              Moje linki
            </a>
            <a
              href="#"
              className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
            >
              Panel użytkownika
            </a>
            <button
              className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
              onClick={() => signOut()}
            >
              Wyloguj
            </button>
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
      <main className="flex w-full flex-1 flex-col items-center">
        {props.children}
      </main>

      <footer className="flex w-full justify-end pr-4 pb-4 ">
        <h1 className="opacity-20 transition-opacity hover:opacity-100">
          Made with ❤️ by Lachimek
        </h1>
      </footer>
    </div>
  )
}
