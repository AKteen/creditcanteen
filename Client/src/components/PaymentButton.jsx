import { useState } from 'react'
import axios from 'axios'

export default function PaymentButton({ session, onSuccess }) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePayment() {
    setError('')
    const amt = parseInt(amount)

    if (!amt || amt < 1 || amt > 300) {
      setError('Enter amount between ₹1 and ₹300')
      return
    }

    setLoading(true)

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/payment/create-order`, {
        amount: amt,
        userId: session.user.id,
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'Canteen Credits',
        description: `₹${amt} → ${Math.floor(amt / 10)} credits`,
        order_id: data.orderId,
        handler: function () {
          onSuccess()
        },
        prefill: { email: session.user.email },
        theme: { color: '#E23744' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()

    } catch (err) {
      setError('Payment failed, try again.')
      console.error(err)
    }

    setLoading(false)
  }

  const creditsPreview = amount && parseInt(amount) > 0 ? Math.floor(parseInt(amount) / 10) : 0

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">💳</span>
        <h3 className="text-gray-800 font-bold text-lg">Pay & Earn</h3>
      </div>

      {/* amount input */}
      <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-red-400 transition">
        <span className="text-gray-400 font-semibold mr-2 text-lg">₹</span>
        <input
          type="number"
          placeholder="Enter bill amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="bg-transparent text-gray-800 flex-1 focus:outline-none font-medium text-lg"
          min={1}
          max={300}
        />
      </div>

      {/* credits preview */}
      {creditsPreview > 0 && (
        <div className="mt-3 flex items-center gap-2 bg-orange-50 rounded-2xl px-4 py-3">
          <span>🎉</span>
          <p className="text-sm font-medium" style={{ color: '#E23744' }}>
            You will earn <span className="font-bold text-base">{creditsPreview} credits</span> on this payment!
          </p>
        </div>
      )}

      {/* max amount note */}
      <p className="text-gray-400 text-xs mt-2 ml-1">Max payment: ₹300 per transaction</p>

      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full text-white font-semibold py-4 rounded-3xl mt-4 transition disabled:opacity-50 text-lg active:scale-95"
        style={{ background: loading ? '#ccc' : '#E23744' }}
      >
        {loading ? '⏳ Opening Payment...' : '🚀 Pay Now'}
      </button>
    </div>
  )
}