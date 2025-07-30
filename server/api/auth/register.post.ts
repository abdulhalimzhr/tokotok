export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.email || !body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email, username, and password are required'
    })
  }

  try {
    const response = await $fetch('https://fakestoreapi.com/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Registration failed'
    })
  }
})
