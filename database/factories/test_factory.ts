import factory from '@adonisjs/lucid/factories'
import Test from '#models/test'

export const TestFactory = factory
  .define(Test, async ({ faker }) => {
    return {}
  })
  .build()
