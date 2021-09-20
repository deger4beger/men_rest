const express = require("express")
const morgan = require("morgan")
const mongoose = require("mongoose")
const app = express()

// No deprecation
mongoose.set('useCreateIndex', true)

const productRoutes = require("./api/routes/products")
const orderRoutes = require("./api/routes/orders")
const userRoutes = require("./api/routes/users")

mongoose.connect("mongodb+srv://DBadmin:" + process.env.MONGO_ATLAS_PW +
 					"@cluster0.nxt6u.mongodb.net/" + process.env.MONGO_ATLAS_DBN +
 					"?retryWrites=true&w=majority", {useNewUrlParser: true,
 													 useUnifiedTopology: true })
mongoose.Promise = global.Promise

//Middlewares
app.use(morgan("dev"))
app.use("/uploads", express.static("uploads"))
// instead of body-parser
app.use(express.json())

// CORS
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header(
		"Access-Control-Allow-Headers",
		"Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"
	)
	if (req.method === "OPTIONS") {
		res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH")
		return res.status(200).json({})
	}
	next()
})

// Routes which should handle request
app.use("/products", productRoutes)
app.use("/orders", orderRoutes)
app.use("/user", userRoutes)


// Handling errors
app.use((req, res, next) => {
	const error = new Error("Not found")
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 505)
	res.json({
		error: {
			message: error.message
		}
	})
})

module.exports = app 