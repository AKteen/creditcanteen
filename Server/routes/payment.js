import express from 'express'
import Razorpay from 'razorpay'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

router.post('/create-order', async (req, res) => {
  try {
    const { amount, userId } = req.body

    // validate amount
    if (!amount || amount < 1 || amount > 300) {
      return res.status(400).json({ error: 'Amount must be between ₹1 and ₹300' })
    }

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' })
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // razorpay works in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now().toString().slice(-10)}`,
      notes: { userId }, // stored in razorpay, passed back in webhook
    })

    res.json({ orderId: order.id, amount: order.amount })

  } catch (err) {
  console.error('Order creation failed FULL ERROR:', JSON.stringify(err, null, 2))
  res.status(500).json({ error: 'Failed to create order', details: err.message })
}
})

export default router