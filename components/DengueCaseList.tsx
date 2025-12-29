
import React from 'react';
import { DengueCase, FollowUpStatus } from '../types';
import { MapPin, Calendar, Phone, CheckCircle2, Clock, AlertCircle, MessageSquare, SearchX, SquarePen } from 'lucide-react';

interface DengueCaseListProps {
  cases: DengueCase[];
  onSelectCase: (caseItem: DengueCase) => void;
  isFiltered?: boolean;
}

export const DengueCaseList: React.FC<DengueCaseListProps> = ({ cases, onSelectCase, isFiltered }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-red-50 text-red-800 border-red-100';
      case 'Suspected': return 'bg-amber-50 text-amber-800 border-amber-100';
      case 'Recovered': return 'bg-green-50 text-green-800 border-green-100';
      case 'Critical': return 'bg-purple-50 text-purple-800 border-purple-100';
      default: return 'bg-gray-50 text-gray-800 border-gray-100';
    }
  };

  const getFollowUpColor = (status: FollowUpStatus) => {
    switch (status) {
      case 'Completed': return 'text-green-700 bg-green-50 border-green-200';
      case 'In Progress': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'Pending': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getFollowUpIcon = (status: FollowUpStatus) => {
      switch (status) {
          case 'Completed': return <CheckCircle2 size={12} aria-hidden="true" />;
          case 'In Progress': return <Clock size={12} aria-hidden="true" />;
          case 'Pending': return <AlertCircle size={12} aria-hidden="true" />;
      }
  };

  if (cases.length === 0) {
    if (isFiltered) {
        return (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in" role="status">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3" aria-hidden="true">
              <SearchX className="text-gray-500" size={20} />
            </div>
            <h3 className="text-gray-900 font-bold text-sm mb-1">No Matches</h3>
            <p className="text-gray-500 text-[10px] mb-3 max-w-[180px]">Adjust filters to find more cases.</p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('clear-case-filters'))}
              className="text-primary-700 font-bold text-xs hover:underline"
            >
              Reset Filters
            </button>
          </div>
        );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in" role="status">
        <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest">Repository Empty</h3>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-2 pb-20 md:pb-2" role="list">
      {cases.map((item) => (
        <div 
            key={item.id} 
            onClick={() => onSelectCase(item)}
            className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md hover:border-primary-200 transition-all flex flex-col p-2.5 animate-fade-in group relative cursor-pointer active:scale-[0.99]"
            role="button"
            tabIndex={0}
        >
           {/* Header: Name and Status */}
           <div className="flex justify-between items-start mb-1.5">
              <div className="min-w-0 pr-2">
                 <h3 className="font-black text-gray-900 text-xs truncate leading-tight group-hover:text-primary-700 transition-colors uppercase tracking-tight">{item.patientName}</h3>
                 <p className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase">{item.age}Y • {item.gender.charAt(0)}</p>
              </div>
              <span 
                className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${getStatusColor(item.status)} uppercase tracking-tighter shrink-0`}
              >
                 {item.status}
              </span>
           </div>

           {/* Info Section - Tighter spacing */}
           <div className="space-y-1 mb-2">
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 leading-none">
                 <MapPin size={10} className="text-primary-600 shrink-0" />
                 <span className="truncate font-medium">{item.location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 leading-none">
                 <Phone size={10} className="text-primary-600 shrink-0" />
                 <span className="font-mono">{item.contactNumber}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 leading-none">
                 <Calendar size={10} className="text-primary-600 shrink-0" />
                 <span>{new Date(item.diagnosisDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
              </div>
           </div>

           {/* Follow Up Action Area */}
           <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Status</span>
                  <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tight ${getFollowUpColor(item.followUpStatus).split(' ')[0]}`}>
                      {getFollowUpIcon(item.followUpStatus)}
                      <span>{item.followUpStatus}</span>
                  </div>
              </div>
              
              <button
                 onClick={(e) => {
                     e.stopPropagation();
                     onSelectCase(item);
                 }}
                 className="flex items-center gap-1 px-2 py-1 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100 rounded text-[10px] font-black uppercase transition-colors"
              >
                  <SquarePen size={10} /> Log
              </button>
           </div>
           
           {item.followUpNote && (
               <div className="mt-1.5 text-[9px] text-gray-400 italic line-clamp-1 border-l border-gray-100 pl-1.5">
                   "{item.followUpNote}"
               </div>
           )}
        </div>
      ))}
    </div>
  );
};
