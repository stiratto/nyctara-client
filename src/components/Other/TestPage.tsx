import { AlertTriangle } from 'lucide-react';

export const TestPage = () => {
   return (
      <div className="bg-black text-white p-4 fixed bottom-1 left-1 rounded-xl z-50 max-w-sm flex flex-col sm:flex-row items-start justify-center gap-4">
         <AlertTriangle />
         <p className="text-sm">This is a test page, the server may be off so it can take some time for it to turn on.</p>
      </div>
   )
}

