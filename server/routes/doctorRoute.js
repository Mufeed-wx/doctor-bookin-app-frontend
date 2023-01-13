const express = require('express')
const router = express.Router();
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')
const doctorModel = require('../models/doctor-model')
const appointmentModel = require('../models/appointment-doctor');

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: 'Doctor info fetched sussessfully',
            data: doctor
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error getting doctor info by id", success: false, error })
    }
})

router.post('/update-doctor-profile', authMiddleware, async (req, res) => {
    try {
        const doctor = await doctorModel.findOneAndUpdate({userId:req.body.userId},req.body)
        res.status(200).send({
            success: true,
            message: 'Doctor profile updated',
            data: doctor
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error getting doctor info by id", success: false, error })
    }
})

router.post('/get-doctor-info-by-id', authMiddleware, async (req, res) => {
    try {
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId  })
        res.status(200).send({
            success: true,
            message: 'Doctor info fetched sussessfully',
            data: doctor
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error getting doctor info by id", success: false, error })
    }
})

router.get('/get-appointments-by-doctor-id', authMiddleware, async (req, res) => {
    try {
        const doctor =await doctorModel.findOne({userId:req.body.userId})
        const appointments = await appointmentModel.find({ doctorId: doctor._id})
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

router.post('/change-appointment-status', authMiddleware, async (req, res) => {
    try {
        const { appointmentId,status } = req.body;
        const appointment =await appointmentModel.findByIdAndUpdate(appointmentId, {
            status  
        })
        const user =await userModel.findOne({ _id:appointment.userId})
        const unseenNotification = user.unseenNotification;
        unseenNotification.push({
            type: "Appointment status change",
            message: `your appointment has been ${status}`,
            onClick: "/appointments"
        })
        await user.save();
        res.status(200).send({
            message: "Appointment status changed successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error:appointment status changing', success: false })
    }
})
module.exports = router