import { GetServerSideProps } from 'next'
import { getProviders, signIn } from 'next-auth/react'

export default function SignIn({ providers }: { providers: any[] }) {
  return (
    <div className="flex min-h-screen flex-col items-center bg-night text-white">
      <div className="mt-48 flex flex-col items-center rounded-lg border-2 border-white p-8">
        <h1 className="mb-8 text-2xl">Zaloguj się jednym z kont poniżej</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button
              className="rounded-md border-2 border-white px-4 py-2 text-center transition-colors hover:bg-white hover:text-black"
              onClick={() =>
                signIn(provider.id, { callbackUrl: window.location.origin })
              }
            >
              Zaloguj się kontem {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders()
  return {
    props: { providers },
  }
}
