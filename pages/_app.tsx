import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Fragment } from 'react'
import { SessionProvider } from 'next-auth/react'
import type { Page } from '../types/page'

type Props = AppProps & {
  Component: Page
}
const MyApp = ({ Component, pageProps }: Props) => {
  // adjust accordingly if you disabled a layout rendering option
  const getLayout = Component.getLayout ?? ((page) => page)
  const Layout = Component.layout ?? Fragment

  return (
    <SessionProvider>
      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </SessionProvider>
  )

  // or swap the layout rendering priority
  // return getLayout(<Layout><Component {...pageProps} /></Layout>)
}

export default MyApp
