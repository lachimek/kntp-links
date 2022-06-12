import { GetServerSideProps } from 'next'
import { getSession, signIn } from 'next-auth/react'
import { Page } from 'types/page'

const items = ['Youtube', 'Facebook', 'Twitch']

const Home: Page = () => {
  return (
    <div className="flex w-full justify-center px-8 pt-4">
      <div className="flex flex-col items-center">
        <div className="flex h-fit flex-col text-3xl font-extrabold leading-normal sm:flex-row sm:text-5xl sm:leading-normal md:text-6xl md:leading-normal">
          <span className="pb-4">Twój link do</span>
          <span className="relative ml-4 inline-flex overflow-y-hidden font-extrabold">
            <span className="select-none text-transparent" aria-hidden="true">
              Instagram
            </span>
            <span className="absolute top-0 left-0 animate-rotate-text text-center">
              {/* animate-rotate-text */}
              <span className="block text-[#FF0000]">YouTube</span>
              <span className="block text-blue-500">Facebook</span>
              <span className="h-fit bg-gradient-to-br from-[#405de6] via-[#833ab4] to-[#fd1d1d] bg-clip-text text-transparent">
                Instagram
              </span>
              <span className="block text-purple-500">Twitch</span>
              <span className="block text-black">GitHub</span>
              <span className="block text-[#1DA1F2]">Twitter</span>
              <span className="tiktok-drop-shadow block text-black">
                TikTok
              </span>
              <span className="block text-[#FF0000]">YouTube</span>
            </span>
          </span>
        </div>
        <div className="mt-8 flex w-full flex-col">
          <span className="text-center text-3xl font-extrabold sm:text-5xl">
            Wszystko w jednym miejscu.
          </span>
          <div className="mt-4 flex flex-col items-center text-3xl font-extrabold sm:text-5xl lg:flex-row">
            <span
              className="my-4 cursor-pointer rounded-md px-2 pb-2 transition-all before:content-['→'] after:content-['←'] hover:bg-white hover:text-black lg:before:content-none lg:after:content-none"
              onClick={() => signIn()}
            >
              Zaloguj się
            </span>{' '}
            <span className="pb-2 text-center">i utwórz swoją stronę.</span>
          </div>
        </div>
      </div>
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
