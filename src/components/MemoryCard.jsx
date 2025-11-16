import { X } from 'lucide-react';

const MemoryCard = ({ memory, close }) => {
   if (!memory) return null;

   return (
      <div className="modal modal-open">
         <div className="modal-box relative rounded-xl">
            {/* Close Button */}
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={close}>
               <X className="size-4" />
            </button>

            {/* Photos */}
            {memory.photo && memory.photo.length > 0 ? (
               <div className="flex gap-2 p-2 overflow-x-auto mb-3">
                  {memory.photo.map((p, index) => {
                     return (
                        <img
                           key={index}
                           src={p}
                           alt={`Memory ${index}`}
                           className="rounded max-h-60 w-60 object-cover shadow-sm shrink-0"
                        />
                     );
                  })}
               </div>
            ) : (
               <div className="h-40 flex items-center justify-center opacity-60 mb-3">No photo</div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold">{memory.title}</h2>

            {/* Date */}
            <p className="opacity-60 text-sm mb-2">{new Date(memory.date).toLocaleDateString()}</p>

            {/* Description */}
            <p className="mb-3">{memory.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
               {memory.tags?.map((tag) => (
                  <span key={tag} className="badge badge-outline px-3 py-2">
                     #{tag}
                  </span>
               ))}
            </div>
         </div>

         {/* Backdrop (click to close) */}
         <div className="modal-backdrop" onClick={close}></div>
      </div>
   );
};

export default MemoryCard;
