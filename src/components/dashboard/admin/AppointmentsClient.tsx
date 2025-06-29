"use client";

import { useState } from "react";
import { useApp } from "@/hooks/use-app";
import type { Incident } from "@/lib/types";
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
import { AppointmentForm } from "./AppointmentForm";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export function AppointmentsClient() {
  const { data, deleteIncident } = useApp();
  const { toast } = useToast();
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | undefined>(undefined);

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setFormOpen(true);
  };

  const handleAddNew = () => {
    setSelectedIncident(undefined);
    setFormOpen(true);
  };
  
  const handleDelete = (incidentId: string) => {
    deleteIncident(incidentId);
    toast({ title: "Appointment Deleted", description: `The appointment has been removed.`})
  }
  
  const onFormSuccess = () => {
      setFormOpen(false);
      setSelectedIncident(undefined);
  }
  
  const getPatientName = (patientId: string) => {
      return data.patients.find(p => p.id === patientId)?.name || 'Unknown';
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
                <CardTitle>Appointments</CardTitle>
                <CardDescription>Manage all patient appointments.</CardDescription>
            </div>
             <Dialog open={isFormOpen} onOpenChange={setFormOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">New Appointment</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedIncident ? 'Edit Appointment' : 'New Appointment'}</DialogTitle>
                    </DialogHeader>
                    <AppointmentForm incident={selectedIncident} onSuccess={onFormSuccess} />
                </DialogContent>
            </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead className="hidden md:table-cell">Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.incidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{getPatientName(incident.patientId)}</TableCell>
                <TableCell className="hidden md:table-cell">{incident.title}</TableCell>
                <TableCell>{format(parseISO(incident.appointmentDate), "PP")}</TableCell>
                <TableCell><Badge variant={incident.status === 'Completed' ? 'secondary' : 'default'} className={incident.status === 'Completed' ? 'bg-green-100 text-green-800' : incident.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}>{incident.status}</Badge></TableCell>
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
                        <DropdownMenuItem onSelect={() => handleEdit(incident)}>Edit</DropdownMenuItem>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                     <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this appointment.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(incident.id)}>Continue</AlertDialogAction>
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
