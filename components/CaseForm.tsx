import React, { useState } from 'react';
import { DengueCase, CaseStatus } from '../types';
import { Save, User, MapPin, Phone, Activity } from 'lucide-react';
import { DatePicker } from './DatePicker';

interface CaseFormProps {
  onSave: (data: Omit<DengueCase, 'id' | 'followUpStatus' | 'history' | 'followUpNote' | 'lastFollowUpDate'>) => void;
  onCancel: () => void;
}

export const CaseForm: React.FC<CaseFormProps> = ({ onSave, onCancel }) => {
  const [patientName, setPatientName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [contactNumber, setContactNumber] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState<CaseStatus>('Suspected');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      patientName,
      age: parseInt(age, 10) || 0,
      gender,
      contactNumber,
      address,
      location,
      diagnosisDate: new Date(diagnosisDate).getTime(),
      status
    });
  };

  return (
    <div className="flex flex-col h-full bg-white text-sm">
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Patient Details */}
        <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1">Patient Details</h3>
            
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Patient Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <User size={14} />
                    </div>
                    <input
                        type="text"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="e.g. Rahul Verma"
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Age</label>
                    <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Yrs"
                        min="0"
                        max="120"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Gender</label>
                    <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors"
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Contact Number</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <Phone size={14} />
                    </div>
                    <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors"
                        required
                    />
                </div>
            </div>
        </section>

        {/* Case Info */}
        <section className="space-y-3">
             <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1">Case Information</h3>

             <div className="grid grid-cols-2 gap-3">
                <div className="z-20 relative">
                     <DatePicker 
                        label="Diagnosis Date"
                        value={diagnosisDate}
                        onChange={setDiagnosisDate}
                        required
                     />
                </div>
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                            <Activity size={14} />
                        </div>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as CaseStatus)}
                            className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors appearance-none"
                        >
                            <option value="Suspected">Suspected</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Recovered">Recovered</option>
                            <option value="Critical">Critical</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Location / Block</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <MapPin size={14} />
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Central District"
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors"
                        required
                    />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Full Address</label>
                <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full residential address..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors resize-none h-20"
                    required
                />
             </div>
        </section>

      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-3">
         <button 
            type="button" 
            onClick={onCancel}
            className="flex-1 py-2 px-3 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-50 transition-colors"
         >
            Cancel
         </button>
         <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2 px-3 bg-primary-700 hover:bg-primary-800 text-white font-medium text-sm rounded-md shadow-sm transition-all flex items-center justify-center gap-2"
         >
            <Save size={16} /> Save Case
         </button>
      </div>
    </div>
  );
};