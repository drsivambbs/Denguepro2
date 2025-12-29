import React, { useState } from 'react';
import { Mail, User as UserIcon, Briefcase, Phone, MapPin, ChevronDown, Building2 } from 'lucide-react';
import { User, LocationType } from '../types';

interface UserFormProps {
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ onAddUser, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  
  // Single Selection Location State
  // Default to PHC
  const [locationType, setLocationType] = useState<LocationType>('PHC');
  const [locationName, setLocationName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber || !role) return;

    // User ID is the Phone Number
    // Default Password is 'password123'
    onAddUser({
      name,
      email,
      phoneNumber: phoneNumber,
      role,
      userId: phoneNumber, // Set User ID to Phone Number
      password: 'password123', // Set Default Password
      locationType,
      locationName: locationName || 'Headquarters',
    });

    // Reset form
    setName('');
    setEmail('');
    setPhoneNumber('');
    setRole('');
    setLocationType('PHC');
    setLocationName('');
    
    if (onCancel) onCancel();
  };

  // Full list of options, decoupled from the input label
  const locationOptions: LocationType[] = ['PHC', 'District', 'Corporation', 'Block', 'Municipality'];

  const designationOptions = [
    "Data Manager",
    "Medical Officer",
    "Health Inspector",
    "Block Medical Officer",
    "Zonal Medical Officer",
    "City Health Officer",
    "District Health Officer",
    "Municipal Health Officer",
    "Sanitary Inspector",
    "Sanitary Officer",
    "District Entomologist",
    "Junior Entomologist",
    "District Epidemiologist"
  ];

  return (
    <div className="flex flex-col h-full bg-white text-sm">
      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Personal Details Section */}
        <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1">Personal Info</h3>
            
            {/* Name Input */}
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <UserIcon size={14} />
                    </div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Sarah Chen"
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                        required
                    />
                </div>
            </div>

            {/* Designation Dropdown */}
            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Designation</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <Briefcase size={14} />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full pl-8 pr-8 py-2 appearance-none bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors cursor-pointer text-sm"
                        required
                    >
                        <option value="" disabled>Select Designation...</option>
                        {designationOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Email Input */}
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                            <Mail size={14} />
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@denguepro.org"
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                            required
                        />
                    </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Phone (User ID)</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                            <Phone size={14} />
                        </div>
                        <input
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="e.g. 9876543210"
                            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                            required
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Note about credentials */}
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3">
            <p className="text-xs text-blue-700">
                <span className="font-bold">Note:</span> The <strong>Phone Number</strong> will be used as the User ID. The default password will be set to <code>password123</code>.
            </p>
        </div>

        {/* Location Section */}
        <section className="space-y-3">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-1 flex items-center gap-2">
                Unit Assignment
            </h3>

            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Administrative Level</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-500 z-10">
                        <MapPin size={14} />
                    </div>
                    <select
                        value={locationType}
                        onChange={(e) => setLocationType(e.target.value as LocationType)}
                        className="w-full pl-8 pr-8 py-2 appearance-none bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors cursor-pointer text-sm"
                    >
                        {locationOptions.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-gray-400">
                        <ChevronDown size={14} />
                    </div>
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    PHC Name
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                        <Building2 size={14} />
                    </div>
                    <input
                        type="text"
                        value={locationName}
                        onChange={(e) => setLocationName(e.target.value)}
                        placeholder="Enter PHC Name..."
                        className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 text-gray-900 rounded-md focus:ring-1 focus:ring-primary-600 focus:border-primary-600 focus:bg-white outline-none transition-colors placeholder:text-gray-400"
                    />
                </div>
            </div>
        </section>

      </div>

      {/* Footer Actions */}
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-3">
         {onCancel && (
             <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-2 px-3 bg-white border border-gray-300 text-gray-700 font-medium text-sm rounded-md hover:bg-gray-50 transition-colors"
             >
                Cancel
             </button>
         )}
         <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 py-2 px-3 bg-primary-700 hover:bg-primary-800 text-white font-medium text-sm rounded-md shadow-sm transition-all"
         >
            Save Record
         </button>
      </div>
    </div>
  );
};