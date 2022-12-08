const express = require('express')
const bcrypt = require('bcrypt')
const { expressjwt } = require('express-jwt')
const jwt = require('jsonwebtoken')
const User = require('./user.model')
require('dotenv').config()


const validateJwt = expressjwt({ secret:process.env.SECRET_KEY, algorithms: ['HS256'] })
const singToken = _id => jwt.sign({ _id }, process.env.SECRET_KEY)

const findAndAssingUser = async (req, res, next) =>{
    try{
        const user = await User.findById(req.auth._id)
        if(!user){
            return res.status(401).end()
        }
        req.user = user
        next()
    } catch (e){
        next(e)
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssingUser)

const Auth = {
    login: async (req, res) =>{
        const { body } = req
        try{
            const user = await User.findOne({ email: body.email })
            if(!user){
                res.status(401).send('The email you entered isn’t connected to an account')
            } else{
                const isMatch = await bcrypt.compare(body.password, user.password)
                if(isMatch){
                    const signed = singToken(user._id)
                    res.status(200).send(signed)
                } else{
                    res.status(401).send('Incorrect password')
                }
            }
    
        } catch(e){
            res.send(e.message)
        }
    },
    register: async (req, res) =>{
        const { body } = req
    try{
        const isUser = await User.findOne({ email: body.email })
        if(isUser){
            res.status(401).send('User already exists')
        } else {
        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({ email:body.email,password:hashed,salt })

        const signed = singToken(user._id)
        res.send(signed)
        }
    } catch(err){
        res.status(500).send('Email is required to create an account')
    }
 },
}

module.exports = { Auth, isAuthenticated }