import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { ChevronDown, History, Calendar, CheckCircle2, Clock, MapPin, RotateCcw, StickyNote, Check, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function HistoryLog() {
  const { history, properties, loading, revertTask } = useAppContext();
  const [expandedDate, setExpandedDate] = useState(null);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const getPropertyName = (id, type) => {
    if (type === 'personal') return 'Personal Task';
    return properties.find(p => p.id === id)?.propertyName || 'Legacy House';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toMillis ? new Date(timestamp.toMillis()) : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-display animate-pulse">Retrieving Archives...</div>;

  return (
    <div className="p-4 pb-24 min-h-screen max-w-2xl mx-auto">
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Activity Log</h2>
        <p className="text-slate-400 text-sm font-medium">Historical task completion data</p>
      </header>

      {history.length === 0 ? (
        <div className="text-center py-20 flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-lg">
            <Clock className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-500 font-medium">No archived records found yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((entry, idx) => (
            <motion.div
              key={entry.date}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className={`glass-card overflow-hidden transition-all duration-500 border-white shadow-sm ${expandedDate === entry.date ? 'ring-2 ring-blue-500/10 shadow-xl' : ''}`}>
                <button 
                  onClick={() => setExpandedDate(expandedDate === entry.date ? null : entry.date)}
                  className="w-full p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:border-blue-500/30 transition-colors">
                      <span className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-lg font-black text-slate-900 leading-none">{new Date(entry.date).getDate()}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-900 uppercase tracking-wide">
                        {new Date(entry.date).toLocaleDateString('default', { weekday: 'long' })}
                      </p>
                      <p className="text-xs font-semibold text-slate-400">
                        {entry.tasks.length} Houses Investigated
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform duration-300 ${expandedDate === entry.date ? 'rotate-180 text-blue-400' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedDate === entry.date && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-100 bg-slate-50/30"
                    >
                      <div className="p-5 space-y-3">
                        {entry.tasks.map(task => {
                          const total = task.checklist?.length || 0;
                          const completedCount = task.checklist?.filter(i => i.completed).length || 0;
                          const allDone = total > 0 && completedCount === total;
                          const isTaskExpanded = expandedTaskId === task.id;
                          
                          return (
                            <div key={task.id} className="group/task">
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedTaskId(isTaskExpanded ? null : task.id);
                                }}
                                className={`p-4 bg-white/60 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-sm cursor-pointer ${isTaskExpanded ? 'border-blue-200 bg-white ring-4 ring-blue-50/50' : 'border-slate-100 hover:border-blue-100'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-1.5 h-8 rounded-full ${allDone ? 'premium-gradient' : 'bg-slate-200'}`} />
                                  <div>
                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                                      {getPropertyName(task.roomId || task.id, task.type)} 
                                      {task.type !== 'personal' && task.roomName && task.roomName !== 'General' && <span className="text-blue-500 ml-2">— {task.roomName}</span>}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {task.completedAt && (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                          <Clock className="w-3 h-3" /> {formatTime(task.completedAt)}
                                        </div>
                                      )}
                                      {!isTaskExpanded && (task.notes || task.type === 'personal') && (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-blue-400 uppercase tracking-wider">
                                          {task.type === 'personal' ? <User className="w-3 h-3" /> : <StickyNote className="w-3 h-3" />}
                                          {task.type === 'personal' ? 'Personal Task' : 'Note Included'}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      revertTask(task.id);
                                    }}
                                    className="w-8 h-8 rounded-lg border border-slate-100 bg-white flex items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all duration-300 group/revert"
                                    title="Put back on Dashboard"
                                  >
                                    <RotateCcw className="w-4 h-4 group-hover/revert:rotate-[-45deg] transition-transform" />
                                  </button>
                                  <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${isTaskExpanded ? 'rotate-180 text-blue-400' : ''}`} />
                                </div>
                              </div>

                              <AnimatePresence>
                                {isTaskExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="mx-4 mt-[-8px] p-5 pt-7 bg-white/80 border-x border-b border-blue-100/50 rounded-b-3xl space-y-6 shadow-xl relative z-0">
                                      
                                      {/* Full Checklist Review */}
                                      <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 px-1">Completed Actions</p>
                                        <div className="grid grid-cols-1 gap-1.5">
                                          {(task.checklist || []).map((item, i) => (
                                            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${item.completed ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-800' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${item.completed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-slate-200 bg-white'}`}>
                                                {item.completed && <Check className="w-3 h-3 text-white stroke-[4px]" />}
                                              </div>
                                              <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      {/* Full Notes Review */}
                                      {task.notes && (
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] mb-2 px-1 text-blue-600">Housekeeper Notes</p>
                                          <div className="p-4 bg-blue-50/30 border border-blue-100/50 rounded-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                              <StickyNote className="w-10 h-10 text-blue-600" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-700 leading-relaxed italic relative z-10">
                                              "{task.notes}"
                                            </p>
                                          </div>
                                        </div>
                                      )}

                                      {!task.notes && (
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest text-center py-2">No additional notes provided</p>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
