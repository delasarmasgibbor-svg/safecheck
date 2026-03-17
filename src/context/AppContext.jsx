import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const AppContext = createContext();

export function useAppContext() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [properties, setProperties] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [personalTasks, setPersonalTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // 1. Listen to all Properties (Houses)
  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('propertyName'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const propsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Universal Task Listener (Dashboard + History)
  useEffect(() => {
    const q = query(collection(db, 'tasks'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allTasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Update Today's Property Tasks
      const todayProps = allTasks.filter(t => t.date === today && t.type === 'property');
      setTodayTasks(todayProps);

      // Update All Personal Tasks (including ones from other days)
      const pTasks = allTasks.filter(t => t.type === 'personal');
      setPersonalTasks(pTasks);

      // Update History (Completed tasks)
      const completedTasks = allTasks
        .filter(t => t.status === 'completed')
        .sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0));

      const grouped = completedTasks.reduce((acc, task) => {
        if (!acc[task.date]) acc[task.date] = { date: task.date, tasks: [] };
        acc[task.date].tasks.push(task);
        return acc;
      }, {});
      
      setHistory(Object.values(grouped).slice(0, 30));
    });
    return () => unsubscribe();
  }, [today]);

  const addProperty = async (prop) => {
    try {
      await addDoc(collection(db, 'properties'), {
        ...prop,
        active: true,
        createdAt: serverTimestamp(),
        rooms: prop.rooms || [],
        defaultTasks: prop.defaultTasks || ['Grab items (What item or items)', 'Check if the property is clean', 'Drop off(what item or items)']
      });
    } catch (err) {
      console.error("Error adding property:", err);
    }
  };

  const deleteProperty = async (id) => {
    try {
      await deleteDoc(doc(db, 'properties', id));
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const toggleActiveProperty = async (id) => {
    const prop = properties.find(p => p.id === id);
    if (!prop) return;
    try {
      await updateDoc(doc(db, 'properties', id), {
        active: !prop.active
      });
    } catch (err) {
      console.error("Error toggling property:", err);
    }
  };

  const updateProperty = async (id, data) => {
    try {
      await updateDoc(doc(db, 'properties', id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update today's tasks if rooms or defaultTasks changed
      if (data.rooms || data.defaultTasks) {
        const propTasks = todayTasks.filter(t => t.roomId === id);
        for (const task of propTasks) {
          const room = (data.rooms || []).find(r => r.id === task.roomSpecificId) || { roomName: 'General' };
          const newChecklist = (data.defaultTasks || []).map(label => {
            const existing = task.checklist.find(c => c.label === label);
            return { label, completed: existing ? existing.completed : false };
          });
          
          await updateDoc(doc(db, 'tasks', task.id), {
            roomName: room.roomName,
            checklist: newChecklist
          });
        }
      }
    } catch (err) {
      console.error("Error updating property:", err);
    }
  };

  const updateTask = async (taskKey, updates) => {
    // taskKey can be houseId_roomId OR a personal_ID
    const isPersonal = taskKey.startsWith('personal_');
    const taskId = isPersonal ? taskKey : `${taskKey}_${today}`;
    
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const allTaskItems = [...todayTasks, ...personalTasks];
      const existing = allTaskItems.find(t => t.id === taskId);
      
      if (existing) {
        await updateDoc(taskRef, {
          ...updates,
          lastUpdated: serverTimestamp()
        });
      } else if (!isPersonal) {
        // Only auto-create property tasks
        const [houseId, roomSpecificId] = taskKey.split('_');
        const property = properties.find(p => p.id === houseId);
        const room = (property?.rooms || []).find(r => r.id === roomSpecificId) || { roomName: 'General' };
        
        const houseTasks = property?.defaultTasks || [];
        const roomTasks = room?.tasks || [];
        const combinedTasks = Array.from(new Set([...houseTasks, ...roomTasks]));
        const checklist = combinedTasks.map(label => ({ label, completed: false }));
        
        await setDoc(taskRef, {
          roomId: houseId,
          roomSpecificId,
          roomName: room.roomName,
          propertyName: property?.propertyName || 'Unknown House',
          date: today,
          status: 'active',
          checklist,
          notes: '',
          type: 'property',
          ...updates,
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const addPersonalTask = async (label) => {
    const id = `personal_${Date.now()}`;
    try {
      await setDoc(doc(db, 'tasks', id), {
        id,
        label,
        type: 'personal',
        status: 'active',
        date: today,
        notes: '',
        checklist: [{ label, completed: false }],
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error adding personal task:", err);
    }
  };

  const deletePersonalTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      console.error("Error deleting personal task:", err);
    }
  };

  const submitTask = async (id) => {
    const isPersonal = id.startsWith('personal_');
    const taskId = isPersonal ? id : `${id}_${today}`;
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: 'completed',
        completedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error submitting task:", err);
    }
  };

  const revertTask = async (taskId) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: 'active',
        revertedAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Error reverting task:", err);
    }
  };

  const getTaskForRoom = (houseId, roomSpecificId) => {
    const property = properties.find(p => p.id === houseId);
    const room = (property?.rooms || []).find(r => r.id === roomSpecificId) || { roomName: 'General' };
    const taskId = `${houseId}_${roomSpecificId}_${today}`;
    const savedTask = todayTasks.find(t => t.id === taskId);
    
    if (savedTask) return savedTask;
    
    const houseTasks = property?.defaultTasks || [];
    const roomTasks = room?.tasks || [];
    const combinedTasks = Array.from(new Set([...houseTasks, ...roomTasks]));

    return {
      id: taskId,
      roomId: houseId,
      roomSpecificId,
      roomName: room.roomName,
      checklist: combinedTasks.map(label => ({ label, completed: false })),
      notes: '',
      status: 'active'
    };
  };

  const val = {
    properties, todayTasks, personalTasks, addProperty, deleteProperty, toggleActiveProperty, updateProperty,
    updateTask, submitTask, revertTask, getTaskForRoom, addPersonalTask, deletePersonalTask, history, loading
  };

  return <AppContext.Provider value={val}>{children}</AppContext.Provider>;
}

