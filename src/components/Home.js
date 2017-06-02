import React, { Component } from 'react'
import { observer } from 'mobx-react'
import Login from './Login'
import Index from './Index'
import auth from '../utils/auth'

@observer
class Home extends Component {
  render () {
    return <div className='Home'>
      {
        auth.isSignedIn
          ? <Index />
          : <Login />
      }
    </div>
  }
}

export default Home
