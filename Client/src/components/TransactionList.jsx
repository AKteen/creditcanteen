export default function TransactionList({ transactions }) {
  if (transactions.length === 0) return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-red-50 text-center">
      <div className="text-5xl mb-3">🍽️</div>
      <p className="text-gray-600 font-semibold">No transactions yet</p>
      <p className="text-gray-400 text-sm mt-1">Make your first payment to earn credits!</p>
    </div>
  )

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-50">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🧾</span>
        <h3 className="text-gray-800 font-bold text-lg">Recent Orders</h3>
      </div>

      <div className="space-y-3">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: '#FFF5F5' }}
              >
                🍜
              </div>
              <div>
                <p className="text-gray-800 font-semibold">₹{tx.amount_paid} paid</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {new Date(tx.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm" style={{ color: '#E23744' }}>+{tx.credits_earned} pts</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                tx.status === 'success'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-500'
              }`}>
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}