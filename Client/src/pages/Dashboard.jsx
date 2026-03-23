import { useEffect, useState } from 'react'
import supabase from '../lib/supabase'
import CreditCard from '../components/CreditCard'
import PaymentButton from '../components/PaymentButton'
import TransactionList from '../components/TransactionList'

export default function Dashboard({ session }) {
    const [credits, setCredits] = useState(0)
    const [transactions, setTransactions] = useState([])
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        fetchData()
        const cleanup = subscribeToCredits()
        return cleanup
    }, [])

    async function fetchData() {
        const userId = session.user.id

        const { data: creditData } = await supabase
            .from('credits')
            .select('balance')
            .eq('user_id', userId)
            .single()
        setCredits(creditData?.balance || 0)

        const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', userId)
            .single()
        setProfile(profileData)

        const { data: txData } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(10)
        setTransactions(txData || [])
    }

    function subscribeToCredits() {
        const channel = supabase
            .channel('credits-realtime')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'credits',
                filter: `user_id=eq.${session.user.id}`
            }, (payload) => {
                setCredits(payload.new.balance)
                fetchData()
            })
            .subscribe()
        return () => supabase.removeChannel(channel)
    }

    async function handleLogout() {
        await supabase.auth.signOut()
    }

    return (
        <div className="min-h-screen" style={{ background: '#FFF5F5' }}>

            {/* navbar */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🍱</span>
                        <span className="font-bold text-lg" style={{ color: '#E23744' }}>Canteen Credits</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-400 hover:text-red-500 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="max-w-lg mx-auto px-4 py-6 pb-24 space-y-5">

                {/* greeting */}
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Hey, {profile?.name?.split(' ')[0] || 'Foodie'} 👋
                    </h2>
                    <p className="text-gray-400 text-sm mt-0.5">Here's your loyalty summary</p>
                </div>

                {/* credit card */}
                <CreditCard credits={credits} name={profile?.name} />

                {/* payment */}
                <PaymentButton session={session} onSuccess={fetchData} />

                {/* transactions */}
                <TransactionList transactions={transactions} />

            </div>
        </div>
    )
}