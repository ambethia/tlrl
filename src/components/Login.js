import React from 'react'
import { Button } from 'antd'
import auth from '../utils/auth'

const Login = () => (
  <div className='Login'>
    <Button icon='user' onClick={() => auth.signIn()}>Sign In</Button>
  </div>
)

export default Login
