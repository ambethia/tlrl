import Auth0Lock from 'auth0-lock'
import IdTokenVerifier from 'idtoken-verifier'
import { action, observable, autorun, computed } from 'mobx'
import api from './api'

const CLIENT_ID = 'X6KU1tZsALz6ddhxUiqCrIf5BKPR4TFL'
const CLIENT_DOMAIN = 'tlrl.auth0.com'

class Auth {
  @observable token
  @observable profile
  @observable userId

  constructor () {
    this.token = window.localStorage.getItem('auth:token')
    this.userId = window.localStorage.getItem('auth:userId')
    this.profile = JSON.parse(window.localStorage.getItem('auth:profile'))
    this.lock = new Auth0Lock(CLIENT_ID, CLIENT_DOMAIN)
    this.lock.on('authenticated', ({ idToken }) => {
      this.token = idToken
      this.lock.getProfile(idToken, (error, profile) => {
        if (error) {
          this.lock.show({
            flashMessage: {
              type: 'error',
              text: error.error_description
            }
          })
        }
        this.profile = profile
      })
    })

    autorun(() => {
      this.checkExpiration()
      if (this.token && !this.clientId) this.apiSignIn()
      if (this.isSignedIn) {
        window.localStorage.setItem('auth:token', this.token)
        window.localStorage.setItem('auth:userId', this.userId)
        window.localStorage.setItem('auth:profile', JSON.stringify(this.profile))
      } else {
        window.localStorage.removeItem('auth:token')
        window.localStorage.removeItem('auth:userId')
        window.localStorage.removeItem('auth:profile')
      }
    })
  }

  @action apiSignIn () {
    api(`
      mutation {
        loginUserWithAuth0(input: { idToken: "${this.token}" }) {
          user {
            id
            username
            createdAt
          }
        }
      }
    `).then(({ loginUserWithAuth0 }) => {
      this.userId = loginUserWithAuth0.user.id
    })
  }

  @action checkExpiration () {
    if (this.token) {
      const jwt = new IdTokenVerifier().decode(this.token)
      const now = new Date()
      const exp = new Date(0)
      exp.setUTCSeconds(jwt.payload.exp)
      if (now > exp) {
        this.signOut()
        return false
      }
      return true
    }
  }

  signIn () {
    this.lock.show()
  }

  @action signOut () {
    this.token = null
    this.userId = null
  }

  @computed get isSignedIn () {
    return this.token && this.profile && this.userId
  }
}

const auth = new Auth()
window.auth = auth
export default auth
