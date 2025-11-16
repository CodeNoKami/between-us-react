import { differenceInDays, format } from 'date-fns';
import { Eye, Heart, Plus, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { THEMES } from '../constants/THEMES';
import useThemeStore from '../store/useThemeStore';
import MemoryCard from './MemoryCard';
import MemoryForm from './MemoryForm';

export default function Sidebar({ memories, setMemories, startDate, setStartDate }) {
   const [showMemory, setShowMemory] = useState({ isShow: false, memory: {} });
   const [showModal, setShowModal] = useState(false);
   const [editMemory, setEditMemory] = useState(null);
   const favorites = memories.filter((m) => m.favorite).slice(0, 6);

   const { theme, setTheme } = useThemeStore();

   const totalMemories = memories.length;
   const daysTogether = differenceInDays(new Date(), new Date(startDate));

   const handleAdd = () => {
      setEditMemory(null);
      setShowModal(true);
   };

   const handleEdit = (memory) => {
      setEditMemory(memory);
      setShowModal(true);
   };

   const handleViewModel = (memory) => {
      setShowMemory({ isShow: true, memory });
   };

   const handleStartDateChange = (e) => setStartDate(e.target.value);

   return (
      <aside className="bg-base-200 p-4 rounded-lg flex flex-col gap-4 shadow-md">
         <div className="flex items-center gap-3 mb-4">
            <div className="bg-linear-to-tr from-primary to-secondary text-primary-content w-12 h-12 rounded-lg grid place-items-center font-bold">
               BT
            </div>
            <div>
               <h1 className="text-lg font-bold text-base-content">Been Together</h1>
               <p className="text-xs text-base-content/60">
                  Memories timeline for two — sweet, simple, private
               </p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-base-300 rounded p-2">
               <small className="text-base-content/60">Total memories</small>
               <div className="font-bold text-base-content">{totalMemories}</div>
            </div>
            <div className="bg-base-300 rounded p-2">
               <small className="text-base-content/60">Days together</small>
               <div className="font-bold text-base-content">{daysTogether}</div>
            </div>
         </div>

         <button className="btn btn-primary w-full" onClick={handleAdd}>
            <Plus className="size-5" /> Add memory
         </button>

         <div>
            <div className="text-base-content/60 text-xs mb-1">Relationship start</div>
            <input
               type="date"
               value={startDate}
               onChange={handleStartDateChange}
               className="input input-bordered w-full bg-base-300 text-base-content"
            />
         </div>
         <div>
            <div className="text-base-content/60 text-xs mb-1">App Themes</div>
            <div className="max-h-40 p-2 overflow-y-scroll grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 gap-2">
               {THEMES.map((t, i) => (
                  <button
                     key={t}
                     className={`
                  group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-colors cursor-pointer
                  ${theme === t ? 'ring-2' : 'hover:bg-base-200'}
                  `}
                     onClick={() => setTheme(t)}
                  >
                     <div className="relative h-8 w-full rounded-md overflow-hidden" data-theme={t}>
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                           <div className="rounded bg-primary"></div>
                           <div className="rounded bg-secondary"></div>
                           <div className="rounded bg-accent"></div>
                           <div className="rounded bg-neutral"></div>
                        </div>
                     </div>
                     <span className="text-[11px] font-medium truncate w-full text-center">
                        <span className="badge badge-primary badge-soft badge-xs mr-2">
                           {i + 1}{' '}
                        </span>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                     </span>
                  </button>
               ))}
            </div>
         </div>

         <div>
            <div className="text-base-content/60 text-xs mb-1">Your favourites</div>

            {favorites.length === 0 ? (
               <div className="text-base-content/60 text-sm">
                  No favorites yet — mark memories with{' '}
                  <Heart className="size-4 text-rose-500 inline-block" fill="#f43f5e" />
               </div>
            ) : (
               favorites.map((mem) => (
                  <div
                     key={mem.id}
                     className="flex justify-between items-center gap-2 bg-base-300 p-2 rounded mb-1"
                  >
                     <div className="truncate text-base-content">
                        {mem.title} • {format(new Date(mem.date), 'MMM d, yyyy')}
                     </div>

                     <div className="flex">
                        <button
                           className="btn btn-ghost btn-xs"
                           onClick={() => handleViewModel(mem)}
                        >
                           <Eye className="size-4" />
                        </button>
                        <button className="btn btn-ghost btn-xs" onClick={() => handleEdit(mem)}>
                           <SquarePen className="size-4" />
                        </button>
                     </div>
                  </div>
               ))
            )}
         </div>

         {showModal && (
            <MemoryForm
               memory={editMemory}
               setMemories={setMemories}
               memories={memories}
               close={() => setShowModal(false)}
            />
         )}

         {showMemory.isShow && (
            <MemoryCard
               memory={showMemory.memory}
               close={() => setShowMemory({ isShow: false, memory: {} })}
            />
         )}
      </aside>
   );
}
