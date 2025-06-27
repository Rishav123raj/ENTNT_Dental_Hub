"use client";

import { createContext, useState, useEffect, useReducer, useCallback, ReactNode } from "react";
import type { User, AppData, Patient, Incident } from "@/lib/types";
import { getData, setData } from "@/lib/data";
import { produce } from "immer";

interface AppContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  data: AppData;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (patientId: string) => void;
  addIncident: (incident: Omit<Incident, 'id'>) => void;
  updateIncident: (incident: Incident) => void;
  deleteIncident: (incidentId: string) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

type Action =
  | { type: "SET_DATA"; payload: AppData }
  | { type: "ADD_PATIENT"; payload: Patient }
  | { type: "UPDATE_PATIENT"; payload: Patient }
  | { type: "DELETE_PATIENT"; payload: string }
  | { type: "ADD_INCIDENT"; payload: Incident }
  | { type: "UPDATE_INCIDENT"; payload: Incident }
  | { type: "DELETE_INCIDENT"; payload: string };

const dataReducer = (state: AppData, action: Action): AppData => {
  return produce(state, draft => {
    switch (action.type) {
      case "SET_DATA":
        return action.payload;
      case "ADD_PATIENT":
        draft.patients.push(action.payload);
        break;
      case "UPDATE_PATIENT": {
        const index = draft.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) draft.patients[index] = action.payload;
        break;
      }
      case "DELETE_PATIENT": {
        draft.patients = draft.patients.filter(p => p.id !== action.payload);
        draft.incidents = draft.incidents.filter(i => i.patientId !== action.payload);
        break;
      }
      case "ADD_INCIDENT":
        draft.incidents.push(action.payload);
        break;
      case "UPDATE_INCIDENT": {
        const index = draft.incidents.findIndex(i => i.id === action.payload.id);
        if (index !== -1) draft.incidents[index] = action.payload;
        break;
      }
      case "DELETE_INCIDENT":
        draft.incidents = draft.incidents.filter(i => i.id !== action.payload);
        break;
    }
  });
};


export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, dispatch] = useReducer(dataReducer, { users: [], patients: [], incidents: [] });

  useEffect(() => {
    const appData = getData();
    dispatch({ type: "SET_DATA", payload: appData });

    try {
      const storedUser = sessionStorage.getItem("dental-user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Failed to parse user from session storage", e);
      sessionStorage.removeItem("dental-user");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if(!loading) {
      setData(data);
    }
  }, [data, loading]);

  const login = useCallback(async (email: string, password: string): Promise<User | null> => {
    const foundUser = data.users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const { password, ...userToStore } = foundUser;
      setUser(userToStore);
      sessionStorage.setItem("dental-user", JSON.stringify(userToStore));
      return userToStore;
    }
    return null;
  }, [data.users]);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem("dental-user");
  }, []);
  
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: `p${Date.now()}`};
    dispatch({ type: "ADD_PATIENT", payload: newPatient });
  };
  
  const updatePatient = (patient: Patient) => {
    dispatch({ type: "UPDATE_PATIENT", payload: patient });
  };

  const deletePatient = (patientId: string) => {
    dispatch({ type: "DELETE_PATIENT", payload: patientId });
  };

  const addIncident = (incident: Omit<Incident, 'id'>) => {
    const newIncident = { ...incident, id: `i${Date.now()}`};
    dispatch({ type: "ADD_INCIDENT", payload: newIncident });
  };

  const updateIncident = (incident: Incident) => {
    dispatch({ type: "UPDATE_INCIDENT", payload: incident });
  };

  const deleteIncident = (incidentId: string) => {
    dispatch({ type: "DELETE_INCIDENT", payload: incidentId });
  };


  return (
    <AppContext.Provider
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        data,
        addPatient,
        updatePatient,
        deletePatient,
        addIncident,
        updateIncident,
        deleteIncident
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
