import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from './ui/Card';
import { Checkbox } from './ui/Checkbox';
import { ChevronDown, ChevronUp, Key, Hash, Zap, Shield, Home, CheckCircle2, Archive, ArrowRight, Check, StickyNote, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RoomTaskCard({ room, onUpdate }) {
  const { submitTask } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const checklist = room.checklist || [];
  
  const completedCount = checklist.filter(item => item.completed).length;
  const isFullyCompleted = checklist.length > 0 && completedCount === checklist.length;

  const handleToggleTask = (taskLabel) => {
    const updatedChecklist = checklist.map(item => 
      item.label === taskLabel ? { ...item, completed: !item.completed } : item
    );
    // Use stable roomKey (houseId_roomId) instead of full suffix-id
    const roomKey = `${room.roomId}_${room.roomSpecificId}`;
    onUpdate(roomKey, { checklist: updatedChecklist });
  };

  const handleUpdateNotes = (notes) => {
    const roomKey = `${room.roomId}_${room.roomSpecificId}`;
    onUpdate(roomKey, { notes });
  };
  
  const handleAddTask = () => {
    if (!newTaskLabel.trim()) return;
    const newTask = { label: newTaskLabel.trim(), completed: false };
    const updatedChecklist = [...checklist, newTask];
    const roomKey = `${room.roomId}_${room.roomSpecificId}`;
    onUpdate(roomKey, { checklist: updatedChecklist });
    setNewTaskLabel('');
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <Card 
      onMouseMove={handleMouseMove}
      className={`glass-card mouse-glow group/card overflow-hidden transition-all duration-700 border-white shadow-sm ${isFullyCompleted ? 'bg-emerald-50/50 border-emerald-200 shadow-[0_0_40px_rgba(16,185,129,0.05)]' : ''}`}
    >
      {/* Background Glow Effect */}
      <div className={`absolute -inset-20 bg-emerald-500/5 blur-[100px] rounded-full transition-opacity duration-1000 pointer-events-none ${isFullyCompleted ? 'opacity-100' : 'opacity-0'}`} />
      
      <div 
        className="p-5 flex items-start gap-5 cursor-pointer hover:bg-white/[0.02] transition-colors relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`mt-1 w-14 h-14 rounded-[20px] flex items-center justify-center border transition-all duration-700 ${isFullyCompleted ? 'bg-emerald-100 border-emerald-200 text-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.1)]' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
           {isFullyCompleted ? <Shield className="w-7 h-7" /> : <Home className="w-7 h-7" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
             <div className="min-w-0">
                <h3 className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase truncate mb-0.5">{room.propertyName}</h3>
                <h2 className="text-2xl font-black text-slate-900 tracking-tightest uppercase truncate">{room.roomInfo?.roomName || room.roomName}</h2>
             </div>
             <motion.div 
               animate={{ rotate: isExpanded ? 180 : 0 }}
               className={`p-1.5 rounded-xl transition-colors ${isExpanded ? 'bg-slate-100 text-blue-600' : 'text-slate-300'}`}
             >
                <ChevronDown className="w-5 h-5" />
             </motion.div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
             {room.keyNumber && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-amber-500">
                  <Key className="w-3.5 h-3.5" /> Main Key: {room.keyNumber}
               </div>
             )}
             {room.roomInfo?.keyNumber && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-orange-600">
                  <Key className="w-3.5 h-3.5" /> Room Key: {room.roomInfo.keyNumber}
               </div>
             )}
             {room.garageCode && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 border border-slate-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Hash className="w-3.5 h-3.5" /> Garage: {room.garageCode}
               </div>
             )}
             {room.mainDoorCode && (
               <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 border border-slate-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <Shield className="w-3.5 h-3.5" /> Main: {room.mainDoorCode}
               </div>
             )}
          </div>
 
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-white p-[1px] shadow-inner">
             <motion.div 
               initial={false}
               animate={{ width: `${checklist.length ? (completedCount / checklist.length) * 100 : 0}%` }}
               className={`h-full rounded-full ${isFullyCompleted ? 'premium-gradient' : 'bg-blue-600'} transition-all duration-700`}
             />
          </div>
        </div>
      </div>
 
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/40"
          >
            <div className="p-6 space-y-6">
               {/* Access Detail Grid */}
               <div className="grid grid-cols-1 gap-4">
                  {room.roomInfo?.roomCode && (
                    <div className="p-4 bg-white rounded-3xl border border-slate-100 group hover:border-blue-500/40 transition-all duration-300 shadow-sm">
                       <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Private Room Entry Code</p>
                       <p className="text-2xl font-mono font-black text-slate-900 tracking-widest">{room.roomInfo.roomCode}</p>
                    </div>
                  )}
               </div>
 
               <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.4em]">Operational Checklist</p>
                    <span className="text-[10px] font-black text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-100">{completedCount} / {checklist.length}</span>
                  </div>
                  {checklist.map((item, idx) => (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTask(item.label);
                      }}
                      className={`flex items-center gap-4 p-4 rounded-3xl border transition-all duration-500 cursor-pointer ${item.completed ? 'bg-emerald-50 border-emerald-100/50 shadow-sm' : 'bg-white border-slate-100 hover:border-blue-100 shadow-sm hover:shadow-md'}`}
                    >
                      <div className="relative flex items-center justify-center">
                         <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all duration-700 ${item.completed ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'border-slate-200 bg-white'}`}>
                           {item.completed ? (
                             <motion.div 
                               initial={{ scale: 0, opacity: 0, rotate: -45 }}
                               animate={{ scale: 1, opacity: 1, rotate: 0 }}
                             >
                               <CheckCircle2 className="w-4 h-4 text-white stroke-[3px]" />
                             </motion.div>
                           ) : (
                             <div className="w-1.5 h-1.5 rounded-full bg-slate-100" />
                           )}
                         </div>
                      </div>
                      <span className={`text-sm font-black uppercase tracking-tight transition-colors duration-500 ${item.completed ? 'text-emerald-900' : 'text-slate-700'}`}>
                        {item.label}
                      </span>
                      {item.completed && (
                        <motion.div
                          initial={{ scale: 0, x: 10 }}
                          animate={{ scale: 1, x: 0 }}
                          className="ml-auto flex items-center gap-2"
                        >
                          <span className="text-[10px] font-black text-emerald-600 tracking-widest px-2 py-1 bg-emerald-100 rounded-lg">VERIFIED</span>
                          <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Quick Add Task Input */}
                  <div className="flex gap-2 pt-2">
                    <input 
                      type="text"
                      placeholder="Add an extra task..."
                      className="flex-1 h-12 px-4 bg-white border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all shadow-sm placeholder:text-slate-300 placeholder:italic"
                      value={newTaskLabel}
                      onChange={(e) => setNewTaskLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.stopPropagation();
                          handleAddTask();
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTask();
                      }}
                      className="w-12 h-12 bg-blue-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
               </div>

               {/* Task Notes Section */}
               <div className="space-y-2 pt-2">
                 <div className="flex items-center gap-2 mb-1 px-1">
                   <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Operational Notes</p>
                 </div>
                 <textarea 
                   placeholder="Add specific notes, issues, or completion details here..."
                   className="w-full min-h-[100px] p-4 bg-white border border-slate-100 rounded-3xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all resize-none shadow-inner placeholder:text-slate-300 placeholder:italic"
                   value={room.notes || ''}
                   onChange={(e) => handleUpdateNotes(e.target.value)}
                 />
               </div>

               <div className="space-y-3">
                  {/* Submission Action */}
                  {completedCount === checklist.length && checklist.length > 0 && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        submitTask(`${room.roomId}_${room.roomSpecificId}`);
                      }}
                      className="w-full mt-4 p-6 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-slate-200 group overflow-hidden relative"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                      <span className="relative z-10">Archive into History</span>
                      <Archive className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  )}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
