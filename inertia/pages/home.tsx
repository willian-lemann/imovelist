import { Search } from '../components/search'
import { Listings } from '../components/listings'
import { Head } from '@inertiajs/react'

export default function Home({ listings, count }) {
  return (
    <div>
      <Head title="Listings" />

      <div className="flex flex-col md:flex-row">
        <div className="container p-0">
          <div className="py-4">{<Search />}</div>

          <div className="mt-0">
            <Listings listings={listings} count={count} />
          </div>
        </div>
      </div>
      {/* <LoginModal>
        <SignIn mobile={mobile} />
      </LoginModal> */}
    </div>
  )
}
