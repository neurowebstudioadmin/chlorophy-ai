import { useState } from 'react';

export default function ComingSoon() {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Password segreta per te
    if (password === 'chlorophy2025') {
      setIsUnlocked(true);
      localStorage.setItem('chlorophy_unlocked', 'true');
      window.location.reload();
    } else {
      alert('Password non corretta');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-green-600 mb-4">🌿 Chlorophy AI</h1>
          <p className="text-2xl text-gray-700 mb-2">Coming Soon</p>
          <p className="text-lg text-gray-600">We're working on something amazing!</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <p className="text-gray-700 mb-6">
            The future of AI-powered website creation is coming soon. <br/>
             Something amazing is in the works!
            </p>
          
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <input
              type="password"
              placeholder="Password di accesso (solo per admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Accedi
            </button>
          </form>
        </div>

        <p className="text-gray-500 text-sm">© 2025 Chlorophy AI. All rights reserved.</p>
      </div>
    </div>
  );
}