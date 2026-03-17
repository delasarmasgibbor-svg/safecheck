import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from './ui/Card';
import { CheckCircle2, Archive, StickyNote, Trash2, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PersonalTaskCard({ task }) {
  const { updateTask, submitTask, deletePersonalTask } = useAppContext();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isCompleted = task.checklist?.[0]?.completed || false;

  const handleToggle = () => {
    updateTask(task.id, { 
      checklist: [{ ...task.checklist[0], completed: !isCompleted }] 
    });
  };

  const handleUpdateNotes = (notes) => {
    updateTask(task.id, { notes });
  };

  return (
    <Card className={`glass-card overflow-hidden transition-all duration-500 border-white shadow-sm ${isCompleted ? 'bg-blue-50/50 border-blue-100' : ''}`}>
      <div 
        className="p-5 flex items-center gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${isCompleted ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
           <User className="w-6 h-6" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest mb-0.5">Personal Task</p>
              <h2 className={`text-lg font-black tracking-tight uppercase truncate ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                {task.label}
              </h2>
            </div>
            <div className="flex items-center gap-2">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   handleToggle();
                 }}
                 className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${isCompleted ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-200 bg-white'}`}
               >
                 {isCompleted && <CheckCircle2 className="w-5 h-5" />}
               </button>
            </div>
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
            <div className="p-5 space-y-4">
               <div className="space-y-2">
                 <div className="flex items-center gap-2 px-1">
                   <StickyNote className="w-3.5 h-3.5 text-slate-400" />
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em]">Task Notes</p>
                 </div>
                 <textarea 
                   placeholder="Add notes or details for this task..."
                   className="w-full min-h-[80px] p-4 bg-white border border-slate-100 rounded-2xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 transition-all resize-none shadow-inner"
                   value={task.notes || ''}
                   onChange={(e) => handleUpdateNotes(e.target.value)}
                   onClick={(e) => e.stopPropagation()}
                 />
               </div>

               <div className="flex gap-2">
                  {isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        submitTask(task.id);
                      }}
                      className="flex-1 p-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
                    >
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePersonalTask(task.id);
                    }}
                    className="p-4 bg-white border border-rose-100 text-rose-500 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-50 transition-all active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
