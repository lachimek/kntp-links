import Head from 'next/head'

export const GuestLayout: React.FC = (props) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-night text-white">
      <Head>
        <title>KNTP-LINKS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
