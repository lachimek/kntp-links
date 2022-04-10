import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { Page } from 'types/page'

const Home: Page = () => {
  return (
    <div className="flex w-full justify-between px-8 pt-4">
      <span>Strona domowa</span>
    </div>
  )
}

// Home.getLayout = function getLayout(page) {
//   return <NavbarLayout>{page}</NavbarLayout>
// }

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  return {
    props: {
      session: session,
      showNavbar: true,
    },
  }
}

export default Home
