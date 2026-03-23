import { useState } from 'react'
import supabase from '../lib/supabase'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignup, setIsSignup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    async function handleSubmit() {
        setLoading(true)
        setError('')
        setMessage('')

        if (isSignup) {
            const { error } = await supabase.auth.signUp({ email, password })
            if (error) setError(error.message)
            else setMessage('Check your email to confirm your account!')
        } else {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) setError(error.message)
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen flex" style={{ background: '#FFF5F5' }}>

            {/* left panel — desktop only */}
            <div className="hidden md:flex flex-col justify-center items-center w-1/2 px-16"
                style={{ background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }}>
                <div style={{ color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '80px', marginBottom: '24px' }}>🍱</div>
                    <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>Canteen Credits</h1>
                    <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '40px' }}>Pay for your meals, earn rewards!</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                        {[['🍕', 'Order your favourite food'], ['💳', 'Pay instantly via app'], ['🪙', 'Earn credits on every order']].map(([emoji, text]) => (
                            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', padding: '12px 20px' }}>
                                <span style={{ fontSize: '24px' }}>{emoji}</span>
                                <span style={{ fontWeight: '500' }}>{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* right panel — login form */}
            <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6">
                <div className="w-full max-w-md">

                    {/* mobile logo */}
                    <div className="md:hidden text-center mb-8">
                        <div className="text-6xl mb-3">🍱</div>
                        <h1 className="text-3xl font-bold" style={{ color: '#E23744' }}>Canteen Credits</h1>
                        <p className="text-gray-500 mt-1">Pay. Eat. Earn.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-50">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {isSignup ? 'Create Account 👋' : 'Welcome Back 👋'}
                        </h2>
                        <p className="text-gray-400 text-sm mb-6">
                            {isSignup ? 'Join the canteen loyalty program' : 'Login to your canteen account'}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">College Email</label>
                                <input
                                    type="email"
                                    placeholder="you@college.edu"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 text-gray-800 bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 mb-1 block">Password</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-red-400 text-gray-800 bg-gray-50"
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl">
                                    {message}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 mt-2"
                                style={{ background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }}
                            >
                                {loading ? 'Please wait...' : isSignup ? 'Create Account 🚀' : 'Login →'}
                            </button>

                            <p className="text-center text-gray-400 text-sm pt-2">
                                {isSignup ? 'Already have an account?' : "Don't have an account?"}
                                <button
                                    onClick={() => setIsSignup(!isSignup)}
                                    className="font-semibold ml-1"
                                    style={{ color: '#E23744' }}
                                >
                                    {isSignup ? 'Login' : 'Sign Up'}
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}