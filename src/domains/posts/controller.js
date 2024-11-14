require('dotenv').config()
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const Post = require('./model')
const User = require('../user/model')
const multer = require('multer')
const secret = process.env.JWT_SECRET

const upload = multer({
	dest: path.join(__dirname, '../../uploads/'),
	fileFilter: (req, file, cb) => {
		const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
		if (!allowedTypes.includes(file.mimetype)) {
			return cb(
				new Error(
					'Invalid file type, only JPG, JPEG, PNG, and GIF are allowed'
				),
				false
			)
		}
		cb(null, true)
	},
})

module.exports.create_post = [
	upload.single('img'),

	async (req, res) => {
		const { title, content, token } = req.body

		try {
			const decoded = jwt.verify(token, secret)
			const authorId = decoded.id
			const authorUser = await User.findById(authorId)

			if (!authorUser) {
				return res.status(400).json({ error: 'Author not found' })
			}

			let imgPath = null
			if (req.file) {
				const fileExtension = req.file.originalname.split('.').pop()
				console.log(fileExtension)

				const uniqueFilename = uuidv4() + '.' + fileExtension

				console.log(uniqueFilename)

				const newFilePath = path.join(
					__dirname,
					'../../uploads',
					uniqueFilename
				)

				fs.renameSync(req.file.path, newFilePath)
			}

			const post = await Post.create({
				title,
				content,
				img: uniqueFilename,
				author: authorUser._id,
			})

			res.status(200).json({ post })
		} catch (err) {
			res.status(400).json({ error: err.message })
		}
	},
]

module.exports.get_posts = async (req, res) => {
	try {
		const posts = await Post.find({})

		res.status(200).json({ posts })
	} catch (err) {
		res.status(400).json({ err })
	}
}

module.exports.get_post = async (req, res) => {
	const { id } = req.params

	try {
		const post = await Post.findById(id)

		if (!post) {
			return res.status(400).json({ error: 'post not found' })
		}

		res.status(200).json({ post })
	} catch (err) {
		res.status(400).json({ err })
	}
}

module.exports.view_post = async (req, res) => {
	const { id } = req.params

	try {
		const post = await Post.findById(id)

		if (!post) {
			return res.status(400).json({ error: 'post not found' })
		}

		post.views += 1
		await post.save()

		res.status(200).json({ post })
	} catch (err) {
		res.status(400).json({ err })
	}
}
