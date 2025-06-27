import type { AppData } from './types';

const LOCAL_STORAGE_KEY = 'dental-app-data';

const getInitialData = (): AppData => ({
  users: [
    {
      id: "1",
      role: "Admin",
      email: "admin@entnt.in",
      password: "admin123",
    },
    {
      id: "2",
      role: "Patient",
      email: "john@entnt.in",
      password: "patient123",
      patientId: "p1",
    },
     {
      id: "3",
      role: "Patient",
      email: "jane@entnt.in",
      password: "patient123",
      patientId: "p2",
    },
  ],
  patients: [
    {
      id: "p1",
      name: "John Doe",
      dob: "1990-05-10",
      contact: "1234567890",
      healthInfo: "No known allergies.",
    },
    {
      id: "p2",
      name: "Jane Smith",
      dob: "1985-08-22",
      contact: "0987654321",
      healthInfo: "Allergic to penicillin.",
    },
  ],
  incidents: [
    {
      id: "i1",
      patientId: "p1",
      title: "Annual Checkup",
      description: "Routine annual dental checkup and cleaning.",
      comments: "Patient reports no issues.",
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
      status: "Scheduled",
    },
    {
      id: "i2",
      patientId: "p2",
      title: "Toothache",
      description: "Pain in the upper right molar.",
      comments: "Sensitive to cold drinks.",
      appointmentDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      treatmentDescription: "Root canal treatment performed.",
      cost: 550,
      status: "Completed",
      nextAppointmentDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
      files: [],
    },
    {
      id: "i3",
      patientId: "p1",
      title: "Wisdom Tooth Removal Consult",
      description: "Consultation for wisdom tooth extraction.",
      comments: "",
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
      status: "Scheduled",
    },
     {
      id: "i4",
      patientId: "p2",
      title: "Teeth Whitening",
      description: "Cosmetic teeth whitening procedure.",
      comments: "Patient wants a brighter smile.",
      appointmentDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
      cost: 300,
      status: "Scheduled",
    },
  ],
});

export const getData = (): AppData => {
  if (typeof window === 'undefined') {
    return getInitialData();
  }
  try {
    const data = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data) as AppData;
      // Basic validation to ensure data structure is not completely off
      if(parsedData.users && parsedData.patients && parsedData.incidents) {
        return parsedData;
      }
    }
  } catch (error) {
    console.error("Failed to read from localStorage", error);
  }
  
  // If no data, or data is corrupt, initialize
  const initialData = getInitialData();
  setData(initialData);
  return initialData;
};

export const setData = (data: AppData) => {
   if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to write to localStorage", error);
  }
};
