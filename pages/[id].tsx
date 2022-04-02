import { GetStaticProps, NextPage } from 'next'
import { GetStaticPaths } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Layout } from '../components/Layout'
import Modal from '../components/Modal'
import { server } from '../config'
import { Page } from '../types/page'

interface Link {
  id: number
  content: string
  href: string
  explicit: boolean
}

interface Props {
  data: {
    uid: string
    profilePicture: string
    userName: string
    description: string
    links: Link[]
  }
}

const Links: Page<Props> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [explicitLinkURL, setExplicitLinkURL] = useState('')

  return (
    <div
      className="flex w-full flex-col items-center"
      onClick={() => open && setOpen(false)}
    >
      <div className="flex flex-col items-center">
        <Image
          src={data.profilePicture}
          className="rounded-full"
          width="100px"
          height="100px"
        />
        <h1 className="pt-4 text-xl ">{data.userName}</h1>
        <h1 className="text-sm opacity-50 ">{data.description}</h1>
      </div>
      <div className="mt-2 flex w-64 flex-col items-center">
        <AnimatePresence>
          {data.links.map((link, index) => (
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
              key={link.id}
              className="mt-5 w-full rounded-md border-2 border-white text-center"
            >
              {link.explicit ? (
                <>
                  <div
                    className="cursor-pointer px-8 py-4 transition-colors hover:bg-white hover:text-black"
                    onClick={() => {
                      setOpen(true)
                      setExplicitLinkURL(link.href)
                    }}
                  >
                    {link.content}
                  </div>
                </>
              ) : (
                <a href={link.href}>
                  <div className="cursor-pointer px-8 py-4 transition-colors hover:bg-white hover:text-black">
                    {link.content}
                  </div>
                </a>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Modal isOpen={open} setIsOpen={setOpen} headerText={'Uwaga link +18'}>
        <div className="flex flex-col items-center">
          <div className="text-center text-lg sm:mx-8">
            Ten link może zawierać treści nieodpowiednie dla osób
            niepełnoletnich.
          </div>
          <a
            href={explicitLinkURL}
            className="mt-8 rounded-md border-2 border-black px-8 py-3 text-center transition-colors hover:bg-black hover:text-white"
          >
            Przejdź
          </a>
        </div>
      </Modal>
    </div>
  )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const arr: string[] = ['lachimek', 'kntp']
  const paths = arr.map((param) => {
    return {
      params: { id: param },
    }
  })
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const res = await fetch(`${server}/api/user/${context.params!.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()

  // Pass post data to the page via props
  return {
    props: {
      data,
    },
  }
}

Links.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>
}

export default Links
