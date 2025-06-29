"use client";

import { useMemo } from "react";
import { useApp } from "@/hooks/use-app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Users, Stethoscope, BadgeDollarSign, CalendarClock } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";

export function DashboardClient() {
  const { data } = useApp();

  const stats = useMemo(() => {
    const now = new Date();
    const upcomingAppointments = data.incidents
      .filter(i => i.status === 'Scheduled' && isAfter(parseISO(i.appointmentDate), now))
      .sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    
    const revenue = data.incidents
        .filter(i => i.status === 'Completed' && i.cost)
        .reduce((sum, i) => sum + (i.cost || 0), 0);
        
    const pendingTreatments = data.incidents.filter(i => i.status === 'Scheduled').length;
    const completedTreatments = data.incidents.filter(i => i.status === 'Completed').length;

    return {
      totalPatients: data.patients.length,
      upcomingAppointmentsCount: upcomingAppointments.length,
      revenue,
      next10Appointments: upcomingAppointments.slice(0, 10),
      treatmentStatus: [
          { name: 'Pending', value: pendingTreatments },
          { name: 'Completed', value: completedTreatments },
      ]
    };
  }, [data]);

  const getPatientName = (patientId: string) => {
    return data.patients.find(p => p.id === patientId)?.name || "Unknown Patient";
  };

  return (
    <div className="flex flex-col gap-6">
       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.revenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all completed treatments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Currently managed patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats.upcomingAppointmentsCount}</div>
             <p className="text-xs text-muted-foreground">Total scheduled appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treatments Status</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.treatmentStatus[0].value} / {stats.treatmentStatus[1].value}</div>
            <p className="text-xs text-muted-foreground">Pending vs. Completed</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Next 10 Appointments</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Patient</TableHead>
                            <TableHead className="hidden sm:table-cell">Treatment</TableHead>
                            <TableHead>Date & Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stats.next10Appointments.map(appt => (
                            <TableRow key={appt.id}>
                                <TableCell>{getPatientName(appt.patientId)}</TableCell>
                                <TableCell className="hidden sm:table-cell">{appt.title}</TableCell>
                                <TableCell>{format(parseISO(appt.appointmentDate), 'PPp')}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Treatment Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.treatmentStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" fill="hsl(var(--primary))" name="Treatments" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
