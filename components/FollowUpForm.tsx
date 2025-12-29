import React, { useState } from 'react';
import { DengueCase, FollowUpStatus } from '../types';
import { Save, MessageSquare, Clock, AlertCircle, CheckCircle2, History, PlusCircle } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface FollowUpFormProps {
  caseData: DengueCase;
  onSave: (id: string, status: FollowUpStatus, note: string, date: number) => void;
  onCancel: () => void;
}

export const FollowUpForm: React.FC<FollowUpFormProps> = ({ caseData, onSave, onCancel }) => {
  // State for the NEW entry
  const [newStatus, setNewStatus] = useState<FollowUpStatus>(caseData.followUpStatus);
  const [newNote, setNewNote] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]); // Default to today YYYY-MM-DD

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return; // Prevent empty notes if desired, or make optional
    const timestamp = new Date(newDate).getTime();
    onSave(caseData.id, newStatus, newNote, timestamp);
    // Reset form
    setNewNote('');
    setNewStatus(caseData.followUpStatus);
  };

  const getStatusIcon = (status: FollowUpStatus) => {
      switch (status) {
          case 'Completed': return <CheckCircle2 size={16} className="text-green-600" aria-hidden="true" />;
          case 'In Progress': return <Clock size={16} className="text-blue-600" aria-hidden="true" />;
          case 'Pending': return <AlertCircle size={16} className="text-orange-600" aria-hidden="true" />;
      }
  };

  return (
    <div className="flex flex-col h-full bg-white text-sm">
        {/* Header content showing patient summary */}
        <div className="p-5 border-b border-gray-100 bg-gray-50/50 shrink-0" role="region" aria-label="Patient Summary">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{caseData.patientName}</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                <span>{caseData.age} yrs</span>
                <span>•</span>
                <span>{caseData.gender}</span>
                <span>•</span>
                <span>{caseData.location}</span>
            </div>
            <div className="mt-2 text-xs text-gray-600 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${caseData.status === 'Confirmed' ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                Case Status: <span className="font-semibold">{caseData.status}</span>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto">
            {/* History Section */}
            <div className="p-5">
                <div className="flex items-center gap-2 mb-4">
                    <History size={16} className="text-gray-400" />
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide">Activity History</h4>
                </div>

                <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                    {/* Map through history */}
                    {caseData.history && caseData.history.length > 0 ? (
                        caseData.history.map((record) => (
                            <div key={record.id} className="relative">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-white border-2 border-gray-300"></div>
                                
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-gray-900">
                                            {new Date(record.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                            {getStatusIcon(record.status)}
                                            <span className="text-[10px] font-medium text-gray-600">{record.status}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mt-1">
                                        {record.remarks}
                                    </p>
                                    {record.addedBy && (
                                        <div className="text-[10px] text-gray-400 mt-0.5">
                                            Logged by {record.addedBy}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-xs text-gray-400 italic pl-2">No follow-up history recorded yet.</div>
                    )}
                </div>
            </div>

            {/* Add New Entry Form */}
            <div className="p-5 border-t-4 border-gray-50 bg-white">
                <div className="flex items-center gap-2 mb-4">
                    <PlusCircle size={16} className="text-primary-600" />
                    <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wide">Add New Entry</h4>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                         {/* Date Input using new Component */}
                         <div className="z-10 relative">
                             <DatePicker 
                                label="Date"
                                value={newDate}
                                onChange={setNewDate}
                                required
                             />
                         </div>
                         
                         {/* Status Dropdown */}
                         <div className="space-y-1">
                             <label htmlFor="entry-status" className="text-[11px] font-semibold text-gray-500 uppercase">Status</label>
                             <div className="relative">
                                 <select 
                                    id="entry-status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as FollowUpStatus)}
                                    className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none appearance-none"
                                 >
                                     <option value="Pending">Pending</option>
                                     <option value="In Progress">In Progress</option>
                                     <option value="Completed">Completed</option>
                                 </select>
                                 <div className="absolute right-2.5 top-2.5 pointer-events-none text-gray-400">
                                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                 </div>
                             </div>
                         </div>
                    </div>

                    {/* Remarks */}
                    <div className="space-y-1">
                        <label htmlFor="entry-remarks" className="text-[11px] font-semibold text-gray-500 uppercase">Remarks / Observations</label>
                        <textarea 
                            id="entry-remarks"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Describe actions taken..."
                            className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2.5 bg-primary-700 hover:bg-primary-800 text-white font-medium text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        <Save size={16} /> Save Record
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};