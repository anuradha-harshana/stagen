export type AvailabilityStatus = 'Available' | 'Onsite' | 'Leave';

export interface Certification {
  id: string;
  name: string;
  status: 'Active' | 'Expired' | 'Pending' | 'Verified';
  number?: string;
  issuedDate?: string;
  expiryDate?: string;
  fileName?: string;
  fileUrl?: string;
}

export interface SupervisorProfile {
  fullName: string;
  employeeId: string;
  profilePhoto: string; // URL or Base64 string
  contactNumber: string;
  emailAddress: string;
  officeBranch: string;
  status: AvailabilityStatus;
  yearsOfExperience: number;
  expertise: string[];
  certifications: Certification[];
}
