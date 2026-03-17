import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Trash2, Plus, Key, Hash, ChevronRight, Layout, Zap, Shield, Home, Edit2, Save, X, Check } from 'lucide-react';
import { Switch } from '../components/ui/Switch';
import { motion, AnimatePresence } from 'framer-motion';


const TASK_SUGGESTIONS = [
  'Grab items (What item or items)', 
  'Check if the property is clean', 
  'Drop off(what item or items)'
];

const PropertyCard = ({ p, idx }) => {
  const { deleteProperty, toggleActiveProperty, updateProperty } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    propertyName: p.propertyName,
    garageCode: p.garageCode || '',
    mainDoorCode: p.mainDoorCode || '',
    keyNumber: p.keyNumber || '',
    rooms: p.rooms || [],
    defaultTasks: p.defaultTasks || []
  });
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [newRoomTaskLabels, setNewRoomTaskLabels] = useState({}); // { roomId: '' }

  const handleUpdate = async () => {
    await updateProperty(p.id, {
      ...editData,
      defaultTasks: editData.defaultTasks
    });
    setIsEditing(false);
  };

  const addDefaultTask = () => {
    if (!newTaskLabel.trim()) return;
    if (editData.defaultTasks.includes(newTaskLabel.trim())) return;
    setEditData({
      ...editData,
      defaultTasks: [...editData.defaultTasks, newTaskLabel.trim()]
    });
    setNewTaskLabel('');
  };

  const removeDefaultTask = (label) => {
    setEditData({
      ...editData,
      defaultTasks: editData.defaultTasks.filter(t => t !== label)
    });
  };

  const addRoom = () => {
    setEditData({
      ...editData,
      rooms: [...editData.rooms, { id: Math.random().toString(36).substr(2, 9), roomName: '', keyNumber: '', roomCode: '' }]
    });
  };

  const removeRoom = (roomId) => {
    setEditData({
      ...editData,
      rooms: editData.rooms.filter(r => r.id !== roomId)
    });
  };

  const updateRoom = (roomId, field, value) => {
    setEditData({
      ...editData,
      rooms: editData.rooms.map(r => r.id === roomId ? { ...r, [field]: value } : r)
    });
  };

  const addRoomTask = (roomId) => {
    const label = newRoomTaskLabels[roomId] || '';
    if (!label.trim()) return;
    setEditData({
      ...editData,
      rooms: editData.rooms.map(r => {
        if (r.id === roomId) {
          const tasks = r.tasks || [];
          if (tasks.includes(label.trim())) return r;
          return { ...r, tasks: [...tasks, label.trim()] };
        }
        return r;
      })
    });
    setNewRoomTaskLabels({ ...newRoomTaskLabels, [roomId]: '' });
  };

  const removeRoomTask = (roomId, label) => {
    setEditData({
      ...editData,
      rooms: editData.rooms.map(r => {
        if (r.id === roomId) {
          return { ...r, tasks: (r.tasks || []).filter(t => t !== label) };
        }
        return r;
      })
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.05 }}
    >
      <Card className={`glass-card p-5 group flex flex-col border-slate-100 shadow-sm transition-all duration-300 ${p.active ? 'bg-white' : 'opacity-40 grayscale'} ${isEditing ? 'ring-2 ring-blue-500/20 border-blue-200' : ''}`}>
        <div className="flex items-start justify-between w-full mb-4">
          <div className="flex gap-4 flex-1">
            <div className="mt-1">
               <Switch checked={p.active} onCheckedChange={() => toggleActiveProperty(p.id)} />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <Input 
                  value={editData.propertyName}
                  onChange={e => setEditData({...editData, propertyName: e.target.value})}
                  className="h-10 text-lg font-black uppercase tracking-tight bg-slate-50"
                  placeholder="Property Name"
                />
              ) : (
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.propertyName}</h3>
              )}
            </div>
          </div>
          
          <div className="flex gap-1 ml-4">
            {isEditing ? (
              <>
                <Button size="icon" variant="ghost" onClick={handleUpdate} className="text-emerald-500 hover:bg-emerald-50 rounded-xl w-9 h-9">
                  <Check className="w-5 h-5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(false)} className="text-slate-400 hover:bg-slate-50 rounded-xl w-9 h-9">
                   <X className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl w-9 h-9 opacity-0 group-hover:opacity-100 transition-all">
                  <Edit2 className="w-4.5 h-4.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteProperty(p.id)} className="text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 rounded-xl w-9 h-9 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="w-4.5 h-4.5" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* House Access */}
          {/* House Access Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Key #</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                {isEditing ? (
                  <Input 
                    value={editData.keyNumber}
                    onChange={e => setEditData({...editData, keyNumber: e.target.value})}
                    className="pl-10 h-11 bg-slate-50 font-mono text-sm text-amber-600 border-amber-100"
                    placeholder="Physical Key ID"
                  />
                ) : (
                  <div className="pl-10 py-3 bg-amber-50/30 rounded-2xl text-sm font-black text-amber-700 min-h-[44px] flex items-center shadow-inner border border-amber-100">
                    {p.keyNumber || 'NO KEY'}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Garage Code</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                {isEditing ? (
                  <Input 
                    value={editData.garageCode}
                    onChange={e => setEditData({...editData, garageCode: e.target.value})}
                    className="pl-10 h-11 bg-slate-50 font-mono text-sm"
                  />
                ) : (
                  <div className="pl-10 py-3 bg-slate-50/50 rounded-2xl text-sm font-mono text-slate-700 min-h-[44px] flex items-center shadow-inner">
                    {p.garageCode || '—'}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Main Door Code</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                {isEditing ? (
                  <Input 
                    value={editData.mainDoorCode}
                    onChange={e => setEditData({...editData, mainDoorCode: e.target.value})}
                    className="pl-10 h-11 bg-slate-50 font-mono text-sm"
                  />
                ) : (
                  <div className="pl-10 py-3 bg-slate-50/50 rounded-2xl text-sm font-mono text-slate-700 min-h-[44px] flex items-center shadow-inner">
                    {p.mainDoorCode || '—'}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rooms List */}
          <div className="space-y-3">
             <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Individual Rooms</label>
                {isEditing && (
                  <Button onClick={addRoom} variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-wider text-blue-600 hover:bg-blue-50 rounded-lg">
                    <Plus className="w-3 h-3 mr-1" /> Add Room
                  </Button>
                )}
             </div>
             
             <div className="space-y-2">
                {(isEditing ? editData.rooms : p.rooms || []).map((room, rIdx) => (
                  <div key={room.id} className="p-4 bg-slate-50/50 border border-slate-100 rounded-2xl relative group/room">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input 
                            value={room.roomName}
                            onChange={e => updateRoom(room.id, 'roomName', e.target.value)}
                            placeholder="Room name (e.g. Master)"
                            className="h-9 text-xs font-bold"
                          />
                          <Button size="icon" variant="ghost" onClick={() => removeRoom(room.id)} className="h-9 w-9 text-rose-400 hover:bg-rose-50 rounded-xl">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                           <div className="relative">
                              <Key className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                              <Input 
                                value={room.keyNumber}
                                onChange={e => updateRoom(room.id, 'keyNumber', e.target.value)}
                                placeholder="Key #"
                                className="pl-8 h-8 text-xs font-bold text-amber-600"
                              />
                           </div>
                           <div className="relative">
                              <Zap className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                              <Input 
                                value={room.roomCode}
                                onChange={e => updateRoom(room.id, 'roomCode', e.target.value)}
                                placeholder="Access Code"
                                className="pl-8 h-8 text-xs font-mono"
                              />
                           </div>
                        </div>

                        {/* Room Specific Task Addition */}
                        <div className="space-y-2 mt-2 pt-2 border-t border-slate-100">
                           <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Room Specific Checklist</p>
                           <div className="flex flex-wrap gap-1.5 min-h-[20px]">
                              {(room.tasks || []).map(t => (
                                <div key={t} className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold border border-blue-100">
                                  {t}
                                  <button type="button" onClick={() => removeRoomTask(room.id, t)} className="hover:text-rose-500 transition-colors"><X className="w-2.5 h-2.5" /></button>
                                </div>
                              ))}
                           </div>
                           
                           <div className="flex flex-wrap gap-1 px-1 py-1">
                             {TASK_SUGGESTIONS.map(s => (
                               <button
                                 key={s}
                                 type="button"
                                 onClick={() => {
                                   if (!(room.tasks || []).includes(s)) {
                                     setEditData({
                                       ...editData,
                                       rooms: editData.rooms.map(r => r.id === room.id ? { ...r, tasks: [...(r.tasks || []), s] } : r)
                                     });
                                   }
                                 }}
                                 className="px-1.5 py-0.5 rounded-md border border-slate-100 text-[8px] font-black uppercase tracking-wider text-slate-300 hover:border-blue-100 hover:text-blue-500 hover:bg-blue-50 transition-all"
                               >
                                 + {s}
                               </button>
                             ))}
                           </div>

                           <div className="flex gap-2">
                              <Input 
                                placeholder="Add room task..."
                                className="h-8 text-[10px] bg-white"
                                value={newRoomTaskLabels[room.id] || ''}
                                onChange={e => setNewRoomTaskLabels({...newRoomTaskLabels, [room.id]: e.target.value})}
                                onKeyDown={e => e.key === 'Enter' && addRoomTask(room.id)}
                              />
                              <Button type="button" size="sm" onClick={() => addRoomTask(room.id)} className="h-8 px-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-100 shadow-sm transition-all">
                                 <Plus className="w-3.5 h-3.5" />
                              </Button>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">{room.roomName || 'Unnamed Room'}</p>
                           <div className="flex gap-2">
                              {room.keyNumber && (
                                <span className="text-[9px] font-black text-amber-600 flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded-lg border border-amber-100">
                                   <Key className="w-2.5 h-2.5" /> {room.keyNumber}
                                </span>
                              )}
                              {room.roomCode && (
                                <span className="text-[9px] font-black text-blue-600 flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded-lg border border-blue-100 font-mono">
                                   <Zap className="w-2.5 h-2.5" /> {room.roomCode}
                                </span>
                              )}
                           </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-200" />
                      </div>
                    )}
                  </div>
                ))}
                
                {(!isEditing && (!p.rooms || p.rooms.length === 0)) && (
                   <p className="text-[10px] text-slate-400 italic text-center py-2">No rooms added yet</p>
                )}
             </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2 mb-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl min-h-[50px]">
              {(isEditing ? editData.defaultTasks : p.defaultTasks || []).map(t => (
                <div key={t} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${isEditing ? 'bg-white border-slate-200 text-slate-600 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'}`}>
                  {t}
                  {isEditing && (
                    <button onClick={() => removeDefaultTask(t)} className="text-slate-300 hover:text-rose-500">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {(!isEditing && (!p.defaultTasks || p.defaultTasks.length === 0)) && <span className="text-[10px] text-slate-400 italic">No tasks added yet</span>}
              {(isEditing && editData.defaultTasks.length === 0) && <span className="text-[10px] text-slate-400 italic font-medium">Add some tasks below</span>}
            </div>
            
            {isEditing && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5 px-1">
                  {TASK_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        if (!editData.defaultTasks.includes(s)) {
                          setEditData({...editData, defaultTasks: [...editData.defaultTasks, s]});
                        }
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-400 hover:border-blue-200 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    value={newTaskLabel}
                    onChange={e => setNewTaskLabel(e.target.value)}
                    placeholder="New general task..."
                    className="h-10 bg-slate-50 text-xs font-bold"
                    onKeyDown={e => e.key === 'Enter' && addDefaultTask()}
                  />
                  <Button onClick={addDefaultTask} className="h-10 px-4 bg-slate-900 text-white rounded-xl">
                     <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {!isEditing && (
              <div className="space-y-3 mt-2">
                <div className="flex flex-wrap gap-1.5 px-1">
                  {TASK_SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={async () => {
                        if (!(p.defaultTasks || []).includes(s)) {
                          const updatedTasks = [...(p.defaultTasks || []), s];
                          await updateProperty(p.id, { defaultTasks: updatedTasks });
                        }
                      }}
                      className="px-2 py-1 rounded-lg border border-slate-100 text-[9px] font-black uppercase tracking-wider text-slate-300 hover:border-blue-100 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Quick add house task..."
                    className="h-9 bg-white text-[10px] font-bold border-slate-100"
                    value={newTaskLabel}
                    onChange={e => setNewTaskLabel(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && newTaskLabel.trim()) {
                        const updatedTasks = [...(p.defaultTasks || []), newTaskLabel.trim()];
                        await updateProperty(p.id, { defaultTasks: updatedTasks });
                        setNewTaskLabel('');
                      }
                    }}
                  />
                  <Button 
                    onClick={async () => {
                      if (!newTaskLabel.trim()) return;
                      const updatedTasks = [...(p.defaultTasks || []), newTaskLabel.trim()];
                      await updateProperty(p.id, { defaultTasks: updatedTasks });
                      setNewTaskLabel('');
                    }}
                    className="h-9 px-3 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
                    variant="ghost"
                    size="sm"
                  >
                     <Plus className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export function PropertyManager() {
  const { properties, addProperty, loading } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [accessMode, setAccessMode] = useState('both'); 
  const [searchQuery, setSearchQuery] = useState('');
  const [newHouse, setNewHouse] = useState({ 
    propertyName: '', 
    garageCode: '', 
    mainDoorCode: '', 
    keyNumber: '',
    rooms: [],
    defaultTasks: ['Grab items (What item or items)', 'Check if the property is clean', 'Drop off(what item or items)']
  });
  const [newHouseTaskLabel, setNewHouseTaskLabel] = useState('');
  const [newHouseRoomTaskLabels, setNewHouseRoomTaskLabels] = useState({});

  const handleAddRoom = () => {
    setNewHouse({
      ...newHouse,
      rooms: [...newHouse.rooms, { id: Math.random().toString(36).substr(2, 9), roomName: '', keyNumber: '', roomCode: '' }]
    });
  };

  const removeRoom = (id) => {
    setNewHouse({
      ...newHouse,
      rooms: newHouse.rooms.filter(r => r.id !== id)
    });
  };

  const updateRoom = (id, field, value) => {
    setNewHouse({
      ...newHouse,
      rooms: newHouse.rooms.map(r => r.id === id ? { ...r, [field]: value } : r)
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newHouse.propertyName.trim()) return;
    
    await addProperty({
      ...newHouse,
      accessMode,
      defaultTasks: newHouse.defaultTasks
    });
    
    setNewHouse({ 
      propertyName: '',
      garageCode: '',
      mainDoorCode: '', 
      keyNumber: '',
      rooms: [],
      defaultTasks: ['Grab items (What item or items)', 'Check if the property is clean', 'Drop off(what item or items)']
    });
    setNewHouseTaskLabel('');
    setNewHouseRoomTaskLabels({});
    setIsAdding(false);
  };

  // Search/Filter logic
  const filteredProperties = properties.filter(p => 
    (p.propertyName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (String(p.keyNumber || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) return <div className="p-8 text-center text-slate-500 font-display animate-pulse">Loading Asset Portfolio...</div>;

  return (
    <div className="p-4 pb-24 min-h-screen max-w-2xl mx-auto">
      <header className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Your Assets</h2>
            <p className="text-slate-400 text-sm font-medium mt-1">Manage 50+ shared accommodations</p>
          </div>
          <Button 
            onClick={() => setIsAdding(!isAdding)} 
            className={`rounded-2xl h-12 px-6 font-bold transition-all shadow-lg ${isAdding ? 'bg-slate-200 text-slate-900' : 'premium-gradient text-white shadow-blue-500/10'}`}
          >
            {isAdding ? 'Cancel' : <><Plus className="w-5 h-5 mr-2" /> Add House</>}
          </Button>
        </div>

        {/* Search Bar */}
        {!isAdding && (
          <div className="relative group">
            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Search properties by name or key #..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-medium text-slate-900"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </header>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="mb-8 glass-panel border-blue-500/10 p-6 overflow-hidden relative shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Home className="w-40 h-40 text-slate-900" />
              </div>
              
              <form onSubmit={handleCreate} className="relative z-10 space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block">House Name</label>
                    <Input 
                      autoFocus
                      placeholder="e.g. Fahey St Executive" 
                      className="h-14 bg-slate-50 border-slate-100 text-xl font-black placeholder:text-slate-300 italic"
                      value={newHouse.propertyName}
                      onChange={e => setNewHouse({...newHouse, propertyName: e.target.value})}
                    />
                  </div>

                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-2xl flex gap-1 shadow-inner">
                    {['key', 'code', 'both'].map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setAccessMode(mode)}
                        className={`flex-1 py-3 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${accessMode === mode ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        {mode === 'both' ? 'Hybrid' : mode === 'key' ? 'Keys Only' : 'Codes Only'}
                      </button>
                    ))}
                  </div>

                  {/* House Level Access */}
                  <div className="grid grid-cols-2 gap-4">
                     {(accessMode === 'key' || accessMode === 'both') && (
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">House Key #</label>
                          <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input 
                              className="pl-10 h-12 bg-slate-50 border-slate-100 font-mono shadow-inner text-amber-600 font-black" 
                              placeholder="Key ID" 
                              value={newHouse.keyNumber} 
                              onChange={e => setNewHouse({...newHouse, keyNumber: e.target.value})} 
                            />
                          </div>
                       </div>
                     )}
                     {(accessMode === 'code' || accessMode === 'both') && (
                       <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Main Door Code</label>
                          <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <Input className="pl-10 h-12 bg-slate-50 border-slate-100 font-mono shadow-inner" placeholder="1234#" value={newHouse.mainDoorCode} onChange={e => setNewHouse({...newHouse, mainDoorCode: e.target.value})} />
                          </div>
                       </div>
                     )}
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Garage</label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                          <Input className="pl-10 h-12 bg-slate-50 border-slate-100 font-mono shadow-inner" placeholder="9988" value={newHouse.garageCode} onChange={e => setNewHouse({...newHouse, garageCode: e.target.value})} />
                        </div>
                     </div>
                  </div>

                  {/* Rooms Section */}
                  <div className="space-y-3">
                     <div className="flex items-center justify-between px-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rooms & Specific Access</label>
                        <Button type="button" onClick={handleAddRoom} variant="ghost" size="sm" className="h-8 text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50/50 hover:bg-blue-50 rounded-xl">
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Room
                        </Button>
                     </div>
                     <div className="space-y-3">
                        {newHouse.rooms.map((room) => (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={room.id} className="p-4 bg-white/50 border border-slate-100 rounded-2xl space-y-3 shadow-sm">
                             <div className="flex gap-2">
                                <Input 
                                  placeholder="Room Name (e.g. Suite 1)" 
                                  className="h-10 text-xs font-bold bg-white"
                                  value={room.roomName}
                                  onChange={e => updateRoom(room.id, 'roomName', e.target.value)}
                                />
                                <Button type="button" size="icon" variant="ghost" onClick={() => removeRoom(room.id)} className="shrink-0 text-rose-400 hover:bg-rose-50 rounded-xl">
                                   <Trash2 className="w-4 h-4" />
                                </Button>
                             </div>
                             <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                   <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                   <Input 
                                     placeholder="Key #" 
                                     className="pl-9 h-10 text-xs font-bold text-amber-600 bg-white"
                                     value={room.keyNumber}
                                     onChange={e => updateRoom(room.id, 'keyNumber', e.target.value)}
                                   />
                                </div>
                                <div className="relative">
                                   <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                                   <Input 
                                     placeholder="Code" 
                                     className="pl-9 h-10 text-xs font-mono bg-white"
                                     value={room.roomCode}
                                     onChange={e => updateRoom(room.id, 'roomCode', e.target.value)}
                                   />
                                </div>
                             </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-100 rounded-2xl min-h-[50px] shadow-inner">
                       {(newHouse.defaultTasks || []).map(t => (
                         <div key={t} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 flex items-center gap-2 shadow-sm animate-in fade-in zoom-in duration-200">
                           {t}
                           <button type="button" onClick={() => setNewHouse({...newHouse, defaultTasks: newHouse.defaultTasks.filter(task => task !== t)})} className="hover:text-rose-500 transition-colors"><X className="w-3 h-3" /></button>
                         </div>
                       ))}
                       {(!newHouse.defaultTasks || newHouse.defaultTasks.length === 0) && <span className="text-[10px] text-slate-400 font-medium italic">Click suggestions or type to add</span>}
                    </div>

                    <div className="flex flex-wrap gap-1.5 px-0.5">
                      {TASK_SUGGESTIONS.map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            if (!newHouse.defaultTasks.includes(s)) {
                              setNewHouse({...newHouse, defaultTasks: [...newHouse.defaultTasks, s]});
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                        >
                          + {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Input 
                        className="h-12 bg-white border-slate-100 text-sm font-bold shadow-sm"
                        placeholder="Type a custom task..." 
                        value={newHouseTaskLabel}
                        onChange={e => setNewHouseTaskLabel(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (newHouseTaskLabel.trim() && !newHouse.defaultTasks.includes(newHouseTaskLabel.trim())) {
                              setNewHouse({...newHouse, defaultTasks: [...newHouse.defaultTasks, newHouseTaskLabel.trim()]});
                              setNewHouseTaskLabel('');
                            }
                          }
                        }}
                      />
                      <Button 
                        type="button"
                        onClick={() => {
                          if (newHouseTaskLabel.trim() && !newHouse.defaultTasks.includes(newHouseTaskLabel.trim())) {
                            setNewHouse({...newHouse, defaultTasks: [...newHouse.defaultTasks, newHouseTaskLabel.trim()]});
                            setNewHouseTaskLabel('');
                          }
                        }} 
                        className="h-12 premium-gradient text-white rounded-xl font-black uppercase tracking-widest px-6"
                      >
                         Add Task
                      </Button>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 text-lg font-black premium-gradient shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all rounded-2xl">
                  Register Asset Portfolio
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {filteredProperties.map((p, idx) => (
          <PropertyCard key={p.id} p={p} idx={idx} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center shadow-lg">
            <Home className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-1">
            <p className="text-slate-900 font-bold text-lg">{searchQuery ? 'No matching properties' : 'No houses registered'}</p>
            <p className="text-slate-400 text-sm">{searchQuery ? 'Try a different search term' : 'Start by adding your first property.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}

