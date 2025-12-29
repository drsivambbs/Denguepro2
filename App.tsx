
import React, { useState, useEffect, useRef } from 'react';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { DengueCaseList } from './components/DengueCaseList';
import { FollowUpForm } from './components/FollowUpForm';
import { CaseForm } from './components/CaseForm';
import { LoginForm } from './components/LoginForm';
import { Dashboard } from './components/Dashboard';
import { User, DengueCase, CaseStatus, FollowUpStatus } from './types';
import { Search, Plus, Users, Settings, X, LogOut, Activity, MapPin, Filter, ClipboardList, FileUp, FileDown, Lock, CheckCircle2, LayoutDashboard } from 'lucide-react';

const App: React.FC = () => {
  // --- User Data State ---
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('dengue_pro_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '1',
        name: 'Dr. Sarah Chen',
        email: 'chen.s@denguepro.org',
        phoneNumber: '5551234567',
        role: 'District Entomologist',
        userId: '5551234567',
        password: 'password123',
        locationType: 'District',
        locationName: 'Central District',
        createdAt: Date.now()
      },
      {
        id: '2',
        name: 'James Okonjo',
        email: 'okonjo.j@denguepro.org',
        phoneNumber: '5559876543',
        role: 'Health Inspector',
        userId: '5559876543',
        password: 'password123',
        locationType: 'Block',
        locationName: 'North Sector Block 4',
        createdAt: Date.now() - 86400000
      },
      {
        id: '3',
        name: 'Anita Roy',
        email: 'anita.roy@denguepro.org',
        phoneNumber: '5553421111',
        role: 'Medical Officer',
        userId: '5553421111',
        password: 'password123',
        locationType: 'PHC',
        locationName: 'West Hills PHC',
        createdAt: Date.now() - 172800000
      },
      {
        id: 'demo-user',
        name: 'Demo User',
        email: 'demo@denguepro.org',
        phoneNumber: '9894585495',
        role: 'Data Manager',
        userId: '9894585495',
        password: 'password123',
        locationType: 'District',
        locationName: 'Training District',
        createdAt: Date.now()
      }
    ];
  });

  // --- Dengue Cases Data (Mock) ---
  const [dengueCases, setDengueCases] = useState<DengueCase[]>([
    {
      id: '101',
      patientName: 'Rahul Verma',
      age: 34,
      gender: 'Male',
      address: '12/B Gandhi Nagar',
      location: 'Central District',
      diagnosisDate: Date.now() - 2 * 86400000,
      status: 'Confirmed',
      contactNumber: '+1 555 0101',
      followUpStatus: 'Pending',
      followUpNote: 'Scheduled for next week',
      lastFollowUpDate: Date.now() - 86400000,
      history: [
        {
             id: 'h1',
             date: Date.now() - 86400000,
             status: 'Pending',
             remarks: 'Initial home visit scheduled.'
        }
      ]
    },
    {
      id: '102',
      patientName: 'Priya Sharma',
      age: 28,
      gender: 'Female',
      address: 'Sector 4, Housing Board',
      location: 'West Hills PHC',
      diagnosisDate: Date.now() - 5 * 86400000,
      status: 'Recovered',
      contactNumber: '+1 555 0202',
      followUpStatus: 'Completed',
      lastFollowUpDate: Date.now(),
      history: []
    },
    {
      id: '103',
      patientName: 'Amit Singh',
      age: 45,
      gender: 'Male',
      address: 'Near Old Market',
      location: 'North Sector Block 4',
      diagnosisDate: Date.now() - 1 * 86400000,
      status: 'Suspected',
      contactNumber: '+1 555 0303',
      followUpStatus: 'In Progress',
      history: []
    },
    {
      id: '104',
      patientName: 'Sita Devi',
      age: 62,
      gender: 'Female',
      address: 'Village Kherki',
      location: 'Rural Block A',
      diagnosisDate: Date.now() - 12 * 3600000,
      status: 'Critical',
      contactNumber: '+1 555 0404',
      followUpStatus: 'Pending',
      history: []
    }
  ]);

  // --- Authentication State ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedSession = localStorage.getItem('dengue_pro_session');
    if (savedSession) {
        try { return JSON.parse(savedSession); } catch(e) { console.error(e); }
    }
    return null;
  });

  // --- UI State ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddCaseOpen, setIsAddCaseOpen] = useState(false);
  
  // Follow-up Drawer State
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Set 'dashboard' as the default active tab
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'cases' | 'directory' | 'settings'

  // --- Search & Filter State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  
  // Case Search State
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState<string>('All');
  
  // Settings / Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  
  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('dengue_pro_users', JSON.stringify(users));
  }, [users]);

  // Listen for clear filter events
  useEffect(() => {
    const handleClearUsers = () => {
      setSearchQuery('');
      setFilterType('All');
    };
    const handleClearCases = () => {
      setCaseSearchQuery('');
      setCaseStatusFilter('All');
    };

    window.addEventListener('clear-filters', handleClearUsers);
    window.addEventListener('clear-case-filters', handleClearCases);
    
    return () => {
      window.removeEventListener('clear-filters', handleClearUsers);
      window.removeEventListener('clear-case-filters', handleClearCases);
    };
  }, []);

  // --- Handlers ---
  const handleLogin = async (userId: string, pass: string): Promise<boolean> => {
    const user = users.find(u => u.userId === userId && u.password === pass);
    if (user) {
        setCurrentUser(user);
        localStorage.setItem('dengue_pro_session', JSON.stringify(user));
        return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dengue_pro_session');
    setActiveTab('dashboard'); // Reset to default
    setNewPassword('');
    setConfirmPassword('');
    setPasswordMessage({ type: '', text: '' });
  };

  const handleAddUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setUsers(prev => [newUser, ...prev]);
    setIsDrawerOpen(false);
  };

  const handleRemoveUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser) return;
      if (newPassword !== confirmPassword) {
          setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
          return;
      }
      if (newPassword.length < 4) {
          setPasswordMessage({ type: 'error', text: 'Password is too short.' });
          return;
      }

      setUsers(prev => prev.map(u => {
          if (u.id === currentUser.id) {
              return { ...u, password: newPassword };
          }
          return u;
      }));

      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
      localStorage.setItem('dengue_pro_session', JSON.stringify(updatedUser));

      setPasswordMessage({ type: 'success', text: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
  };

  const handleResetUserPassword = (targetUserId: string) => {
      if (confirm('Are you sure you want to reset this user\'s password to "password123"?')) {
          setUsers(prev => prev.map(u => {
              if (u.id === targetUserId) {
                  return { ...u, password: 'password123' };
              }
              return u;
          }));
          alert('User password has been reset to default.');
      }
  };

  const handleSelectCaseForFollowUp = (caseItem: DengueCase) => {
    setSelectedCaseId(caseItem.id);
    setIsFollowUpOpen(true);
  };

  const handleSaveFollowUp = (id: string, status: FollowUpStatus, note: string, date: number) => {
    setDengueCases(prev => prev.map(c => {
       if (c.id === id) {
           const newRecord = {
               id: crypto.randomUUID(),
               date: date,
               status: status,
               remarks: note,
               addedBy: currentUser?.name
           };
           return { 
               ...c, 
               followUpStatus: status, 
               followUpNote: note, 
               lastFollowUpDate: date,
               history: [newRecord, ...(c.history || [])]
           };
       }
       return c;
    }));
  };

  const handleAddCase = (caseData: Omit<DengueCase, 'id' | 'followUpStatus' | 'history' | 'followUpNote' | 'lastFollowUpDate'>) => {
    const newCase: DengueCase = {
        ...caseData,
        id: crypto.randomUUID(),
        followUpStatus: 'Pending',
        history: []
    };
    setDengueCases(prev => [newCase, ...prev]);
    setIsAddCaseOpen(false);
  };

  const handleDownloadTemplate = () => {
    const CSV_HEADERS = ['Patient Name', 'Age', 'Gender', 'Address', 'Location', 'Status', 'Contact Number', 'Diagnosis Date (YYYY-MM-DD)'];
    const sampleRow = ['John Doe', '30', 'Male', '123 Main St', 'Central District', 'Suspected', '+15550001234', '2023-10-01'];
    const csvContent = [CSV_HEADERS.join(','), sampleRow.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'dengue_cases_template.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        if (!text) return;
        try {
            const lines = text.split('\n').map(line => line.trim()).filter(line => line);
            if (lines.length < 1) return;
            const dataRows = lines.slice(1);
            const newCases: DengueCase[] = dataRows.map((row): DengueCase | null => {
                const cols = row.split(',').map(c => c.trim());
                if (cols.length < 5) return null;
                const status = ['Suspected', 'Confirmed', 'Recovered', 'Critical'].includes(cols[5]) 
                    ? cols[5] as CaseStatus : 'Suspected';
                return {
                    id: crypto.randomUUID(),
                    patientName: cols[0] || 'Unknown',
                    age: parseInt(cols[1]) || 0,
                    gender: (cols[2] === 'Male' || cols[2] === 'Female') ? cols[2] : 'Other',
                    address: cols[3] || '',
                    location: cols[4] || '',
                    status: status,
                    contactNumber: cols[6] || '',
                    diagnosisDate: cols[7] ? new Date(cols[7]).getTime() : Date.now(),
                    followUpStatus: 'Pending',
                    history: []
                };
            }).filter((c): c is DengueCase => c !== null);
            if (newCases.length > 0) setDengueCases(prev => [...prev, ...newCases]);
        } catch (error) { console.error('Error parsing CSV', error); }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = user.name.toLowerCase().includes(query) || user.role.toLowerCase().includes(query) || user.locationName.toLowerCase().includes(query);
    const matchesFilter = filterType === 'All' || user.locationType === filterType;
    return matchesSearch && matchesFilter;
  });

  const filteredCases = dengueCases.filter(c => {
    const matchesStatus = caseStatusFilter === 'All' || c.status === caseStatusFilter;
    const query = caseSearchQuery.toLowerCase();
    return matchesStatus && (!query || c.patientName.toLowerCase().includes(query) || c.address.toLowerCase().includes(query));
  });

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Operational Dashboard';
      case 'directory': return 'Staff Directory';
      case 'cases': return 'Reported Cases';
      case 'settings': return 'Settings';
      default: return 'Dengue Pro';
    }
  };

  const handleNavigateToCases = (status?: string) => {
    if (status) setCaseStatusFilter(status);
    setActiveTab('cases');
  };

  if (!currentUser) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-60 flex-col bg-primary-900 text-white shrink-0 shadow-xl z-20">
        <div className="h-14 flex items-center px-4 gap-3 border-b border-primary-800">
           <Activity className="text-primary-100" size={24} />
           <div className="leading-tight">
             <h1 className="font-bold tracking-wide text-sm">Dengue Pro</h1>
             <span className="text-[10px] text-primary-300 uppercase tracking-widest block">v1.0</span>
           </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-primary-800 text-white shadow-sm' : 'text-primary-100 hover:bg-primary-800/50'}`}
           >
             <LayoutDashboard size={16} /> Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('cases')}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'cases' ? 'bg-primary-800 text-white shadow-sm' : 'text-primary-100 hover:bg-primary-800/50'}`}
           >
             <ClipboardList size={16} /> Cases
           </button>
           <button 
             onClick={() => setActiveTab('directory')}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'directory' ? 'bg-primary-800 text-white shadow-sm' : 'text-primary-100 hover:bg-primary-800/50'}`}
           >
             <Users size={16} /> Directory
           </button>
           <button 
             onClick={() => setActiveTab('settings')}
             className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-800 text-white shadow-sm' : 'text-primary-100 hover:bg-primary-800/50'}`}
           >
             <Settings size={16} /> Settings
           </button>
        </nav>

        <div className="p-3 border-t border-primary-800">
           <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-primary-800/30">
              <div className="w-8 h-8 rounded-full border border-primary-700 bg-primary-800 flex items-center justify-center text-xs font-bold shrink-0">
                 {currentUser.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                 <div className="text-xs font-medium truncate">{currentUser.name}</div>
                 <div className="text-[9px] text-primary-300 truncate">{currentUser.role}</div>
              </div>
              <button onClick={handleLogout} className="p-1.5 text-primary-300 hover:text-white hover:bg-primary-700 rounded-md">
                <LogOut size={14} />
              </button>
           </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative min-w-0">
        <header className="md:hidden h-12 bg-primary-900 text-white flex items-center justify-between px-3 shrink-0 shadow-md z-20">
           <div className="flex items-center gap-2">
             <Activity size={18} />
             <span className="font-bold text-sm tracking-wide">Dengue Pro</span>
           </div>
           <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-800 text-xs font-bold">
              {currentUser.name.charAt(0)}
           </div>
        </header>

        <header className="hidden md:flex h-14 bg-white border-b border-gray-200 items-center justify-between px-5 shrink-0 z-10">
           <h2 className="font-bold text-gray-800 text-lg">{getPageTitle()}</h2>
           <div className="flex items-center gap-3">
              {activeTab === 'directory' && (
                <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm">
                    <Plus size={16} /> <span>Add Staff</span>
                </button>
              )}
              {activeTab === 'cases' && (
                <button onClick={() => setIsAddCaseOpen(true)} className="flex items-center gap-2 px-3 py-1.5 bg-primary-700 text-white text-sm font-medium rounded-md shadow-sm">
                    <Plus size={16} /> <span>Add Case</span>
                </button>
              )}
           </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 relative">
           {activeTab === 'dashboard' && (
             <Dashboard 
                cases={dengueCases} 
                onNavigateToCases={handleNavigateToCases} 
             />
           )}
           {activeTab === 'cases' && (
             <>
               <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 shadow-sm">
                 <div className="flex flex-col md:flex-row gap-3 max-w-5xl mx-auto">
                   <div className="relative flex-1">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Search size={16} /></div>
                     <input type="text" value={caseSearchQuery} onChange={(e) => setCaseSearchQuery(e.target.value)} placeholder="Search cases..." className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-lg text-sm outline-none" />
                   </div>
                   <select value={caseStatusFilter} onChange={(e) => setCaseStatusFilter(e.target.value)} className="w-full md:w-48 px-3 py-2 bg-white md:bg-gray-100 border border-gray-200 md:border-none rounded-lg text-sm outline-none">
                      {['All', 'Suspected', 'Confirmed', 'Recovered', 'Critical'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 </div>
               </div>
               <DengueCaseList cases={filteredCases} onSelectCase={handleSelectCaseForFollowUp} isFiltered={caseSearchQuery.length > 0 || caseStatusFilter !== 'All'} />
             </>
           )}
           {activeTab === 'directory' && (
             <>
               <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-3 shadow-sm">
                 <div className="flex flex-col md:flex-row gap-3 max-w-5xl mx-auto">
                   <div className="relative flex-1">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Search size={16} /></div>
                     <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search staff..." className="w-full pl-9 pr-3 py-2 bg-gray-100 border-none rounded-lg text-sm outline-none" />
                   </div>
                   <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="w-full md:w-48 px-3 py-2 bg-white md:bg-gray-100 border border-gray-200 md:border-none rounded-lg text-sm outline-none">
                      {['All', 'PHC', 'District', 'Corporation', 'Block', 'Municipality'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                   </select>
                 </div>
               </div>
               <UserList users={filteredUsers} onRemoveUser={handleRemoveUser} onOpenAdd={() => setIsDrawerOpen(true)} isFiltered={searchQuery.length > 0 || filterType !== 'All'} currentUserRole={currentUser.role} onResetPassword={handleResetUserPassword} />
             </>
           )}
           {activeTab === 'settings' && (
             <div className="max-w-md mx-auto p-6 pt-12 flex flex-col items-center animate-fade-in pb-20 md:pb-6">
                <div className="w-20 h-20 bg-white border-2 border-white shadow-md rounded-full flex items-center justify-center text-3xl font-bold text-primary-700 mb-4">{currentUser.name.charAt(0)}</div>
                <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-sm text-gray-500 font-medium mb-8">{currentUser.role}</p>
                <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-4">
                     <p className="text-[11px] uppercase font-bold text-gray-500 mb-3 flex items-center gap-2"><Lock size={12} /> Change Password</p>
                     <form onSubmit={handleChangePassword} className="space-y-3">
                         <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none" />
                         <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="w-full p-2 bg-gray-50 border border-gray-200 rounded text-sm outline-none" />
                         {passwordMessage.text && <div className={`text-xs p-2 rounded ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{passwordMessage.text}</div>}
                         <button type="submit" className="w-full py-2 bg-gray-800 text-white text-xs font-bold rounded">Update Password</button>
                     </form>
                </div>
                <button onClick={handleLogout} className="w-full py-3 bg-white border border-red-200 text-red-600 font-bold text-sm rounded-lg flex items-center justify-center gap-2 shadow-sm"><LogOut size={18} /> Sign Out</button>
             </div>
           )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="md:hidden h-14 bg-white border-t border-gray-200 flex items-center justify-around px-2 shrink-0 z-20 safe-area-pb">
           <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-0.5 p-2 min-w-[60px] ${activeTab === 'dashboard' ? 'text-primary-700' : 'text-gray-400'}`}>
              <LayoutDashboard size={20} strokeWidth={activeTab === 'dashboard' ? 2.5 : 2} />
              <span className="text-[9px] font-medium">Dash</span>
           </button>
           <button onClick={() => setActiveTab('cases')} className={`flex flex-col items-center gap-0.5 p-2 min-w-[60px] ${activeTab === 'cases' ? 'text-primary-700' : 'text-gray-400'}`}>
              <ClipboardList size={20} strokeWidth={activeTab === 'cases' ? 2.5 : 2} />
              <span className="text-[9px] font-medium">Cases</span>
           </button>
           <button onClick={() => setActiveTab('directory')} className={`flex flex-col items-center gap-0.5 p-2 min-w-[60px] ${activeTab === 'directory' ? 'text-primary-700' : 'text-gray-400'}`}>
              <Users size={20} strokeWidth={activeTab === 'directory' ? 2.5 : 2} />
              <span className="text-[9px] font-medium">Staff</span>
           </button>
           <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-0.5 p-2 min-w-[60px] ${activeTab === 'settings' ? 'text-primary-700' : 'text-gray-400'}`}>
              <Settings size={20} strokeWidth={activeTab === 'settings' ? 2.5 : 2} />
              <span className="text-[9px] font-medium">Settings</span>
           </button>
        </div>
      </main>

      {/* Drawers */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
             <div className="h-12 md:h-14 flex items-center justify-between px-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">Add Staff Member</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-hidden"><UserForm onAddUser={handleAddUser} onCancel={() => setIsDrawerOpen(false)} /></div>
          </div>
        </div>
      )}

      {isAddCaseOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsAddCaseOpen(false)}></div>
          <div className="relative w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
             <div className="h-12 md:h-14 flex items-center justify-between px-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">New Dengue Case Report</h2>
                <button onClick={() => setIsAddCaseOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-hidden"><CaseForm onSave={handleAddCase} onCancel={() => setIsAddCaseOpen(false)} /></div>
          </div>
        </div>
      )}

      {isFollowUpOpen && selectedCaseId && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setIsFollowUpOpen(false)}></div>
          <div className="relative w-full md:w-[400px] bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
             <div className="h-12 md:h-14 flex items-center justify-between px-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base font-bold text-gray-900">Follow-up History</h2>
                <button onClick={() => setIsFollowUpOpen(false)} className="p-1.5 text-gray-400 hover:text-gray-600"><X size={18} /></button>
             </div>
             <div className="flex-1 overflow-hidden">
                {dengueCases.find(c => c.id === selectedCaseId) && (
                    <FollowUpForm 
                        caseData={dengueCases.find(c => c.id === selectedCaseId)!} 
                        onSave={handleSaveFollowUp} 
                        onCancel={() => setIsFollowUpOpen(false)} 
                    />
                )}
             </div>
          </div>
        </div>
      )}

      <style>{`
        .safe-area-pb { padding-bottom: env(safe-area-inset-bottom); }
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
