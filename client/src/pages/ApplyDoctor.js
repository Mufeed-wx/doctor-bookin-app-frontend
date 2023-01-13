import React, { useState } from 'react'
import Layout from '../components/Layout'
import { Form, Input, Button, Row, Col, TimePicker } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsReducer'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import axios from 'axios'
import DoctorForm from '../components/DoctorForm'

function ApplyDoctor() {
  const dispatch = useDispatch();
  const [selectedTime, setSelectedTime] = useState()
  console.log(selectedTime,'sdadsd');
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate();
  const onFinish = async (value) => {
    try {
      value.timings = selectedTime;
      console.log(value,'sfd')
      console.log(value);
      dispatch(showLoading());
      const response = await axios.post('/api/user/apply-doctor-account', { ...value, userID: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
      dispatch(hideLoading())
      if (response.data.success) {
        toast.success(response.data.message)
        navigate('/')
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      dispatch(hideLoading())
      toast.error('Somthing went wrong')
    }
  }
  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} setSelectedTime={ setSelectedTime} />
    </Layout>
  )
}

export default ApplyDoctor