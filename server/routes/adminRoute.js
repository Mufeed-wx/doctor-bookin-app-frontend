const express = require('express')
const router = express.Router();
const userModel = require('../models/user-model')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/authMiddleware')
const doctorModel = require('../models/doctor-model')

router.get('/get-all-users', authMiddleware, async (req, res) => {
    try {
        try {
            const user = await userModel.find({})
            res.status(200).send({
                message: "Users fetched successfully",
                success: true,
                data: user,
            })
        } catch (error) {
            console.log(error);
            res.status(500).send({ message: 'Error occured getting userlist', success: false })
        }
    } catch (error) {

    }
})

router.get('/get-all-doctors', authMiddleware, async (req, res) => {
    try {
        const doctor = await doctorModel.find({})
        res.status(200).send({
            message: "Users fetched successfully",
            success: true,
            data: doctor,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error occured getting doctor list', success: false })
    }
})

router.post('/change-doctor-status', authMiddleware, async (req, res) => {
    try {
        const { doctorId,user_Id,status } = req.body;
        const doctor = await doctorModel.findByIdAndUpdate(doctorId, {
            status
        })
        const user =await userModel.findOne({ _id:user_Id})
        const unseenNotification = user.unseenNotification;
        unseenNotification.push({
            type: "new-doctor-request-changed",
            message: `your doctor account has been ${status}`,
            onClick: "/notification"
        })
        await userModel.findByIdAndUpdate(user._id, { unseenNotification,isDoctor:true })
        res.status(200).send({
            message: "Doctor status updated successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Error:Doctor status changing', success: false })
    }
})


module.exports = router