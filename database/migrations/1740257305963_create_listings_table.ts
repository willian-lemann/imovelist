import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'listings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamp('created_at').defaultTo(this.now())
      table.timestamp('updated_at').defaultTo(this.now())

      table.string('name')
      table.string('link')
      table.string('image')
      table.string('address')
      table.string('price')
      table.string('area')
      table.integer('bedrooms')
      table.string('type')
      table.boolean('forSale')
      table.integer('parking')
      table.text('content')
      table.json('photos')
      table.string('agency')
      table.integer('bathrooms')
      table.string('ref')
      table.string('placeholderImage')
      table.integer('agent_id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
