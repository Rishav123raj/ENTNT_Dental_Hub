"use client";

import { useState } from "react";
import { useApp } from "@/hooks/use-app";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PatientForm } from "./PatientForm";
import { useToast } from "@/hooks/use-toast";

export function PatientsClient() {
  const { data, deletePatient } = useApp();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | undefined>(undefined);

  const handleEdit = (patient: Patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedPatient(undefined);
    setFormOpen(true);
  };
  
  const handleDelete = (patientId: string, patientName: string) => {
    deletePatient(patientId);
    toast({ title: "Patient Deleted", description: `${patientName} has been removed.`})
  }
  
  const onFormSuccess = () => {
      setFormOpen(false);
      setSelectedPatient(undefined);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Patients</CardTitle>
                <CardDescription>Manage your patients here. Add, edit, or delete records.</CardDescription>
            </div>
             <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="gap-1" onClick={handleAddNew}>
                        <PlusCircle className="h-4 w-4" />
                        Add Patient
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPatient ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
                        <DialogDescription>
                            {selectedPatient ? "Update the details for this patient." : "Enter the new patient's details below."}
                        </DialogDescription>
                    </DialogHeader>
                    <PatientForm patient={selectedPatient} onSuccess={onFormSuccess} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Date of Birth</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Health Info</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.contact}</TableCell>
                <TableCell className="max-w-xs truncate">{patient.healthInfo}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleEdit(patient)}>Edit</DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the patient record and all associated appointments.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(patient.id, patient.name)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
