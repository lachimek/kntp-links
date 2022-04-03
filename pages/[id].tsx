import { GetServerSideProps, GetStaticProps, NextPage } from 'next'
import { GetStaticPaths } from 'next'
import Image from 'next/image'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import prisma from '../db'
import { GuestLayout } from '../components/GuestLayout'
import Modal from '../components/Modal'
import { Page } from '../types/page'
import TrackedLink from '../components/TrackedLink'

interface Link {
  id: number
  content: string
  href: string
  explicit: boolean
}

interface Props {
  data: {
    id: string
    profilePictureLink: string
    userName: string
    description: string
    links: Link[]
  }
}

const Links: Page<Props> = ({ data }) => {
  const [open, setOpen] = useState(false)
  const [explicitLinkData, setExplicitLinkData] = useState({
    href: '',
    linkId: 0,
  })

  return (
    <div
      className="flex w-full flex-col items-center"
      onClick={() => open && setOpen(false)}
    >
      <div className="mt-8 flex flex-col items-center">
        <Image
          src={data.profilePictureLink}
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
                <div
                  className="cursor-pointer px-8 py-4 transition-colors hover:bg-white hover:text-black"
                  onClick={() => {
                    setOpen(true)
                    setExplicitLinkData({ href: link.href, linkId: link.id })
                  }}
                >
                  {link.content}
                </div>
              ) : (
                <TrackedLink href={link.href} linkId={link.id} uid={data.id}>
                  <div className="cursor-pointer px-8 py-4 transition-colors hover:bg-white hover:text-black">
                    {link.content}
                  </div>
                </TrackedLink>
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
          <TrackedLink
            href={explicitLinkData.href}
            linkId={explicitLinkData.linkId}
            uid={data.id}
            setIsOpen={setOpen}
            className="mt-8 rounded-md border-2 border-black px-8 py-3 text-center transition-colors hover:bg-black hover:text-white"
          >
            Przejdź
          </TrackedLink>
        </div>
      </Modal>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageName = context.params!.id as string
  const data = await prisma.page.findFirst({
    where: {
      pageName: pageName,
    },
    include: {
      links: true,
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
      data,
    },
  }
}

Links.getLayout = function getLayout(page) {
  return <GuestLayout>{page}</GuestLayout>
}

export default Links
