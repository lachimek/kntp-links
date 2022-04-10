import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { AiOutlineEdit } from '@react-icons/all-files/Ai/AiOutlineEdit'
import { BsTrash } from '@react-icons/all-files/Bs/BsTrash'
import { AiOutlineBarChart } from '@react-icons/all-files/Ai/AiOutlineBarChart'
import { Page } from 'types/page'
import prisma from 'db'
import { server } from 'config'
import { useState } from 'react'

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
  const [pages, setPages] = useState([...data.pages])

  const handleDelete = async (pageId: string, userId: string) => {
    const response = await fetch(`${server}/api/page/${pageId}/${userId}`, {
      method: 'DELETE',
    })
    const json = await response.json()
    setPages(json.message)
    console.log(json)
  }
  return (
    <div className="mt-8 flex flex-col items-center">
      <h1 className="mb-8 text-3xl font-bold">MOJE LINKI</h1>
      {pages.map((page) => (
        <div
          className="sm:group mb-6 flex flex-col items-center sm:flex-row"
          key={page.id}
        >
          <a
            href={`/${page.pageName}`}
            className="w-96 rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
          >
            <div className="flex">
              <img
                src={page.profilePictureLink}
                className="h-[50px] w-[50px] rounded-full object-scale-down transition-transform group-hover:scale-105"
                alt="Thumbnail of page"
              />
              <div className="ml-4 flex flex-col items-start">
                <span>{page.userName}</span>
                <span>{page.description}</span>
              </div>
            </div>
          </a>
          <div className="flex rounded-b-md border-2 border-t-0 border-white py-2 px-4 sm:rounded-none sm:rounded-r-md sm:border-l-0 sm:border-t-2 ">
            <a href={`links/stats/${page.id}`}>
              <AiOutlineBarChart className="mr-4 cursor-pointer text-2xl hover:text-gray-300" />
            </a>
            <a href={`links/edit/${page.id}`}>
              <AiOutlineEdit className="cursor-pointer text-2xl hover:text-gray-300" />
            </a>
            <BsTrash
              className="ml-4 cursor-pointer text-2xl text-red-500 hover:text-red-600"
              onClick={() => handleDelete(page.id, page.userId)}
            />
          </div>
        </div>
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
      session: session,
      showNavbar: true,
    },
  }
}

export default Links
