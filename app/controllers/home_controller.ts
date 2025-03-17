import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'

export default class ListingsController {
  constructor() {}

  async index(ctx: HttpContext) {
    const { search } = ctx.request.parsedUrl

    const query = new URLSearchParams(search!).get('q')
    const modality = new URLSearchParams(search!).get('filter')
    const typeOfApartment = new URLSearchParams(search!).get('type')

    const page = ctx.request.input('page', 1)
    const limit = 10

    const listings = Listing.query()

    if (query) {
      listings.where('address', 'LIKE', `%${query}%`) // Replace 'title' with your search column
    }

    if (modality) {
      listings.where('forSale', modality !== 'aluguel')
    }

    if (typeOfApartment) {
      listings.where('type', typeOfApartment)
    }

    const data = await listings.paginate(page, limit)

    return ctx.inertia.render('home', {
      listings: data.all().map((listing) => {
        return {
          ...listing.toJSON(),
          photos: JSON.parse(listing.photos),
        }
      }),
      count: data.getMeta().total,
      lastPage: data.getMeta().lastPage,
      currentPage: data.getMeta().currentPage,
    })
  }
}
