import { GetServerSideProps } from 'next'
import Image from 'next/image'
import { getSession } from 'next-auth/react'
import { NavbarLayout } from '../../components/NavbarLayout'
import { Page } from '../../types/page'
import prisma from '../../db'

interface IPageData {
  id: string
  pageName: string
  profilePictureLink: string
  userName: string
  description: string
  userId: string
}

interface Props {
  data: {
    pages: IPageData[]
  }
}

const Links: Page<Props> = ({ data }) => {
  return (
    <div className="flex items-center">
      {data.pages.map((page) => (
        <a
          key={page.id}
          href={`/${page.pageName}`}
          className="mr-4 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
        >
          <div className="flex">
            <Image
              src={page.profilePictureLink}
              className="rounded-full"
              width="50px"
              height="50px"
            />
            <div className="ml-4 flex flex-col items-start">
              <span>{page.userName}</span>
              <span>{page.description}</span>
            </div>
          </div>
        </a>
      ))}
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

  const data = await prisma.user.findFirst({
    where: {
      email: session!.user!.email,
    },
    select: {
      pages: true,
    },
  })

  if (!data) {
    return {
      redirect: {
        destination: `/?error_message=user_not_found`,
        permanent: false,
      },
    }
  }

  // Pass post data to the page via props
  return {
    props: {
      data: data,
    },
  }
}

Links.getLayout = function getLayout(page) {
  return <NavbarLayout>{page}</NavbarLayout>
}

export default Links
