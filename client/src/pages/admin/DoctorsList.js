import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsReducer'
import axios from 'axios'
import toast from "react-hot-toast"
import { Table } from 'antd'

function DoctorsList() {
    const [doctors, setDoctors] = useState([])
    const dispatch = useDispatch();


    const getdoctorData = (async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/admin/get-all-doctors',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            dispatch(hideLoading())
            if (response.data.success) {
                setDoctors(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading)
            console.log(error);
        }
    })
    const changeDocterStatus = (async (record,status) => {
        try {     
            dispatch(showLoading())
            const response = await axios.post('/api/admin/change-doctor-status', {
                doctorId: record._id,
                user_Id: record.userId, 
                status:status,
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                getdoctorData();
            }
        } catch (error) {
            toast.error('Error changing doctor account status')
            dispatch(hideLoading)
            console.log(error);
        }
    })


    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.firstName} {record.lastName}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' && <h1 className='anchor' onClick={()=>changeDocterStatus(record,'approved')}>Approve</h1>}
                    {record.status === 'approved' && <h1 className='anchor' onClick={() => changeDocterStatus(record, 'blocked')}>Block</h1>}
                    {record.status === 'blocked' && <h1 className='anchor' onClick={()=>changeDocterStatus(record,'approved')}>Active</h1>}
                </div>
            )
        }
    ]


    useEffect(() => {
        getdoctorData();
    }, [])
    return (
        <Layout >
            <h1 className='anchor'>Doctor List</h1>
            <Table columns={columns} dataSource={doctors} />
        </Layout>
    )
}

export default DoctorsList