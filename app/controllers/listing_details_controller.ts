import Listing from '#models/listing'
import type { HttpContext } from '@adonisjs/core/http'
import { extractIdFromSlug } from '../../inertia/lib/utils.js'

export default class ListingDetailsController {
  constructor() {}

  async index(ctx: HttpContext) {
    const id = extractIdFromSlug(ctx.params.id)
    const listing = await Listing.findBy('id', id)

    if (!listing) {
      return ctx.response.notFound()
    }

    return ctx.inertia.render('listing-details', {
      listing: {
        ...listing.toJSON(),
        photos: JSON.parse(listing.photos),
      },
    })
  }
}
