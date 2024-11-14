require('./config/db')
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const routes = require('./routes')
const path = require('path');

const port = process.env.PORT || 3001

const app = express()
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Credentials', 'true')
	next()
})

const allowedOrigins = [
  'http://localhost:5173',          
  'https://land-hand-client.vercel.app', 
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


app.use(cookieParser())
app.use(express.json())
app.use(routes)

app.get('/', (req, res) => {
  res.send('Hello World');
});


const startServer = () => {
	app.listen(port, () => {
		console.log(`Server is running on port ${port}`)
	})
}

startServer()

module.exports = app
