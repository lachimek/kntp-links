import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import React from 'react'
import { Page } from 'types/page'

const UserPanel: Page = () => {
  return (
    <div className="flex flex-col space-y-5">
      <a
        href="panel/links"
        className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
      >
        Moje linki
      </a>
      <a
        href="panel/links/new"
        className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
      >
        Nowa strona z linkami
      </a>
      <a
        href="panel/stats"
        className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
      >
        Statystyki
      </a>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)

  if (!session) {
    return {
      redirect: {
        destination: '/?error_message=not_logged_in',
        permanent: false,
      },
    }
  }

  return {
    props: {
      session: await getSession(context),
      showNavbar: true,
    },
  }
}

export default UserPanel
