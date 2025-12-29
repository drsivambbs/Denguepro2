
import React from 'react';
import { User } from '../types';
import { Trash2, Mail, UserPlus, BadgeCheck, Phone, SearchX, RotateCcw } from 'lucide-react';

interface UserListProps {
  users: User[];
  onRemoveUser: (id: string) => void;
  onOpenAdd: () => void;
  isFiltered?: boolean;
  currentUserRole?: string;
  onResetPassword?: (userId: string) => void;
}

export const UserList: React.FC<UserListProps> = ({ users, onRemoveUser, onOpenAdd, isFiltered, currentUserRole, onResetPassword }) => {
  // Roles allowed to reset passwords
  const canResetPassword = currentUserRole && ['Data Manager', 'District Epidemiologist'].includes(currentUserRole);

  const handleRemoveClick = (user: User) => {
    const confirmed = window.confirm(`Are you sure you want to remove ${user.name} from the staff directory? This action cannot be undone.`);
    if (confirmed) {
      onRemoveUser(user.id);
    }
  };

  if (users.length === 0) {
    if (isFiltered) {
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8 animate-fade-in" role="status">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
            <SearchX className="text-gray-500" size={24} />
          </div>
          <h3 className="text-gray-900 font-bold text-lg mb-1">No Matches Found</h3>
          <p className="text-gray-600 text-xs mb-4 max-w-[200px]">
            We couldn't find any staff members matching your search filters.
          </p>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('clear-filters'))}
            className="text-primary-700 font-medium text-sm hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-1"
            aria-label="Clear all active search filters"
          >
            Clear all filters
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-8" role="status">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
          <UserPlus className="text-gray-500" size={24} />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-1">No Records</h3>
        <p className="text-gray-600 text-xs mb-4">Staff directory is empty.</p>
        <button 
          onClick={onOpenAdd}
          className="px-4 py-2 bg-primary-700 text-white rounded-md text-sm font-medium shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Add Staff
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3 pb-20 md:pb-3" role="list" aria-label="Staff Directory">
      {users.map((user) => (
        <div 
          key={user.id} 
          className="group relative bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden animate-fade-in"
          role="listitem"
        >
          {/* Status Strip */}
          <div className="absolute top-0 left-0 w-1 h-full bg-primary-600 rounded-l-md" aria-hidden="true"></div>

          <div className="p-3 pl-4 flex-1 flex flex-col gap-2">
            
            {/* Header */}
            <div className="flex justify-between items-start min-w-0">
                <div className="min-w-0 pr-6">
                    <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">{user.name}</h3>
                    <p className="text-primary-800 text-xs font-medium truncate mt-0.5">{user.role}</p>
                </div>
                <div className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100" title={`Phone / User ID: ${user.userId}`}>
                    <Phone size={10} className="text-primary-600" aria-hidden="true" /> 
                    <span className="font-semibold text-gray-700">{user.phoneNumber}</span>
                </div>
            </div>

            {/* Location Badge */}
            <div className="bg-gray-50 border border-gray-100 rounded px-2 py-1.5 flex flex-col gap-0.5">
               <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" aria-hidden="true"></span>
                  <span className="text-[9px] font-bold uppercase text-gray-600 tracking-wider">
                    {user.locationType}
                  </span>
               </div>
               <div className="text-xs font-semibold text-gray-800 truncate pl-2.5">
                  {user.locationName}
               </div>
            </div>

            {/* Contacts */}
            <div className="mt-auto space-y-1.5 pt-1">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Mail size={12} className="text-gray-500 shrink-0" aria-hidden="true" />
                <a 
                  href={`mailto:${user.email}`} 
                  className="hover:text-primary-700 transition-colors truncate focus:outline-none focus:underline"
                  aria-label={`Email ${user.name} at ${user.email}`}
                >
                  {user.email}
                </a>
              </div>
            </div>

          </div>
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
              {canResetPassword && onResetPassword && (
                 <button
                    onClick={() => onResetPassword(user.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`Reset password for ${user.name}`}
                    title="Reset Password to Default"
                 >
                    <RotateCcw size={14} />
                 </button>
              )}
              
              <button
                  onClick={() => handleRemoveClick(user)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Remove user ${user.name}`}
                  title="Remove User"
              >
                <Trash2 size={14} />
              </button>
          </div>
        </div>
      ))}
    </div>
  );
};
