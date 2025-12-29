import React, { useState } from 'react';
import { Activity, Lock, Phone, ArrowRight, Loader2 } from 'lucide-react';

interface LoginFormProps {
  onLogin: (userId: string, pass: string) => Promise<boolean>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [uid, setUid] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Simulate a brief network delay for better UX feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await onLogin(uid, pass);
    if (!success) {
      setError('Invalid Phone Number or Password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
           {/* Logo Section */}
           <div className="flex justify-center mb-6">
              <div className="w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-700 shadow-sm border border-primary-100">
                <Activity size={28} />
              </div>
           </div>
           
           <div className="text-center mb-8">
             <h1 className="text-xl font-bold text-gray-900 tracking-tight">Dengue Pro</h1>
             <p className="text-sm text-gray-500 mt-2">Control System v1.0</p>
           </div>

           <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Phone Number (User ID)</label>
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                       <Phone size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={uid}
                      onChange={e => setUid(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                      placeholder="e.g. 9876543210"
                      required
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
                 <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                       <Lock size={18} />
                    </div>
                    <input 
                      type="password" 
                      value={pass}
                      onChange={e => setPass(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white outline-none transition-all text-sm font-medium text-gray-900 placeholder:text-gray-400"
                      placeholder="••••••••"
                      required
                    />
                 </div>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs font-medium text-center animate-pulse">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-primary-800 hover:bg-primary-900 text-white font-bold text-sm rounded-lg shadow-md shadow-primary-900/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
              </button>
           </form>
        </div>
        <div className="bg-gray-50/80 p-4 text-center border-t border-gray-100">
           <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
};