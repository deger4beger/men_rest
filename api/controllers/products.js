const Product = require("../models/product")
const mongoose = require("mongoose")

exports.product_get_all = (req, res, next) => {
	Product.find()
		.select("_id name price productImage")
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				products: docs
			})		
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

exports.products_create_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	})
	product
		.save()
		.then(result => {
			res.status(201).json({
				message: "Created product succesfully",
				createdProduct: {
					_id: result._id,
					name: result.name,
					price: result.price,
					productImage: result.productImage
				}
			})
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

exports.products_get_product = (req, res, next) => {
	const id = req.params.productId
	Product.findById(id)
		.select("name price _id productImage")
		.exec()
		.then(doc => {
			if (!doc) {
				res.status(404).json({
					message: "Product not found"
				})
			}
			if (doc) {
				res.status(200).json(doc)
			}	
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

exports.products_patch_product = (req, res, next) => {
	const id = req.params.productId
	const updateOps = {}
	for (const ops of req.body) {
		updateOps[ops.propName] = ops.value
	}
	Product.update({_id: id}, {$set: updateOps})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Product successfully updated"
			})		
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}

exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId
	Product.remove({_id: id})
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Product successfully deleted"
			})		
		})
		.catch(err => {
			res.status(500).json({error: err})
		})
}