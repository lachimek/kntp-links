import { NavbarLayout } from '../components/NavbarLayout'
import { Page } from '../types/page'

const Home: Page = () => {
  return (
    <div className="flex w-full justify-between px-8 pt-4">
      <span>Strona domowa</span>
    </div>
  )
}

Home.getLayout = function getLayout(page) {
  return <NavbarLayout>{page}</NavbarLayout>
}

export default Home
