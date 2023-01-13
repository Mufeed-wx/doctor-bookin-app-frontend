import React, { useEffect, useState } from 'react'
import DoctorForm from '../../components/DoctorForm'
import { useDispatch, useSelector } from 'react-redux'
import { showLoading, hideLoading } from '../../redux/alertsReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast';
import axios from 'axios'
import Layout from '../../components/Layout'
import { setUser } from '../../redux/userSlice'

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user)
  const params = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState([])

  const onFinish = async (value) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/doctor/update-doctor-profile', { ...value, userId: user._id },
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
      toast.error('Somthing went wrong-update-profile')
    }
  }

  const getDoctor = async () => {
    try {
      dispatch(showLoading())
      const response = await axios.post('/api/doctor/get-doctor-info-by-user-id', {
        userId:params.userId
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
  useEffect(() => {
    getDoctor();
  }, [])
  return (
    <div>  
      <Layout>
      <h1 className="page-title">Docter profile</h1>
        {doctor && <DoctorForm onFinish={onFinish} formData={doctor} />}
      </Layout>
    </div> 
  )
}

export default Profile