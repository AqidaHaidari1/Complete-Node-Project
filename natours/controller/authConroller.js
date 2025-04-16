import { catchAsync } from "../utils/catchAsync.js"
import User from "../models/userModel.js"

export const signUp = catchAsync(async(req, res, next) => {
    const newUser = await User.create(req.body)
    res.status(201).json({
        status: 'success',
        user: newUser
    })
    
})