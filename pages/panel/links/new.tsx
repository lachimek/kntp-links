import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { MdPhotoCamera } from '@react-icons/all-files/md/MdPhotoCamera'
import { Page } from 'types/page'
import Modal from 'components/Modal'
import { AnimatePresence, motion } from 'framer-motion'
import { server } from 'config'
import prisma from 'db'
import CreateNewPage from 'components/CreateNewPage'
import { Session } from 'next-auth'
import { useRouter } from 'next/router'

interface Props {
  session: Session
}

const NewLinks: Page<Props> = ({ session }) => {
  const router = useRouter()
  const [pageName, setPageName] = useState('')
  const [pageDescription, setPageDescription] = useState('')
  const [pageImage, setPageImage] = useState<string | Blob>('')
  const [imageObjectURL, setImageObjectURL] = useState('')

  const [pageUrl, setPageUrl] = useState('')

  const handleClientImage = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0]
      const imgUrl = URL.createObjectURL(img)
      let imgObj = new Image()
      imgObj.src = imgUrl
      imgObj.onload = () => {
        if (imgObj.height > 512 || imgObj.width > 512) {
          alert('Maksymalne wymiary obrazka to 512x512')
        } else {
          setPageImage(img)
          setImageObjectURL(imgUrl)
        }
      }
    }
  }

  const handlePageCreation = async () => {
    const userEmail = session!.user!.email || ''
    if (userEmail !== '') {
      const body = new FormData()
      body.append('file', pageImage)
      body.append('pageName', pageName)
      body.append('pageDescription', pageDescription)
      body.append('pageUrl', pageUrl)
      body.append('userEmail', userEmail)

      console.log('body', body)

      const response = await fetch(`${server}/api/page/createNewPage`, {
        method: 'POST',
        body,
      })
      const json = await response.json()
      if (!json.error)
        router.push({
          pathname: './',
        })
      console.log(json)
    }
  }

  if (pageUrl === '') {
    return <CreateNewPage setPageUrl={setPageUrl} />
  } else
    return (
      <div className="flex w-full flex-col items-center">
        <div className="mt-8 flex w-96 flex-col items-center">
          {imageObjectURL === '' ? (
            <>
              <input
                type="file"
                id="image-input"
                name="pageImage"
                className="hidden"
                accept="image/png, image/jpeg, .jpg, .png"
                onChange={handleClientImage}
              />
              <label
                htmlFor="image-input"
                className="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-gray-500"
              >
                <MdPhotoCamera className="h-8 w-8 cursor-pointer" />
              </label>
            </>
          ) : (
            <img
              src={imageObjectURL}
              alt="Thumbnail of page"
              className="h-[100px] w-[100px] rounded-full"
            />
          )}
          <input
            type="text"
            placeholder="Twoja nazwa"
            className="w-full appearance-none bg-transparent text-center text-xl focus:outline-none"
            maxLength={30}
            onChange={(e) => setPageName(e.currentTarget.value)}
            value={pageName}
          />
          <textarea
            className="w-full resize-none appearance-none bg-transparent text-center text-sm opacity-50 focus:outline-none"
            placeholder="Twój opis"
            rows={2}
            wrap={'hard'}
            maxLength={200}
            onChange={(e) => setPageDescription(e.currentTarget.value)}
            value={pageDescription}
          ></textarea>
          <div className="flex flex-col">
            <button
              className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
              onClick={handlePageCreation}
            >
              Zatwierdź dane aby móc dodać linki
            </button>
          </div>
        </div>
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

export default NewLinks
