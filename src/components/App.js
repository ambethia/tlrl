import React, { Component } from 'react'
import { Layout } from 'antd'
import Home from './Home'
import logo from '../images/tlrl.svg'
const { Header, Footer, Content } = Layout

class App extends Component {
  render () {
    return <Layout>
      <Header style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src={logo} alt='TL;RL Logo' height='42' />
      </Header>
      <Content style={{ display: 'flex' }} >
        <Home />
      </Content>
      <Footer style={{ textAlign: 'center' }}><strong>TL;RL</strong> &copy; 2017 Jason L Perry</Footer>
    </Layout>
  }
}

export default App
