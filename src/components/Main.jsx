/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { format } from 'date-fns';
import { Eye, Heart, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import MemoryCard from './MemoryCard';
import MemoryForm from './MemoryForm';

export default function Main({ memories, setMemories, startDate }) {
   const [showMemory, setShowMemory] = useState({ isShow: false, memory: {} });
   const [showModal, setShowModal] = useState(false);
   const [editMemory, setEditMemory] = useState(null);
   const [tagFilters, setTagFilters] = useState(['all']);
   const [search, setSearch] = useState('');
   const [sort, setSort] = useState('new');
   const [filter, setFilter] = useState('all');

   const filtered = memories
      .filter((m) => {
         if (filter !== 'all' && !m.tags.includes(filter)) return false;

         const text = search.toLowerCase();
         return (
            m.title.toLowerCase().includes(text) ||
            (m.desc || '').toLowerCase().includes(text) ||
            (m.tags || []).join(' ').toLowerCase().includes(text)
         );
      })
      .sort((a, b) =>
         sort === 'new' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date)
      );

   useEffect(() => {
      const tags = memories.flatMap((m) => m.tags);
      setTagFilters(['all', ...new Set(tags)]);
   }, [memories]);

   const handleDelete = (id) => {
      if (window.confirm('Delete this memory?')) {
         setMemories(memories.filter((m) => m.id !== id));
      }
   };

   const toggleFavorite = (id) => {
      setMemories(memories.map((m) => (m.id === id ? { ...m, favorite: !m.favorite } : m)));
   };

   const handleEdit = (memory) => {
      setEditMemory(memory);
      setShowModal(true);
   };

   const handleViewModel = (memory) => {
      setShowMemory({ isShow: true, memory });
   };

   return (
      <main>
         {/* Header filters */}
         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="text-2xl font-bold text-base-content">{filtered.length} Memories</div>

            <div className="flex gap-2">
               <select
                  className="select select-bordered bg-base-300 text-base-content"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
               >
                  {tagFilters.map((tf) => (
                     <option key={tf} value={tf}>
                        {tf}
                     </option>
                  ))}
               </select>

               <input
                  className="input input-bordered bg-base-300 text-base-content w-60"
                  placeholder="Search memories"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />

               <select
                  className="select select-bordered bg-base-300 text-base-content"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
               >
                  <option value="new">Newest</option>
                  <option value="old">Oldest</option>
               </select>
            </div>
         </div>

         {/* Empty state */}
         {filtered.length === 0 ? (
            <div className="bg-base-200 p-6 rounded text-center text-base-content/60">
               No memories yet.
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {filtered.map((mem) => (
                  <div
                     key={mem.id}
                     className="card bg-base-200 rounded-lg p-3 shadow overflow-hidden"
                  >
                     {/* ---------- SLIDER ADDED HERE ---------- */}
                     {mem.photo.length > 0 ? (
                        <Slide duration={2200} transitionDuration={500} arrows={true}>
                           {mem.photo.map((p, index) => (
                              <div key={index} className="w-full flex justify-center">
                                 <img
                                    src={p}
                                    alt={`Memory ${index}`}
                                    className="rounded h-40 w-full object-cover shadow-sm mb-2"
                                 />
                              </div>
                           ))}
                        </Slide>
                     ) : (
                        <div className="h-40 flex items-center justify-center text-base-content/60">
                           No photo
                        </div>
                     )}

                     <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-base-content">
                           {mem.title.length > 20 ? mem.title.slice(0, 20) + '...' : mem.title}
                        </h3>

                        <button onClick={() => toggleFavorite(mem.id)}>
                           {mem.favorite ? (
                              <Heart className="size-4 text-rose-500" fill="#f43f5e" />
                           ) : (
                              <Heart className="size-4 text-base-content" />
                           )}
                        </button>
                     </div>

                     <p className="text-base-content/60 text-sm">
                        {format(new Date(mem.date), 'MMM d, yyyy')}
                     </p>

                     <p className="text-base-content/60 mt-1">
                        {mem.desc.length > 20 ? mem.desc.slice(0, 20) + '...' : mem.desc}
                     </p>

                     {/* Card actions */}
                     <div className="flex justify-between mt-2 gap-2">
                        <button
                           className="btn btn-sm btn-info"
                           onClick={() => handleViewModel(mem)}
                        >
                           <Eye className="size-4" />
                        </button>

                        <div className="flex gap-2">
                           <button
                              className="btn btn-warning btn-sm"
                              onClick={() => handleEdit(mem)}
                           >
                              <SquarePen className="size-4" />
                           </button>

                           <button
                              className="btn btn-sm btn-error"
                              onClick={() => handleDelete(mem.id)}
                           >
                              <Trash2 className="size-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* Modals */}
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
      </main>
   );
}
