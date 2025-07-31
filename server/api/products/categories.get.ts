export default defineEventHandler(async event => {
  try {
    const response = await $fetch<string[]>(
      'https://fakestoreapi.com/products/categories'
    )
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories from external API'
    })
  }
})
