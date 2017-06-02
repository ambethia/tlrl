import React, { Component } from 'react'
import { Table, Button, Checkbox, Modal, Form, Input } from 'antd'
import api from '../utils/api'
import auth from '../utils/auth'
import moment from 'moment'

const PAGE_SIZE = 20

class Index extends Component {
  state = {
    data: [],
    pagination: {},
    modal: false,
    modalTitle: '',
    modalURL: '',
    loading: false
  }

  fetch () {
    this.setState({ loading: true })
    api(`
      query {
        getUser(id: "${auth.userId}") {
          items(first: 10) {
            edges {
              cursor
              node {
                id
                title
                url
                createdAt
                consumed
              }
            }
            aggregations {
              count
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
          }
        }
      }
    `).then(({ getUser }) => {
      const data = getUser.items.edges.map(e => e.node)
      this.setState({
        data,
        pagination: {
          total: data.length,
          pageSize: PAGE_SIZE
        },
        loading: false
      })
    })
  }

  componentDidMount () {
    this.fetch()
  }

  toggleView (value, id) {
    api(`
      mutation ($item: UpdateItemInput!) {
        updateItem(input: $item) {
          changedItem {
            id
          }
        }
      }
    `, {
      item: { id, consumed: !value }
    }).then(() => {
      this.fetch()
    })
  }

  get columns () {
    return [{
      title: 'Title',
      dataIndex: 'title',
      render: (text, { url }) => <a href={url}>{text}</a>
    }, {
      title: 'Age',
      dataIndex: 'createdAt',
      render: time => moment(time).fromNow()
    }, {
      title: 'Viewed',
      dataIndex: 'consumed',
      render: (val, { id }) => <Checkbox
        checked={val}
        onChange={() => this.toggleView(val, id)}
      />
    }]
  }

  _showModal = () => {
    this.setState({ modal: true })
  }

  _modalSubmit = () => {
    const title = this.state.modalTitle
    const url = this.state.modalURL
    if (title.length > 0 && url.length > 0) {
      api(`
        mutation ($item: CreateItemInput!) {
          createItem(input: $item) {
            changedItem {
              id
            }
          }
        }
      `, {
        item: { title, url, userId: auth.userId, consumed: false }
      }).then(() => {
        this._hideModal()
        this.fetch()
      })
    }
  }

  _hideModal = () => {
    this.setState({ modal: false, modalTitle: '', modalURL: '' })
  }

  render () {
    return <div className='Index'>
      <Table
        dataSource={this.state.data}
        pagination={this.state.pagination}
        rowKey='id'
        columns={this.columns}
        size='small'
        loading={this.state.loading}
      />
      <Button onClick={this._showModal}>Add</Button>
      <Modal
        title='Add an Item'
        visible={this.state.modal}
        onOk={this._modalSubmit}
        onCancel={this._hideModal}
      >
        <Form layout='vertical' ref={f => { this.form = f }}>
          <Form.Item label='Title'>
            <Input value={this.state.modalTitle} onChange={(e) => this.setState({ modalTitle: e.target.value })} />
          </Form.Item>
          <Form.Item label='URL'>
            <Input value={this.state.modalURL} onChange={(e) => this.setState({ modalURL: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  }
}

export default Index
