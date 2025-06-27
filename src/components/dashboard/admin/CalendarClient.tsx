"use client";

import { useState } from "react";
import { useApp } from "@/hooks/use-app";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { parseISO, format, isSameDay } from "date-fns";
import type { DateRange } from "react-day-picker";

export function CalendarClient() {
  const { data } = useApp();
  const [date, setDate] = useState<DateRange | undefined>();

  const appointmentsOnSelectedDate = data.incidents.filter((incident) => {
    const incidentDate = parseISO(incident.appointmentDate);
    if (!date?.from) return isSameDay(incidentDate, new Date());
    if (date.from && !date.to) return isSameDay(incidentDate, date.from);
    if (date.from && date.to) return incidentDate >= date.from && incidentDate <= date.to;
    return false;
  }).sort((a,b) => parseISO(a.appointmentDate).getTime() - parseISO(b.appointmentDate).getTime());

  const getPatientName = (patientId: string) => {
    return data.patients.find((p) => p.id === patientId)?.name || "Unknown";
  };
  
  const appointmentDates = data.incidents.map(i => parseISO(i.appointmentDate));

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="lg:col-span-2">
         <Card>
            <CardHeader>
                <CardTitle>Appointment Calendar</CardTitle>
                <CardDescription>Select a date or range to view appointments.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="range"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    modifiers={{ scheduled: appointmentDates }}
                    modifiersStyles={{ scheduled: { color: 'hsl(var(--primary))', fontWeight: 'bold' } }}
                 />
            </CardContent>
         </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              {date?.from && !date.to ? format(date.from, "PPP") : "Appointments"}
            </CardTitle>
            <CardDescription>
              {date?.from && date.to ? `${format(date.from, "PP")} - ${format(date.to, "PP")}` : `Showing appointments for selected date(s).`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {appointmentsOnSelectedDate.length > 0 ? (
              <ul className="space-y-4">
                {appointmentsOnSelectedDate.map((appt) => (
                  <li key={appt.id} className="p-3 border rounded-lg">
                    <p className="font-semibold">{appt.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Patient: {getPatientName(appt.patientId)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Time: {format(parseISO(appt.appointmentDate), "p")}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground">
                No appointments for the selected date(s).
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
