const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')
const Doctor = require('../models/doctor-model')
const doctorModel = require('../models/doctor-model');
const appointmentModel = require('../models/appointment-doctor');
const moment = require('moment')

router.post('/register', async (req, res) => {
    try {
        const userExist = await userModel.findOne({ email: req.body.email })
        if (userExist) {
            return res.status(200).send({ message: 'User already exist', success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password = hashPassword;
        const newuser = userModel(req.body);
        await newuser.save();
        res.status(200).send({ message: 'User created successfully', success: true })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'User creating user', success: false })
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(200).send({ message: 'User does not exist', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(200).send({ message: 'Password is incorrect', success: false })
        } else {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            })
            return res.status(200).send({ message: 'Login Successful', success: true, data: token })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: 'error Logg In', success: false, error })
    }
})

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.body.userId })
        user.password = ''
        if (!user) {
            return res.status(200).send({ message: "User does not exist", success: false })
        } else {
            return res.status(200).send({
                success: true, data: user
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error getting user info", success: false, error })
    }
})

router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
    try {
        const newDoctor = new Doctor({ ...req.body, status: "pending" })
        await newDoctor.save();
        const adminUser = await userModel.findOne({ isAdmin: true })
        const unseenNotification = adminUser.unseenNotification;
        unseenNotification.push({
            type: "new-doctor-request",
            message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + ' ' + newDoctor.lastName
            },
            onClick: "/doctors"
        })
        await userModel.findByIdAndUpdate(adminUser._id, { unseenNotification })
        res.status(200).send({
            success: true,
            message: "Doctor applied successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error occured applying doctor account', success: false })
    }
})

router.post('/mark-all-notification-as-seen', authMiddleware, async (req, res) => {
    try {
        try {
            const user = await userModel.findOne({ _id: req.body.userId })
            const unseenNotification = user.unseenNotification;
            const seenNotification = user.seenNotification;
            seenNotification.push(...unseenNotification);
            user.unseenNotification = [];
            user.seenNotification = seenNotification;
            const updateUser = await user.save();
            updateUser.password = null;
            res.status(200).send({
                success: true,
                message: "All notification mark as seen",
                data: updateUser
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Error occured mark seen notification', success: false })
        }
    } catch (error) {

    }
})

router.post('/delete-notification', authMiddleware, async (req, res) => {
    try {
        try {
            const user = await userModel.findOne({ _id: req.body.userId })
            user.seenNotification = [];
            const updateUser = await user.save();
            updateUser.password = null;
            res.status(200).send({
                success: true,
                message: "All notification mark as deleted",
                data: updateUser
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Error occured delete seen notification', success: false })
        }
    } catch (error) {

    }
})

router.get('/get-all-approved-doctors', authMiddleware, async (req, res) => {
    try {
        const doctor = await doctorModel.find({ status: "approved" })
        res.status(200).send({
            message: "Approved doctors data fetched successfully",
            success: true,
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error occured getting approved doctor list', success: false })
    }
})


router.post('/book-appointment', authMiddleware, async (req, res) => {
    try {
        req.body.status = 'pending';
        req.body.date = moment(req.body.date, 'DD-MM-YY').toISOString();
        req.body.time = moment(req.body.time, 'HH:mm').toISOString();
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save();
        const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
        user.unseenNotification.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onClick: '/doctor/doctor-appointments',
        })
        await user.save();
        res.status(200).send({
            message: 'Appointment booked successfully',
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error:booking appointment', success: false })
    }
})

router.post('/check-booking-availability', authMiddleware, async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YY").toISOString();
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString();
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hourse').toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await appointmentModel.find({
            doctorId,
            date,
            time: { $gte: fromTime, $lte: toTime },
        })
        if (appointments.length > 0) {
            return res.status(200).send({
                message: 'Appointment not available',
                success: false,
            })
        } else {
            res.status(200).send({
                message: 'Appointment available',
                success: true,
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error:booking appointment', success: false })
    }
})

router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ userId: req.body.userId })
        res.status(200).send({
            message: "Appointments fetched successfully",
            success: true,
            data: appointments,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error fetching appointments', success: false })
    }
})
module.exports = router