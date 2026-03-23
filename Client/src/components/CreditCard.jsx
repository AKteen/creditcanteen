export default function CreditCard({ credits, name }) {
  return (
    <div
      className="rounded-3xl p-6 shadow-lg relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E23744 0%, #FF6B35 100%)' }}
    >
      {/* background decoration */}
      <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white opacity-10" />
      <div className="absolute bottom-[-40px] right-[60px] w-32 h-32 rounded-full bg-white opacity-10" />

      <div className="relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-red-100 text-sm font-medium">Your Credits</p>
            <div className="flex items-end gap-2 mt-1">
              <h2 className="text-6xl font-bold text-white">{credits}</h2>
              <span className="text-red-200 text-sm mb-3">pts</span>
            </div>
            <p className="text-red-200 text-xs mt-1">₹10 spent = 1 credit earned</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-2xl p-3">
            <span className="text-4xl">🪙</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-red-400 border-opacity-40 flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">{name || 'Student'}</p>
            <p className="text-red-200 text-xs">Canteen Loyalty Member</p>
          </div>
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white opacity-60" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}