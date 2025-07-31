export default defineEventHandler(async event => {
  const category = getRouterParam(event, 'category')

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category parameter is required'
    })
  }

  try {
    // Decode URL-encoded category name
    const decodedCategory = decodeURIComponent(category)
    const response = await $fetch(
      `https://fakestoreapi.com/products/category/${decodedCategory}`
    )
    return response
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: `Products in category "${category}" not found`
    })
  }
})
