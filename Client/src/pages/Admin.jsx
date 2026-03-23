import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'

export default function Admin({ session }) {
  const [transactions, setTransactions] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('transactions')

  useEffect(() => {
    fetchAll()
  }, [])

  async function fetchAll() {
    setLoading(true)

    const { data: txData } = await supabase
      .from('transactions')
      .select('*, profiles(name, email)')
      .order('created_at', { ascending: false })
      .limit(50)
    setTransactions(txData || [])

    const { data: studentData } = await supabase
      .from('profiles')
      .select('*, credits(balance)')
      .eq('role', 'student')
    setStudents(studentData || [])

    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const totalRevenue = transactions.reduce((sum, tx) => sum + tx.amount_paid, 0)
  const totalCredits = transactions.reduce((sum, tx) => sum + tx.credits_earned, 0)

  return (
    <div className="min-h-screen" style={{ background: '#FFF5F5' }}>

      {/* navbar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <div>
              <span className="font-bold text-lg" style={{ color: '#E23744' }}>Canteen Credits</span>
              <span className="ml-2 text-xs bg-red-100 text-red-500 font-semibold px-2 py-0.5 rounded-full">Admin</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-400 hover:text-red-500 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* greeting */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Panel 🛠️</h2>
          <p className="text-gray-400 text-sm mt-0.5">{session.user.email}</p>
        </div>

        {/* stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-red-50 text-center">
            <div className="text-2xl mb-1">💰</div>
            <p className="text-gray-400 text-xs font-medium">Revenue</p>
            <p className="text-gray-800 text-xl font-bold mt-0.5">₹{totalRevenue}</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-red-50 text-center">
            <div className="text-2xl mb-1">🪙</div>
            <p className="text-gray-400 text-xs font-medium">Credits Issued</p>
            <p className="text-xl font-bold mt-0.5" style={{ color: '#E23744' }}>{totalCredits}</p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-red-50 text-center">
            <div className="text-2xl mb-1">👨‍🎓</div>
            <p className="text-gray-400 text-xs font-medium">Students</p>
            <p className="text-gray-800 text-xl font-bold mt-0.5">{students.length}</p>
          </div>
        </div>

        {/* tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-red-50">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'transactions'
                ? 'text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={activeTab === 'transactions'
              ? { background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }
              : {}}
          >
            🧾 Transactions
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              activeTab === 'students'
                ? 'text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            style={activeTab === 'students'
              ? { background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }
              : {}}
          >
            👨‍🎓 Students
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-400">Loading data...</p>
          </div>
        ) : activeTab === 'transactions' ? (

          <div className="space-y-3">
            {transactions.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-red-50">
                <div className="text-4xl mb-3">🍽️</div>
                <p className="text-gray-400">No transactions yet</p>
              </div>
            )}
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-red-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: '#FFF5F5' }}>
                    🍜
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">
                      {tx.profiles?.name || tx.profiles?.email || 'Unknown'}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {new Date(tx.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-800 font-bold">₹{tx.amount_paid}</p>
                  <p className="text-xs font-semibold mt-0.5" style={{ color: '#E23744' }}>+{tx.credits_earned} pts</p>
                </div>
              </div>
            ))}
          </div>

        ) : (

          <div className="space-y-3">
            {students.length === 0 && (
              <div className="text-center py-12 bg-white rounded-3xl border border-red-50">
                <div className="text-4xl mb-3">👨‍🎓</div>
                <p className="text-gray-400">No students yet</p>
              </div>
            )}
            {students.map(s => (
              <div key={s.id} className="bg-white rounded-2xl px-4 py-4 shadow-sm border border-red-50 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }}>
                    {(s.name || s.email || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-800 font-semibold text-sm">{s.name || 'No name'}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{s.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold" style={{ color: '#E23744' }}>{s.credits?.[0]?.balance ?? 0}</p>
                  <p className="text-gray-400 text-xs">credits</p>
                </div>
              </div>
            ))}
          </div>

        )}

      </div>
    </div>
  )
}