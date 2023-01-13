import React, { useLayoutEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Tabs } from 'antd'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/alertsReducer'
import toast from "react-hot-toast"
import axios from 'axios';
import { setUser } from '../redux/userSlice';

function Notification() {
    const { user } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const markAllAsSeen = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/mark-all-notification-as-seen', { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data))
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Somthing went wrong')
        }
    }
    const deleteAllAsSeen = async () => {
        try {
            dispatch(showLoading());
            const response = await axios.post('/api/user/delete-notification', { userId: user._id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    }
                });
            dispatch(hideLoading())
            if (response.data.success) {
                toast.success(response.data.message)
                dispatch(setUser(response.data.data))
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            dispatch(hideLoading())
            toast.error('Somthing went wrong')
        }
    }
    console.log(user, 'sad');
    return (
        <Layout>
            <h1 className='page-title'>Notification</h1>
            <Tabs>
                <Tabs.TabPane tab='unseen' key={0}>
                    <div className="d-flex justify-content-end">
                        <h1 className="anchor" onClick={() => markAllAsSeen()}>Mark alla as seen </h1>
                    </div>
                    {user?.unseenNotification.map((notification) => {
                        return (
                            <div className="card p-2" onClick={() => navigate(notification.onClick)}>
                                <div className="card-text">
                                    {notification.message}
                                </div>
                            </div>
                        )
                    })}
                </Tabs.TabPane>
                <Tabs.TabPane tab='seen' key={1}>
                    <div className="d-flex justify-content-end" onClick={() => deleteAllAsSeen()}>
                        <h1 className="anchor">Delete all</h1>
                    </div>
                    {user?.seenNotification.map((notification) => {
                        return (
                            <div className="card p-2" onClick={() => navigate(notification.onClick)}>
                                <div className="card-text">
                                    {notification.message}
                                </div>
                            </div>
                        )
                    })}
                </Tabs.TabPane>
            </Tabs>
        </Layout>
    )
}

export default Notification