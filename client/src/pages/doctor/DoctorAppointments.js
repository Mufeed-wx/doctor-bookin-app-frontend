import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import Layout from '../../components/Layout'
import { hideLoading, showLoading } from '../../redux/alertsReducer'
import axios from 'axios'
import toast from "react-hot-toast"
import { Table } from 'antd'
import moment from 'moment'

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([])
    const dispatch = useDispatch();

    const getAppointments = (async () => {
        try {
            dispatch(showLoading())
            const response = await axios.get('/api/doctor/get-appointments-by-doctor-id',
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

    const changeAppointmentStatus = (async (record, status) => {
        try {
            dispatch(showLoading())
            const response = await axios.post('/api/doctor/change-appointment-status', {
                appointmentId: record._id,
                status: status,
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                })
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                getAppointments();
            }
        } catch (error) {
            toast.error('Error changing doctor account status')
            dispatch(hideLoading)
            console.log(error);
        }
    })
    const columns = [
        {
            title: 'Id',
            dataIndex: '_id',
        },
        {
            title: 'Patient',
            dataIndex: 'name',
            render: (text, record) => (
                <span className='normal-text'>
                    {record.userInfo.name}
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
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (text, record) => (
                <div className='d-flex'>
                    {record.status === 'pending' &&
                        <div>
                            <h1 className='anchor' onClick={() => changeAppointmentStatus(record, 'approved')}>Approve</h1>
                            <h1 className='anchor' onClick={() => changeAppointmentStatus(record, 'rejected')}>Reject</h1>
                        </div>
                    }
                </div>
            )
        }
    ]

 
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

export default DoctorAppointments