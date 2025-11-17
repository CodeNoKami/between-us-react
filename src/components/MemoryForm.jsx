import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Convert file → base64
const fileToBase64 = (file) => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
         const img = new Image();
         img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 900; // good for phones

            const scale = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // 0.7 = 70% quality (good balance)
            const compressed = canvas.toDataURL('image/jpeg', 0.7);
            resolve(compressed);
         };
         img.onerror = reject;
         img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
   });
};

export default function MemoryForm({ memory, setMemories, memories, close }) {
   const [title, setTitle] = useState(memory?.title || '');
   const [date, setDate] = useState(memory?.date || '');
   const [tags, setTags] = useState(memory?.tags?.join(', ') || '');
   const [desc, setDesc] = useState(memory?.desc || '');
   const [photos, setPhotos] = useState(memory?.photo ? memory.photo : []);
   const [favorite, setFavorite] = useState(memory?.favorite || false);

   // ⭐ FIXED: Convert images to base64 instead of blob URLs
   const handleFileChange = async (e) => {
      const files = Array.from(e.target.files);

      if (photos.length + files.length > 6) {
         alert('Maximum of 6 images allowed');
         return;
      }

      const base64Photos = await Promise.all(files.map((file) => fileToBase64(file)));

      setPhotos((prev) => [...prev, ...base64Photos]);
   };

   const removePhoto = (index) => {
      const updated = [...photos];
      updated.splice(index, 1);
      setPhotos(updated);
   };

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
         photo: photos, // now base64 images
         favorite,
      };

      if (memory) {
         setMemories(memories.map((m) => (m.id === memory.id ? newMemory : m)));
         toast.success('Memory updated!');
      } else {
         setMemories([...memories, newMemory]);
         toast.success('Memory added!');
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

            {/* Photo upload */}
            <label className="block mb-3">
               <span className="label-text">Add Photos (max 6)</span>
               <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full mt-1"
               />
            </label>

            {/* Photo preview grid */}
            {photos.length > 0 && (
               <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((photo, index) => (
                     <div key={index} className="relative rounded overflow-hidden">
                        <img
                           src={photo}
                           alt={`Memory ${index}`}
                           className="w-full h-24 object-cover rounded"
                        />
                        <button
                           type="button"
                           className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full"
                           onClick={() => removePhoto(index)}
                        >
                           <X className="size-4" />
                        </button>
                     </div>
                  ))}
               </div>
            )}

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
