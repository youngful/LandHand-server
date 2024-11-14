require('dotenv').config()
const User = require('./model')
const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET

module.exports.signup_post = async (req, res) => {
	const { firstName, lastName, email, password } = req.body

	try {
		const user = await User.create({
			firstName,
			lastName,
			email,
			password,
		})

		return res.status(200).json({ message: 'signed up' })
	} catch (err) {
		return res.status(400).json({ error: err.message })
	}
}

module.exports.login_post = async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await User.login(email, password)
		const token = createToken(user._id)

		res.status(200).json({ token })
	} catch (err) {
		res.status(400).json({ errors })
	}
}

module.exports.logout_get = (req, res) => {
	res.cookie('jwt', '', {
		secure: true,
		httpOnly: true,
		sameSite: 'None',
		maxAge: 1,
	})
	res.status(200).json({ message: 'logout' })
}

const createToken = id => {
	const payload = { id }
	return jwt.sign(payload, secret, { expiresIn: '1h' })
}
