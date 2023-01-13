import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout';
import { Col, Row } from 'antd';
import Doctor from '../components/Doctor';

function Home() {
  const [doctors,setDoctors] = useState([])
  const getData = async() => {
  try {
    const response = await axios.get('/api/user/get-all-approved-doctors',
      {
        headers: {
        Authorization:"Bearer " + localStorage.getItem("token")
      }
      })
    if (response.data.success) {
       setDoctors(response.data.data)
    }
  } catch (error) {
    console.log(error);
  }
  }

  useEffect(() => {
    getData();
  },[])
  return (
    <Layout>
      <Row gutter={20}>
        {doctors.map((doctor) => {
          return(<Col span={8} xs={24} sm={24} lg={8}>
            <Doctor doctor={ doctor} />
          </Col>)
        })}
    </Row>
   </Layout>
  )
}

export default Home