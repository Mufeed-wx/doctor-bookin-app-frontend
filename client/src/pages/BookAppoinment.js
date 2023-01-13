import React, { useEffect, useState } from 'react'
import DoctorForm from '../components/DoctorForm'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../redux/alertsReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import axios from 'axios'
import Layout from '../components/Layout'
import { setUser } from '../redux/userSlice'
import { Button, Col, DatePicker, Row, TimePicker } from 'antd'
import moment from 'moment'

function BookAppoinment() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [date, setDate] = useState()
  const [selectedTime, setSelectedTime] = useState()
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user)
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState()

  const getDoctor = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post('/api/doctor/get-doctor-info-by-id', {
        doctorId: params.doctorId
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
      dispatch(hideLoading())
      if (response.data.success) {
        setDoctor(response.data.data)
      }
    } catch (error) {
      dispatch(showLoading())
      console.log(error);
    }
  }

  const bookNow = async () => {
    try {
      console.log(params.doctorId,selectedTime);
      dispatch(showLoading())
      const response = await axios.post('/api/user/book-appointment', {
        doctorId: params.doctorId,
        userId: user._id,
        doctorInfo: doctor,
        userInfo:user,
        date: date,
        time: selectedTime

      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
      dispatch(hideLoading())
      if (response.data.success) {
        setIsAvailable(false)
        toast.success(response.data.message)
      }
    } catch (error) {
      dispatch(showLoading())
      toast.error('Somthing went wrong')
    }
  }

  const checkAvailabilty = async () => {
    try {
      console.log(params.doctorId,selectedTime);
      dispatch(showLoading())
      const response = await axios.post('/api/user/check-booking-availability', {
        doctorId: params.doctorId,
        date: date,
        time: selectedTime

      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
      dispatch(hideLoading())
      if (response.data.success) {
        setIsAvailable(true)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      dispatch(showLoading())
      toast.error('Somthing went wrong')
    }
  }
  useEffect(() => {
    getDoctor();
  }, [])
  return (
    <Layout>
      {doctor && (
        <div>
          <h1 className="page-title">
            {doctor.firstName} {doctor.lastName}
          </h1>
          <hr />
          <Row>
            <Col span={8} xs={12} sm={24} lg={8}>
            <h1 className='normal-text'><b>Timings: </b>{doctor.timings[0]}-{doctor.timings[1]}</h1>
          <div className="d-flex flex-column pt-2">
                <DatePicker format='DD-MM-YYYY' onChange={(values) => {
                  setIsAvailable(false)
                  setDate(moment(values).format("DD_MM_YYYY"));
            }} />
                <TimePicker use12Hours format="HH:mm" className='mt-3 ps-2'
                  onChange={(value) => {
                    setIsAvailable(false)
                    setSelectedTime(
                      value.format("HH:mm"));
                  }} 
                />
                <Button className="primary-button mt-3 full-width-button" onClick={checkAvailabilty}>Check Availability</Button>
               {isAvailable&&( <Button className="primary-button mt-3 full-width-button" onClick={bookNow}>Book Now</Button>)}
          </div>
            </Col>
          </Row>
        </div>
      )}
    </Layout>
  )
}

export default BookAppoinment