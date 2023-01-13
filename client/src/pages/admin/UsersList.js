import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsReducer'
import axios from 'axios'
import { Table } from 'antd'

function UsersList() {
  const [users, SetUsers] = useState([])
  const dispatch = useDispatch();


  const getUserData = (async() => {
    try {
      dispatch(showLoading())
      const response =await axios.get('/api/admin/get-all-users',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        })
      dispatch(hideLoading())
      if (response.data.success) {
        SetUsers(response.data.data)
      }
    } catch (error) {
      dispatch(hideLoading)
      console.log(error);
    }
  })

  const columns = [
    {
    title: 'Name',
    dataIndex:'name',
    },
    {
      title: 'Email',
      dataIndex:'email',
    },
    {
      title: 'CreatedAt',
      dataIndex:'createdAt',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex'>
          <h1 className='anchor'>Block</h1>
        </div>
      )
    }
]

  useEffect(() => {
    getUserData();
  },[])
  return (
    <Layout>
      <h1 className='anchor'>Users List</h1>
      <Table columns={columns}  dataSource={users}/>
   </Layout>
  )
}

export default UsersList