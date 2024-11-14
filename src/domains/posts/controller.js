require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const Post = require('./model')
const User = require('../user/model')
const multer = require('multer')
const secret = process.env.JWT_SECRET
const cloudinary = require('cloudinary').v2

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

const upload = multer({
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

			let imgUrl = null

			if (req.file) {
				const result = await new Promise((resolve, reject) => {
					const stream = cloudinary.uploader.upload_stream(
						{
							public_id: uuidv4(),
							folder: 'HandLand',
						},
						(error, result) => {
							if (error) {
								return reject(error) 
							}
							resolve(result) 
						}
					)
					stream.end(req.file.buffer) 
				})

				imgUrl = result.secure_url
			}

			// Створення поста
			const post = await Post.create({
				title,
				content,
				img: imgUrl, 
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
