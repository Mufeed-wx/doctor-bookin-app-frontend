import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setUser } from '../redux/userSlice';
import { createStore } from 'redux'

import './Layout.css'
import { Badge } from 'antd'
function Layout({ children }) {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.user)
    console.log(user,'sdafs');
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false)
    const userMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Appointments',
            path: '/appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Apply Doctor',
            path: '/apply-doctor',
            icon: 'ri-hospital-line'
        },
        {
            name: 'Profile',
            path: '/profile',
            icon: 'ri-user-line'
        },

    ]

    const adminMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Users',
            path: '/Users',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Doctors',
            path: '/doctors',
            icon: 'ri-user-star-fill'
        },
        {
            name: 'Profile',
            path: '/admin-profile',
            icon: 'ri-user-line'
        },

    ]
    const doctorMenu = [
        {
            name: 'Home',
            path: '/',
            icon: 'ri-home-line'
        },
        {
            name: 'Appointments',
            path: '/doctor-appointments',
            icon: 'ri-file-list-line'
        },
        {
            name: 'Profile',
            path: `/doctors/profile/${user?._id}`,
            icon: 'ri-user-line'
        },

    ]


    const menuToBeRendered = user?.isAdmin ? adminMenu : user?.isDoctor ? doctorMenu : userMenu
    const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User"
    
    return (
        <div className='main'>
            <div className="d-flex layout">
                <div className='sidebar'>
                    <div className="sidebar-header">
                        <h1 className='logo'>SH</h1>
                        <h1 className='role'>{ role}</h1>
                    </div>
                    <div className="menu">
                        {menuToBeRendered.map((item) => {
                            const isActive = location.pathname === item.path
                            return <div className={`d-flex menu-item ${isActive && 'active-menu-item'}`} >
                                <i class={item.icon}></i>
                                {!collapsed && <Link to={item.path}>{item.name}</Link>}
                            </div>
                        })}
                        <div className={`d-flex menu-item`} onClick={() => {
                            localStorage.clear()
                           dispatch(setUser(null))
                            navigate('/login')
                        }} >
                            <i class='ri-logout-box-r-line'></i>
                            {!collapsed && <Link to='/login'>Logout</Link>}
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="header">
                        {collapsed ? <i className="ri-menu-2-line header-action-icon" onClick={() => setCollapsed(false)}></i> : <i className="ri-close-line header-action-icon" onClick={() => setCollapsed(true)}></i>}
                        <div className='d-flex align-items-center px-3'>
                            <Badge count={user?.unseenNotification.length} onClick={()=>navigate('/notification')}>
                            <i className="ri-notification-line header-action-icon"></i>
                            </Badge>
                            <Link className='mx-3' to={"/profile"}>{user?.name}</Link>
                        </div>
                    </div>
                    <div className="body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout