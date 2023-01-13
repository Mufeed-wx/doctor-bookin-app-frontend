import React, { useState } from 'react'
import { Form, Input, Button, Row, Col, TimePicker } from 'antd'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

function DoctorForm({ onFinish, setSelectedTime }) {
    return (
        <>
            <Form layout='vertical' onFinish={onFinish} >
                <h1 className="card-title">Personal Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="First Name" name='firstName' rules={[{ required: true }]}>
                            <Input placeholder='First Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Last Name" name='lastName' rules={[{ required: true }]}>
                            <Input placeholder='Last Name' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Phone Number" name='phoneNumber' rules={[{ required: true }]}>
                            <Input placeholder='Phoen Number' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Website" name='webSite' rules={[{ required: true }]}>
                            <Input placeholder='Website' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Address" name='address' rules={[{ required: true }]}>
                            <Input placeholder='Address' />
                        </Form.Item>
                    </Col>
                </Row>
                <hr />
                <h1 className="card-title">Professional Information</h1>
                <Row gutter={20}>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Specialization" name='specialization' rules={[{ required: true }]}>
                            <Input placeholder='Specialization' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Experience" name='experience' rules={[{ required: true }]}>
                            <Input placeholder='Experience' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Fee per consultation" name='feePerConsultation' rules={[{ required: true }]}>
                            <Input placeholder='Fee per consultation' />
                        </Form.Item>
                    </Col>
                    <Col span={8} xs={24} sm={24} lg={8}>
                        <Form.Item required label="Timings" name='timings' rules={[{ required: true }]}>
                            <TimePicker.RangePicker status='error' use12Hours format="HH:mm"
                                onChange={(value) => {
                                    setSelectedTime([
                                        value[0].format("HH:mm"),
                                        value[1].format("HH:mm")
                                    ]);
                                }}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end">
                    <Button className='submit-button' htmlType='submit'>SUBMIT</Button>
                </div>
            </Form>
        </>
    )
}

export default DoctorForm