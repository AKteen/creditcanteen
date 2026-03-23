import express from 'express'
import crypto from 'crypto'
import dotenv from 'dotenv'
import supabaseAdmin from '../supabaseAdmin.js'

dotenv.config()

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    // step 1 — verify razorpay signature
    const signature = req.headers['x-razorpay-signature']
    const body = req.body // raw buffer because of express.raw() in index.js

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.warn('Invalid webhook signature — possible hack attempt')
      return res.status(400).json({ error: 'Invalid signature' })
    }

    // step 2 — parse the event
    const event = JSON.parse(body.toString())

    if (event.event !== 'payment.captured') {
      return res.status(200).json({ status: 'ignored' }) // we only care about successful payments
    }

    const payment = event.payload.payment.entity
    const amountPaid = payment.amount / 100  // convert paise to rupees
    const userId = payment.notes?.userId

    if (!userId) {
      return res.status(400).json({ error: 'No userId in payment notes' })
    }

    // step 3 — calculate credits
    const creditsEarned = Math.floor(amountPaid / 10)

    // step 4 — update credits in supabase
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('credits')
      .select('balance')
      .eq('user_id', userId)
      .single()

    if (fetchError) {
      console.error('Failed to fetch credits:', fetchError)
      return res.status(500).json({ error: 'DB fetch failed' })
    }

    const newBalance = existing.balance + creditsEarned

    const { error: updateError } = await supabaseAdmin
      .from('credits')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (updateError) {
      console.error('Failed to update credits:', updateError)
      return res.status(500).json({ error: 'DB update failed' })
    }

    // step 5 — log transaction
    await supabaseAdmin.from('transactions').insert({
      user_id: userId,
      amount_paid: amountPaid,
      credits_earned: creditsEarned,
      status: 'success',
    })

    console.log(`Credits updated for ${userId}: +${creditsEarned} credits`)
    res.status(200).json({ status: 'ok' })

  } catch (err) {
    console.error('Webhook error:', err)
    res.status(500).json({ error: 'Webhook processing failed' })
  }
})

export default router