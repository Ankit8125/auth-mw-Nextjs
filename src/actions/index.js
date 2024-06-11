'use server'

import connectToDB from "@/database"
import User from "@/models"
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers"

export async function registerUserAction(formData) {
    await connectToDB()
    try {

        const { userName, email, password } = formData
        const checkUser = await User.findOne({ email })
        if (checkUser) {
            return {
                success: false,
                message: 'User already exists! Please try with different email'
            }
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newlyCreatedUser = new User({
            userName, 
            email, 
            password : hashedPassword
        })

        const savedUser = await newlyCreatedUser.save()

        if (savedUser) {
            return {
                success: true,
                data: JSON.parse(JSON.stringify(savedUser))
            }
        }
        else {
            return {
                success: false,
                message: 'Something went wrong! Please try again'
            }
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something error occured'
        }
    }
}

export async function loginUserAction(formData) {
    await connectToDB()

    try {
        const { email, password } = formData

        // check if user exists in DB
        const checkUser = await User.findOne({ email })

        if (!checkUser) {
            return {
                success: false,
                message: 'User does not exist! Please sign up'
            }
        }

        // check if password is valid or not
        const checkPassword = await bcryptjs.compare(password, checkUser.password) // comparing passwords from database and user input
        if(!checkPassword){
            return {
                success: false, 
                message: 'Password is incorrect! Please check'
            }
        }

        // if password is valid, then we create a token
        const createdTokenData = {
            id: checkUser._id,
            userName: checkUser.userName,
            email: checkUser.email
        } 

        const token = jwt.sign(createdTokenData, "DEFAULT_KEY", {expiresIn: '1d'}) // default key is a unique identifier and a secret key for the token. Here we are keeping it default but in real life you must keep it in .env file
        // now we need to store this token

        const getCookies = cookies() // this is just like a local storage or session storage
        getCookies.set('token', token) // key_name : value

        return {
            success: true,
            message: 'Login is successfull'
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong! Please try again'
        }
    }
} 

export async function fetchAuthUserAction(formData){
    await connectToDB()
    try {
        const getCookies = cookies()
        const token = getCookies.get('token')?.value || '' // passing key_name
        
        if(token === ''){
            return {
                success: false,
                message: 'Token is invalid'
            }
        }

        const decodedToken = jwt.verify(token, 'DEFAULT_KEY') // also decoding it using secret key i.e. DEFAULT_KEY
        const getUserInfo = await User.findOne({ _id: decodedToken.id})

        if(getUserInfo){
            return{
                success: true,
                data: JSON.parse(JSON.stringify(getUserInfo))
            }
        }
        else{
            return {
                success: false,
                message: 'Something error occured! Please try again'
            }
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Something went wrong! Please try again'
        }
    }
}

export async function logoutAction(){
    const getCookies = cookies() // emptying our cookies
    getCookies.set('token', '')
}