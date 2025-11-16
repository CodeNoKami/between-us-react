import { X } from 'lucide-react';
import { Fade } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const MemoryCard = ({ memory, close }) => {
   if (!memory) return null;

   return (
      <div className="modal modal-open">
         <div className="modal-box relative rounded-xl">
            {/* Close Button */}
            <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={close}>
               <X className="size-4" />
            </button>

            {/* Photo Slideshow */}
            {memory.photo && memory.photo.length > 0 ? (
               <div className="mb-4 mt-6 rounded overflow-hidden">
                  <Fade duration={2500} transitionDuration={500} arrows={true}>
                     {memory.photo.map((p, index) => (
                        <div key={index} className="w-full flex justify-center">
                           <img
                              src={p}
                              alt={`Memory ${index}`}
                              className="max-h-60 w-full object-cover rounded-md shadow"
                           />
                        </div>
                     ))}
                  </Fade>
               </div>
            ) : (
               <div className="h-40 flex items-center justify-center opacity-60 mb-3">No photo</div>
            )}

            {/* Thumbnails */}
            {memory.photo && memory.photo.length > 0 && (
               <div className="mb-3 flex gap-2 justify-center">
                  {memory.photo.map((p, idx) => (
                     <div key={idx} className="size-8 rounded-md overflow-hidden">
                        <img
                           src={p}
                           alt={`Thumbnail ${idx}`}
                           className="w-full h-full object-cover"
                        />
                     </div>
                  ))}
               </div>
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

         {/* Backdrop */}
         <div className="modal-backdrop" onClick={close}></div>
      </div>
   );
};

export default MemoryCard;
