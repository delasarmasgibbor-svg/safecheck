import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Lock, User, Eye, EyeOff, LayoutDashboard, Settings, History, ClipboardList, ShieldCheck, LogOut, Home, Filter, Sparkles, X, Plus } from 'lucide-react';
import { RoomTaskCard } from './components/RoomTaskCard';
import { PersonalTaskCard } from './components/PersonalTaskCard';
import { AppProvider, useAppContext } from './context/AppContext';
import { PropertyManager } from './pages/PropertyManager';
import { HistoryLog } from './pages/HistoryLog';
import { PersonalArchive } from './pages/PersonalArchive';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { Card } from './components/ui/Card';
import { SkeletonCard } from './components/ui/Skeleton';
import { ClipboardCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Dashboard() {
  const [search, setSearch] = useState('');
  const [newPersonalTask, setNewPersonalTask] = useState('');
  const [hideCompleted, setHideCompleted] = useState(false);
  const { properties, todayTasks, personalTasks, updateTask, getTaskForRoom, addPersonalTask, loading } = useAppContext();

  const activeRooms = properties.filter(p => p.active);
  
  // 1. Property Tasks
  const enrichedRooms = activeRooms.flatMap(house => {
    const rooms = house.rooms && house.rooms.length > 0 
      ? house.rooms 
      : [{ id: 'general', roomName: 'House' }];

    return rooms.map(room => {
      const taskData = getTaskForRoom(house.id, room.id);
      const checklist = taskData?.checklist || [];
      const isCompleted = checklist.length > 0 && checklist.every(item => item.completed);
      const isArchived = taskData?.status === 'completed';
      
      return { 
        ...taskData, 
        ...house,
        roomInfo: room,
        isCompleted, 
        isArchived,
        type: 'property'
      };
    });
  }).filter(r => !r.isArchived);

  // 2. Personal Tasks
  const activePersonalTasks = personalTasks
    .filter(t => t.status !== 'completed')
    .map(t => ({
      ...t,
      isCompleted: t.checklist?.[0]?.completed || false,
      type: 'personal'
    }));

  const allActiveTasks = [...enrichedRooms, ...activePersonalTasks];

  const filteredTasks = allActiveTasks
    .filter(t => {
      const searchLower = search.toLowerCase();
      if (t.type === 'personal') {
        return (t.label || '').toLowerCase().includes(searchLower);
      }
      
      return (t.propertyName?.toLowerCase() || '').includes(searchLower) || 
        (t.roomInfo?.roomName?.toLowerCase() || '').includes(searchLower) ||
        (String(t.keyNumber || '').toLowerCase().includes(searchLower)) ||
        (String(t.roomInfo?.keyNumber || '').toLowerCase().includes(searchLower));
    })
    .filter(t => hideCompleted ? !t.isCompleted : true)
    .sort((a, b) => {
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;
      return 0;
    });

  const handleAddPersonalTask = (e) => {
    e.preventDefault();
    if (!newPersonalTask.trim()) return;
    addPersonalTask(newPersonalTask);
    setNewPersonalTask('');
  };


  if (loading) return (
    <div className="p-4 space-y-4">
      <div className="relative mb-8">
        <SkeletonCard />
      </div>
      {[1, 2, 3].map(i => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <div className="relative mb-8 flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors z-10" />
          <Input 
            placeholder="Search tasks, properties or keys..." 
            className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-0 text-slate-900 pr-12"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400 z-20"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button 
          onClick={() => setHideCompleted(!hideCompleted)}
          className={`w-14 h-14 rounded-2xl border transition-all flex items-center justify-center shadow-sm ${hideCompleted ? 'bg-blue-600 border-blue-600 text-white shadow-blue-500/20' : 'bg-white border-slate-200 text-slate-400 hover:text-blue-500'}`}
          title={hideCompleted ? "Show Completed" : "Hide Completed"}
        >
              {hideCompleted && (
                <motion.div 
                  layoutId="focus-bg"
                  className="absolute inset-0 bg-blue-600/5 pointer-events-none"
                />
              )}
            </button>
      </div>

      <form onSubmit={handleAddPersonalTask} className="mb-8 relative group">
        <div className="absolute inset-0 bg-blue-500/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-2xl" />
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Add a personal task..." 
              className="pl-12 h-14 bg-white border-slate-200 rounded-2xl shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 text-slate-900 font-medium"
              value={newPersonalTask}
              onChange={e => setNewPersonalTask(e.target.value)}
            />
          </div>
          <Button 
            type="submit"
            disabled={!newPersonalTask.trim()}
            className="h-14 px-5 premium-gradient rounded-2xl shadow-lg shadow-blue-500/10 active:scale-95 transition-all disabled:opacity-50"
          >
            <Plus className="w-6 h-6" />
          </Button>
          <Link to="/personal-archive">
            <Button 
              type="button"
              variant="ghost"
              className="h-14 w-14 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center p-0"
              title="Personal Archive"
            >
              <ClipboardCheck className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </form>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.map((task, idx) => {
            return (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4, 
                  delay: idx * 0.05,
                  ease: [0.19, 1, 0.22, 1]
                }}
              >
                {task.type === 'personal' ? (
                  <PersonalTaskCard task={task} />
                ) : (
                  <RoomTaskCard 
                    room={task} 
                    onUpdate={(roomKey, updates) => updateTask(roomKey, updates)} 
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
             <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-3xl mx-auto flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-700" />
             </div>
            <p className="text-slate-500 font-medium">No matches for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Login({ onLogin }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passcode === '1234') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Background Accents - Light Mode */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full animate-glow-pulse animate-slow-drift" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[120px] rounded-full animate-glow-pulse animate-slow-drift" style={{ animationDelay: '-4s' }} />
      
      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-multiply" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-10 text-center relative z-10"
      >
        <div className="space-y-4">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 group-hover:scale-[2] transition-transform duration-700" />
            <div className="relative w-24 h-24 premium-gradient p-[1px] rounded-[32px] mx-auto shadow-2xl">
              <div className="w-full h-full bg-white rounded-[31px] flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">SafeCheck</h1>
            <p className="text-slate-400 font-medium tracking-wide flex items-center justify-center gap-2">
              <span className="w-8 h-[1px] bg-slate-800" />
              ELITE ACCOMMODATION
              <span className="w-8 h-[1px] bg-slate-800" />
            </p>
          </div>
        </div>

        <Card className={`p-8 glass-panel border-white relative overflow-hidden shadow-2xl ${error ? 'border-rose-500/50 animate-shake' : ''}`}>
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-2 text-left relative group/input">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Secure Passcode</label>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="••••" 
                  className="text-center text-3xl tracking-[0.5em] h-20 bg-slate-50 border-slate-200 rounded-2xl focus:border-blue-500 relative z-10 text-slate-900"
                  maxLength={4}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                />
                <div className="absolute inset-0 bg-blue-500/5 blur-xl opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                {/* Scanning line */}
                <motion.div 
                  initial={{ top: '0%' }}
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[1px] bg-blue-500/20 z-20 pointer-events-none opacity-0 group-focus-within/input:opacity-100"
                />
              </div>
            </div>
            {error && <p className="text-rose-400 text-xs font-bold animate-pulse">Authentication Failure</p>}
            <Button type="submit" className="w-full h-16 text-lg font-black premium-gradient rounded-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all">
              Initialize Portal
            </Button>
          </form>
        </Card>

        <div className="flex flex-col items-center gap-2 opacity-30">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">Encrypted Session</p>
          <div className="flex gap-1">
             {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-slate-500" />)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans">
      <header className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 premium-gradient rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tighter text-slate-900">
            SafeCheck
          </h1>
        </div>
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">SafeCheck</span>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Admin Portal</span>
           </div>
           <button 
             onClick={() => setIsAuthenticated(false)} 
             className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 hover:border-rose-500/10 transition-all active:scale-95 shadow-sm"
           >
             <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/properties" element={<PropertyManager />} />
              <Route path="/history" element={<HistoryLog />} />
              <Route path="/personal-archive" element={<PersonalArchive />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      
      <nav className="fixed bottom-0 left-0 right-0 p-4 z-50">
        <div className="max-w-md mx-auto glass-panel rounded-[32px] h-20 flex justify-around items-center px-4 border-white shadow-xl relative overflow-hidden">
          {/* Active indicator glow */}
          <div className="absolute inset-0 premium-gradient opacity-5 scale-150 blur-3xl pointer-events-none" />
          
          <Link to="/" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${location.pathname === '/' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <ClipboardList className={`w-6 h-6 mb-0.5 transition-transform ${location.pathname === '/' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tight">Tasks</span>
            {location.pathname === '/' && <motion.div layoutId="nav-active" className="absolute -bottom-1 w-8 h-1 premium-gradient rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />}
          </Link>

          <Link to="/properties" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${location.pathname === '/properties' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <Home className={`w-6 h-6 mb-0.5 transition-transform ${location.pathname === '/properties' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tight">Houses</span>
            {location.pathname === '/properties' && <motion.div layoutId="nav-active" className="absolute -bottom-1 w-8 h-1 premium-gradient rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />}
          </Link>

          <Link to="/personal-archive" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${location.pathname === '/personal-archive' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <ClipboardCheck className={`w-6 h-6 mb-0.5 transition-transform ${location.pathname === '/personal-archive' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tight">Private</span>
            {location.pathname === '/personal-archive' && <motion.div layoutId="nav-active" className="absolute -bottom-1 w-8 h-1 premium-gradient rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />}
          </Link>

          <Link to="/history" className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${location.pathname === '/history' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
            <History className={`w-6 h-6 mb-0.5 transition-transform ${location.pathname === '/history' ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-tight">Logs</span>
            {location.pathname === '/history' && <motion.div layoutId="nav-active" className="absolute -bottom-1 w-8 h-1 premium-gradient rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />}
          </Link>
        </div>
      </nav>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
