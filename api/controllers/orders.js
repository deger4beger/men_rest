const Order = require("../models/order")
const Product = require("../models/product")
const mongoose = require("mongoose")

exports.orders_get_all = async (req, res, next) => {
	try {
		const docs = await Order
			.find()
			.select("product quantity _id")
			.populate("product", "name price")
			.exec()
		if (!docs) {
			return res.status(404).json({
				message: "Not found"
			})
		}
		res.status(200).json({
			count: docs.length,
			orders: docs
		})
	} catch (err) {
		res.status(500).json({error: err})
	}
}

exports.orders_create_order = async (req, res, next) => {
	try {
		const product = await Product.findById(req.body.productId).exec()
		const formedOrder = new Order({
			_id: mongoose.Types.ObjectId(),
			quantity: req.body.quantity,
			product: req.body.productId
		})
		const savedOrder = await formedOrder.save()
		res.status(201).json({
			message: "Created order succesfully",
			createdOrder: savedOrder
		})	

	} catch (err) {
		res.status(500).json({error: err})
	}
}

exports.orders_get_order = async (req, res, next) => {
	try {
		const order = await Order.findById(req.params.orderId).select("quantity _id product")
		if (!order) {
			return res.status(404).json({
				message: "Order not found"
			})
		}
		res.status(200).json({
			order: order
		})
	} catch (err) {
		res.status(500).json({error: err})
	}
	
}

exports.orders_delete_order = async (req, res, next) => {
	try {
		const order = await Order.remove({_id: req.params.orderId}).exec()
		if (order.deletedCount !== 0) {
			res.status(200).json({
				message: "Order removed succesfully",
				deletedCount: order.deletedCount
			})
		} else {
			res.status(404).json({
				message: "Order not found"
			})
		}
		
	} catch (err) {
		res.status(500).json({error: err})
	}
}