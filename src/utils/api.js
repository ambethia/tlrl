import auth from './auth'
const API_URL = 'https://us-west-2.api.scaphold.io/graphql/tlrl'

const api = (query, variables) => (
  new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json' }
    if (auth && auth.isSignedIn) {
      headers['Authorization'] = `Bearer ${auth.token}`
    }
    window.fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    }).then(r => r.json()).then(({ errors, data }) => {
      if (errors) {
        errors.forEach(({ name, message }) => {
          console.error(`${name}:`, message)
        })
        reject(errors)
      } else {
        resolve(data)
      }
    })
  })
)

window.api = api
export default api
