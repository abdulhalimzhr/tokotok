export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch<any[]>('https://fakestoreapi.com/products')
    return response
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch products from external API'
    })
  }
})
