import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
  label?: string;
  required?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Parse initial value or default to today
  const initialDate = value ? new Date(value) : new Date();
  const [viewDate, setViewDate] = useState(initialDate); // Track which month/year we are viewing

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync view date if value changes externally
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay(); // 0 = Sunday

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format to YYYY-MM-DD
    const formatted = selected.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(today.toISOString().split('T')[0]);
    setViewDate(today);
    setIsOpen(false);
  };

  const renderCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);

    const days = [];
    
    // Empty slots for days before the 1st
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    const currentSelectedDate = value ? new Date(value) : null;

    // Actual days
    for (let d = 1; d <= totalDays; d++) {
      const isToday = 
        new Date().getDate() === d && 
        new Date().getMonth() === month && 
        new Date().getFullYear() === year;

      const isSelected = 
        currentSelectedDate &&
        currentSelectedDate.getDate() === d && 
        currentSelectedDate.getMonth() === month && 
        currentSelectedDate.getFullYear() === year;

      days.push(
        <button
          key={d}
          onClick={(e) => { e.preventDefault(); handleSelectDate(d); }}
          className={`h-8 w-8 text-xs font-medium rounded-full flex items-center justify-center transition-colors
            ${isSelected 
              ? 'bg-primary-600 text-white shadow-sm' 
              : isToday 
                ? 'bg-primary-50 text-primary-700 font-bold border border-primary-100' 
                : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && <label className="text-[11px] font-semibold text-gray-500 uppercase">{label}</label>}
      
      <div 
        className="relative group cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400 group-hover:text-primary-500 transition-colors">
            <CalendarIcon size={14} />
        </div>
        <input
            type="text"
            readOnly
            value={value ? new Date(value).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) : ''}
            className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none cursor-pointer hover:bg-white transition-colors"
            placeholder="Select date"
            required={required}
        />
      </div>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-gray-100 z-50 w-64 p-3 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
             <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronLeft size={16}/></button>
             <span className="text-sm font-bold text-gray-800">
               {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
             </span>
             <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded text-gray-500"><ChevronRight size={16}/></button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 mb-2">
             {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
               <div key={d} className="h-6 flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                 {d}
               </div>
             ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-y-1 justify-items-center">
             {renderCalendarDays()}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 mt-3 pt-2 flex justify-between">
              <button 
                onClick={(e) => { e.preventDefault(); handleToday(); }}
                className="text-xs font-bold text-primary-600 hover:text-primary-800 px-2 py-1 rounded hover:bg-primary-50 transition-colors"
              >
                Today
              </button>
              <button 
                onClick={(e) => { e.preventDefault(); setIsOpen(false); }}
                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Close
              </button>
          </div>
        </div>
      )}
    </div>
  );
};
