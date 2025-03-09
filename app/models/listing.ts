import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Listing extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare link: string

  @column()
  declare image: string

  @column()
  declare address: string

  @column()
  declare price: string

  @column()
  declare area: string

  @column()
  declare bedrooms: number

  @column()
  declare bathrooms: number

  @column()
  declare type: string

  @column({ columnName: 'forSale' })
  declare for_sale: boolean

  @column()
  declare parking: number

  @column()
  declare content: string

  @column()
  declare photos: string // Assuming photos will be stored as a JSON string

  @column()
  declare agency: string

  @column()
  declare placeholderImage: string

  @column()
  declare ref: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
