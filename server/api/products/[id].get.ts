export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid product ID'
    })
  }

  try {
    const response = await $fetch(`https://fakestoreapi.com/products/${id}`)
    return response
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: `Product with ID ${id} not found`
    })
  }
})
