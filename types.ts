
export type LocationType = 'District' | 'Corporation' | 'Block' | 'Municipality' | 'PHC';

export interface User {
  id: string;
  userId: string;
  password: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  // Location assignment (Single Selection)
  locationType: LocationType;
  locationName: string;
  createdAt: number;
}

export type CaseStatus = 'Suspected' | 'Confirmed' | 'Recovered' | 'Critical';
export type FollowUpStatus = 'Pending' | 'In Progress' | 'Completed';

export interface FollowUpRecord {
  id: string;
  date: number;
  status: FollowUpStatus;
  remarks: string;
  addedBy?: string;
}

export interface DengueCase {
  id: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  location: string;
  diagnosisDate: number;
  status: CaseStatus;
  contactNumber: string;
  
  // Current/Latest Status
  followUpStatus: FollowUpStatus;
  followUpNote?: string;
  lastFollowUpDate?: number;
  
  // Full History
  history: FollowUpRecord[];
}

export interface AIPersonaResponse {
  role: string;
}
