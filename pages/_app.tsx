import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Page } from '../types/page'
import Footer from 'components/Footer'
import Head from 'next/head'
import Link from 'next/link'
import Navbar from 'components/Navbar'
import { Session } from 'next-auth'

type Props = AppProps & {
  Component: Page
}
const MyApp = ({ Component, pageProps }: Props) => {
  // adjust accordingly if you disabled a layout rendering option
  const getLayout = Component.getLayout ?? ((page) => page)
  const Layout = Component.layout ?? Fragment

  return (
    <SessionProvider>
      {/* <Layout>{getLayout(<Component {...pageProps} />)}</Layout> */}
      <main className="flex min-h-screen w-full flex-col justify-between bg-night text-white">
        <Head>
          <title>KNTP-LINKS</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {pageProps.showNavbar && <Navbar session={pageProps.session} />}
        <div className="flex h-full w-full flex-grow justify-center py-8">
          <Component {...pageProps} />
        </div>
        <Footer />
      </main>
    </SessionProvider>
  )

  // or swap the layout rendering priority
  // return getLayout(<Layout><Component {...pageProps} /></Layout>)
}

export default MyApp
