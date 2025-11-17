import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Main from './components/Main';
import Sidebar from './components/Sidebar';
import useThemeStore from './store/useThemeStore';

function App() {
   const STORAGE_KEY = 'beenTogether.memories.v3';
   const START_DATE_KEY = 'beenTogether.start';
   const defaultStart = '2020-04-20';

   const { theme } = useThemeStore();

   const [memories, setMemories] = useState(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
   });

   const [startDate, setStartDate] = useState(() => {
      return localStorage.getItem(START_DATE_KEY) || defaultStart;
   });

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
   }, [memories]);

   useEffect(() => {
      localStorage.setItem(START_DATE_KEY, startDate);
   }, [startDate]);

   return (
      <div
         data-theme={theme}
         className="select-none min-h-screen bg-base-200 text-base-content p-4 flex justify-center font-sans"
      >
         <Toaster />
         <div className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6">
            <Sidebar
               memories={memories}
               setMemories={setMemories}
               startDate={startDate}
               setStartDate={setStartDate}
            />

            <Main memories={memories} setMemories={setMemories} startDate={startDate} />
         </div>
      </div>
   );
}

export default App;
