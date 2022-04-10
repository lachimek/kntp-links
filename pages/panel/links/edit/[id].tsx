import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Page as PrismaPage, Link, Prisma } from '@prisma/client'
import { Session } from 'next-auth'
import { Page } from 'types/page'
import prisma from 'db'
import { AnimatePresence, motion } from 'framer-motion'
import Modal from 'components/Modal'
import { server } from 'config'

const prismaPageWithLinks = Prisma.validator<Prisma.PageArgs>()({
  include: { links: true },
})

type PrismaPageWithLinks = Prisma.PageGetPayload<typeof prismaPageWithLinks>

interface LinkData {
  id: string
  content: string
  href: string
  explicit: boolean
}

interface FieldError {
  error: boolean
  message: string
}

interface FormError {
  content: FieldError
  href: FieldError
}

interface Props {
  session: Session
  data: PrismaPageWithLinks
}

const Edit: Page<Props> = ({ session, data }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [linkFormData, setLinkFormData] = useState<LinkData>({
    id: '',
    content: '',
    href: '',
    explicit: false,
  })
  const [formErrors, setFormErrors] = useState<FormError>({
    content: { error: false, message: '' },
    href: { error: false, message: '' },
  })
  const [links, setLinks] = useState<LinkData[]>(data.links)
  const [editId, setEditId] = useState('')
  const handleSubmit = async () => {
    const expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
    const regex = new RegExp(expression)
    let valid = true
    if (linkFormData.content === '') {
      setFormErrors((prev) => {
        return {
          ...prev,
          content: {
            error: true,
            message: 'Pole wymagane',
          },
        }
      })
      valid = false
    }

    if (linkFormData.href === '') {
      setFormErrors((prev) => {
        return {
          ...prev,
          href: {
            error: true,
            message: 'Pole wymagane',
          },
        }
      })
      valid = false
    } else {
      if (!linkFormData.href.match(regex)) {
        setFormErrors((prev) => {
          return {
            ...prev,
            href: {
              error: true,
              message: 'Błędny format linku',
            },
          }
        })
        valid = false
      }
    }

    if (valid) {
      const response = await fetch(`${server}/api/page/createNewLink`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editId !== '' ? editId : crypto.randomUUID(),
          content: linkFormData.content,
          href: linkFormData.href,
          explicit: linkFormData.explicit,
        }),
      })
      const json = await response.json()
      console.log(json)
      setLinks(json)
      clearFormData()
      setIsOpen(false)
    }
  }

  const clearFormData = () => {
    setLinkFormData({
      id: '',
      content: '',
      href: '',
      explicit: false,
    })
    setEditId('')
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="mt-8 flex w-96 flex-col items-center">
        <Image
          height={100}
          width={100}
          src={data.profilePictureLink}
          className={'rounded-full'}
        />
        <input
          type="text"
          placeholder="Twoja nazwa"
          className="w-full appearance-none bg-transparent text-center text-xl focus:outline-none"
          maxLength={30}
          defaultValue={data.userName}
        />
        <textarea
          className="w-full resize-none appearance-none bg-transparent text-center text-sm opacity-50 focus:outline-none"
          placeholder="Twój opis"
          rows={2}
          wrap={'hard'}
          maxLength={200}
          defaultValue={data.description}
        ></textarea>
        {/* <div className="flex flex-col">
          <button
            className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
            onClick={handlePageCreation}
          >
            Zatwierdź dane aby móc dodać linki
          </button>
        </div> */}
      </div>
      <div className="mt-2 flex w-64 flex-col items-center">
        <AnimatePresence>
          {links.map((link, index) => (
            <motion.div
              variants={{
                start: { y: 0, opacity: 0 },
                animate: (index) => ({
                  y: [0, 10, 0],
                  opacity: 1,
                  transition: { delay: index * 0.1 },
                }),
              }}
              initial="start"
              animate="animate"
              custom={index}
              key={index}
              className="mt-5 w-full rounded-md border-2 border-white text-center"
            >
              <div
                className="cursor-pointer px-8 py-4 transition-colors hover:bg-white hover:text-black"
                onClick={() => {
                  setEditId(link.id)
                  setLinkFormData(link)
                  setIsOpen(true)
                }}
              >
                {link.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <button
          className="mt-5 w-full rounded-md border-2 border-white px-8 py-4 text-center transition-colors hover:bg-white hover:text-black"
          onClick={() => setIsOpen(true)}
        >
          Nowy link
        </button>
      </div>
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={clearFormData}
        headerText={
          editId === '' ? 'Uzupełnij dane linku' : 'Edycja danych linku'
        }
      >
        <div className="w-96">
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="content"
            >
              Tekst linku
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none ${
                formErrors.content.error && 'border-red-600'
              }`}
              id="content"
              type="text"
              placeholder="Tekst linku"
              onChange={(e) => {
                setLinkFormData({
                  ...linkFormData,
                  content: e.currentTarget.value,
                })
                setFormErrors({
                  ...formErrors,
                  content: { error: false, message: '' },
                })
              }}
              value={linkFormData.content}
            />
            <span className="text-sm text-red-600">
              {formErrors.content.message}
            </span>
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-sm font-bold text-gray-700"
              htmlFor="href"
            >
              Adres linku
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none ${
                formErrors.href.error && 'border-red-600'
              }`}
              id="href"
              type="text"
              placeholder="Adres linku"
              onChange={(e) => {
                setLinkFormData({
                  ...linkFormData,
                  href: e.currentTarget.value,
                })
                setFormErrors({
                  ...formErrors,
                  href: { error: false, message: '' },
                })
              }}
              value={linkFormData.href}
            />
            <span className="text-sm text-red-600">
              {formErrors.href.message}
            </span>
          </div>
          <div className="mb-6">
            <label className="flex cursor-pointer items-center justify-start font-bold text-gray-500">
              <input
                className="mr-2 cursor-pointer leading-tight"
                type="checkbox"
                onChange={(e) =>
                  setLinkFormData({
                    ...linkFormData,
                    explicit: e.currentTarget.checked,
                  })
                }
                checked={linkFormData.explicit}
              />
              <span className="text-sm">Czy link zawiera treści +18?</span>
            </label>
          </div>
          <div className="flex w-full justify-center">
            <button
              className="my-2 rounded-md border-2 border-black px-8 py-3 text-center transition-colors hover:bg-black hover:text-white"
              onClick={handleSubmit}
            >
              Dodaj Link
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context)
  const { id } = context.query

  let data = null
  if (id) {
    data = await prisma.page.findFirst({
      where: {
        id: id as string,
      },
      include: {
        links: true,
      },
    })
  }

  if (!data) {
    return {
      redirect: {
        destination: '/panel/links?error_message=page_not_found',
        permanent: false,
      },
    }
  }

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
      data: data,
      showNavbar: true,
    },
  }
}

export default Edit
