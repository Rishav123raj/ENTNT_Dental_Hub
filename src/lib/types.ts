export interface User {
  id: string;
  role: "Admin" | "Patient";
  email: string;
  password?: string; // Should not be stored in session state
  patientId?: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  contact: string;
  healthInfo: string;
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url: string; // base64 data URL
}

export interface Incident {
  id: string;
  patientId: string;
  title: string;
  description: string;
  comments: string;
  appointmentDate: string; // ISO string
  treatmentDescription?: string;
  cost?: number;
  status: "Scheduled" | "Completed" | "Cancelled";
  nextAppointmentDate?: string; // ISO string
  files?: FileAttachment[];
}

export interface AppData {
  users: User[];
  patients: Patient[];
  incidents: Incident[];
}
