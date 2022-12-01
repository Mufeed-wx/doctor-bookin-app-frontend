import React from 'react'
import '../index.css'
import { Form, Input, Button } from 'antd'
import { Link } from 'react-router-dom'

const Login = () => {

  const onFinish = (value)=> {
  console.log(value);
  }
  return (
      <div className='authentication'>
          <div className="authentication-form card p-3">
        <h1 className='card-title'>Welcome Back</h1>
        <Form layout='vertical' onFinish={onFinish}>
          <Form.Item label='Email' name='email' >
            <Input placeholder='Email'/>
          </Form.Item>
          <Form.Item label='Password' name='password' >
            <Input placeholder='Password' type='password'/>
          </Form.Item>
          <Button className='primary-button my-2' htmlType='submit'>Login</Button>
          <Link to='/register' className='anchor'>CLICK HERE TO REGISTER</Link>
        </Form>
          </div>
          
    </div>
  )
}

export default Login