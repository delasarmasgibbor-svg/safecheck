import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ClipboardCheck, RotateCcw, User, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function PersonalArchive() {
  const { personalTasks, revertTask, deletePersonalTask, loading } = useAppContext();

  const archivedPersonalTasks = personalTasks.filter(t => t.status === 'completed')
    .sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0));

  if (loading) return <div className="p-8 text-center text-slate-500 font-display animate-pulse">Retrieving Personal Archives...</div>;

  return (
    <div className="p-4 pb-24 min-h-screen max-w-2xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Personal Archive</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Your completed private tasks</p>
        </div>
        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm">
           <ClipboardCheck className="w-6 h-6 text-blue-500" />
        </div>
      </header>

      {archivedPersonalTasks.length === 0 ? (
        <div className="text-center py-24 flex flex-col items-center space-y-4 bg-white rounded-[32px] border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-2">
            <User className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-bold text-lg">No completed personal tasks</p>
            <p className="text-slate-400 text-sm max-w-[200px]">Tasks you complete on the dashboard will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {archivedPersonalTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-5 flex items-center justify-between group hover:border-blue-200 transition-all duration-300 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                      <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{task.label}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 
                          {task.completedAt?.toMillis ? new Date(task.completedAt.toMillis()).toLocaleDateString() : 'Archived'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => revertTask(task.id)}
                      className="h-9 px-3 text-blue-500 hover:bg-blue-50 rounded-xl flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reclaim
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => deletePersonalTask(task.id)}
                      className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
