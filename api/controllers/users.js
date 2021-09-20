const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/user")

exports.user_signup = async (req, res, next) => {
	try {
		const email = await User.find({email: req.body.email}).exec()
		if (email.length >= 1) {
			return res.status(409).json({message: "Email already exists"})
		}
		if (!req.body.password) {
			return res.status(400).json({message: "Password required"})
		}
		bcrypt.hash(req.body.password, 10, async (err, hash) => {
			if (err) {
				return res.status(500).json({
					error: err
				})
			} else {
				try {
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					})
					await user.save()
					console.log(user)
					res.status(201).json({
						message: "User created successfully"
					})
				} catch (err) {
					res.status(500).json({error: err})
				}		
			}
		})
	} catch (err) {
		res.status(500).json({error: err})
	}
}

exports.user_login = async (req, res, next) => {
	try {
		const user = await User.find({ email: req.body.email })
		if (user.length < 1) {
			return res.status(401).json({
				message: "Auth failed"
			})
		}
		bcrypt.compare(req.body.password, user[0].password, (err, result) => {
			if (err) {
				return res.status(401).json({
					message: "Auth failed"
				})
			}
			if (result) {
				const token = jwt.sign(
					{
						email: user[0].email,
						userId: user[0]._id
					},
					process.env.JWT_KEY,
					{
						expiresIn: "1h"
					}
				)
				return res.status(200).json({
					message: "Auth succeessful",
					token: token
				})
			}
			return res.status(401).json({
				message: "Auth failed" 
			})
		})
	} catch (err) {
		res.status(500).json({error: err})
	}
}

exports.user_delete = async (req, res, next) => {
	try {
		const user = await User.remove({_id: req.params.userId}).exec()
		if (user.deletedCount !== 0) {
			res.status(200).json({
				message: "User removed succesfully",
				deletedCount: user.deletedCount
			})
		} else {
			res.status(404).json({
				message: "User not found"
			})
		}
	} catch (err) {
		res.status(500).json({error: err})
	}
}