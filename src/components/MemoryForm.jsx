import { useState } from 'react';

export default function MemoryForm({ memory, setMemories, memories, close }) {
   const [title, setTitle] = useState(memory?.title || '');
   const [date, setDate] = useState(memory?.date || '');
   const [tags, setTags] = useState(memory?.tags?.join(', ') || '');
   const [desc, setDesc] = useState(memory?.desc || '');
   const [photo, setPhoto] = useState(memory?.photo || '');
   const [favorite, setFavorite] = useState(memory?.favorite || false);

   const handleSubmit = (e) => {
      e.preventDefault();
      if (!title || !date) return alert('Title and date required');

      const newMemory = {
         id: memory?.id || Math.random().toString(36).slice(2, 10),
         title,
         date,
         tags: tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
         desc,
         photo,
         favorite,
      };

      if (memory) {
         setMemories(memories.map((m) => (m.id === memory.id ? newMemory : m)));
      } else {
         setMemories([...memories, newMemory]);
      }
      close();
   };

   return (
      <div className="modal modal-open" onClick={close}>
         <form
            className="modal-box bg-base-200 text-base-content rounded-xl"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
         >
            <h3 className="text-lg font-bold mb-2">{memory ? 'Edit Memory' : 'Add Memory'}</h3>

            <input
               className="input input-bordered w-full mb-3"
               placeholder="Title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
            />

            <input
               className="input input-bordered w-full mb-3"
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
            />

            <input
               className="input input-bordered w-full mb-3"
               placeholder="Tags, comma separated"
               value={tags}
               onChange={(e) => setTags(e.target.value)}
            />

            <textarea
               className="textarea textarea-bordered w-full mb-3"
               placeholder="Note"
               value={desc}
               onChange={(e) => setDesc(e.target.value)}
            />

            <input
               className="input input-bordered w-full mb-3"
               placeholder="Photo URL"
               value={photo}
               onChange={(e) => setPhoto(e.target.value)}
            />

            <label className="flex items-center gap-3 mb-3 cursor-pointer">
               <input
                  type="checkbox"
                  checked={favorite}
                  onChange={(e) => setFavorite(e.target.checked)}
                  className="checkbox checkbox-primary"
               />
               <span>Favorite</span>
            </label>

            <div className="flex justify-end gap-2 mt-4">
               <button type="button" className="btn btn-ghost" onClick={close}>
                  Cancel
               </button>
               <button type="submit" className="btn btn-primary">
                  {memory ? 'Save' : 'Add'}
               </button>
            </div>
         </form>

         <button className="modal-backdrop" onClick={close}></button>
      </div>
   );
}
