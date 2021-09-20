const express = require("express")
const router = express.Router()

const UserController = require("../controllers/users")
const User = require("../models/user")
const checkAuth = require("../middleware/checkAuth")


router.post("/signup", UserController.user_signup)

router.post("/login", UserController.user_login)

router.delete("/:userId", checkAuth, UserController.user_delete)	


// ONLY FOR DEVELOPMENT

router.get("/", async (req, res, next) => {
	const docs = await User.find().exec()
	res.status(200).json({
		users: docs
	})
})



module.exports = router