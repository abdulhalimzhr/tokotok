export default defineEventHandler(async event => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and password are required'
    })
  }

  try {
    const response = await $fetch('https://fakestoreapi.com/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: body.username,
        password: body.password
      })
    })

    return response
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }
})
