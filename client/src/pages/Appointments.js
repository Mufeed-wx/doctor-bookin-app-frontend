import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../components/Layout'
import { hideLoading, showLoading } from '../redux/alertsReducer'
import axios from 'axios'
import toast from "react-hot-toast"
import { Table } from 'antd'
import moment from 'moment'

function Appointments() {
    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch();
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Doctor Name',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo.firstName} {record.doctorInfo.lastName}
                </span>
            )
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.doctorInfo.phoneNumber} 
                </span>
            )
        },
        {
            title: 'Date & Time',
            dataIndex: 'createdAt',
            render: (text, record) => (
                <span className='normal-text'>
                    {moment(record.date).format('DD-MM-YY')} {moment(record.time).format('HH:mm')}
                </span>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
        },
    ]

    const getAppointments = (async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/user/get-appointments-by-user-id',
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            dispatch(hideLoading())
            if (response.data.success) {
                setAppointments(response.data.data)
            }
        } catch (error) {
            dispatch(hideLoading)
            console.log(error);
        }
    })
    useEffect(() => {
        getAppointments();
    }, [])
    return (
        <Layout >
            <h1 className='anchor'>Appointments</h1>
            <Table columns={columns} dataSource={appointments} />
        </Layout>
    )
}

export default Appointments