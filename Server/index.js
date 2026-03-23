import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { rateLimiter } from './middleware/rateLimit.js'
import paymentRoutes from './routes/payment.js'
import webhookRoutes from './routes/webhook.js'

dotenv.config()

const app = express()

// webhook must use raw body — before express.json()
app.use('/webhook', express.raw({ type: 'application/json' }), webhookRoutes)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(rateLimiter)

app.use('/payment', paymentRoutes)

app.get('/', (req, res) => res.send('Canteen Credits Server Running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))