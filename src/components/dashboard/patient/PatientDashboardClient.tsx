"use client"

import { useMemo } from "react"
import { useApp } from "@/hooks/use-app"
import { format, isAfter, isBefore, parseISO } from "date-fns"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, Stethoscope, FileText } from "lucide-react"

export function PatientDashboardClient() {
  const { user, data } = useApp()

  const { upcoming, history } = useMemo(() => {
    if (!user || !user.patientId) return { upcoming: [], history: [] }

    const now = new Date()
    const patientIncidents = data.incidents
      .filter((i) => i.patientId === user.patientId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime())
      
    return {
      upcoming: patientIncidents.filter(i => isAfter(parseISO(i.appointmentDate), now)),
      history: patientIncidents.filter(i => isBefore(parseISO(i.appointmentDate), now)),
    }
  }, [user, data.incidents])

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Here are your scheduled appointments.</CardDescription>
        </CardHeader>
        <CardContent>
            {upcoming.length > 0 ? (
                <div className="space-y-4">
                    {upcoming.map(appt => (
                        <div key={appt.id} className="p-4 border rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex-grow">
                                <h3 className="font-semibold">{appt.title}</h3>
                                <p className="text-sm text-muted-foreground">{appt.description}</p>
                            </div>
                            <div className="text-left sm:text-right w-full sm:w-auto shrink-0">
                                <p className="font-medium flex items-center gap-2"><CalendarClock className="h-4 w-4" /> {format(parseISO(appt.appointmentDate), 'PPp')}</p>
                                <Badge variant="outline">{appt.status}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>You have no upcoming appointments.</p>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Appointment History</CardTitle>
            <CardDescription>Review your past treatments and details.</CardDescription>
        </CardHeader>
        <CardContent>
             {history.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                {history.map(appt => (
                    <AccordionItem value={appt.id} key={appt.id}>
                        <AccordionTrigger>
                            <div className="flex justify-between w-full pr-4 text-left">
                                <span className="flex-1 font-semibold">{appt.title}</span>
                                <span className="text-muted-foreground shrink-0 ml-4">{format(parseISO(appt.appointmentDate), 'PPP')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                           <div className="space-y-2 pl-2">
                                <p className="flex items-center gap-2"><Stethoscope className="w-4 h-4 text-primary"/><strong>Treatment:</strong> {appt.treatmentDescription || "N/A"}</p>
                                <p><Badge variant={appt.status === 'Completed' ? 'secondary' : 'destructive'} className={appt.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-accent'}>{appt.status}</Badge></p>
                                {appt.cost && <p><strong>Cost:</strong> ${appt.cost.toLocaleString()}</p>}
                                {appt.files && appt.files.length > 0 && (
                                    <div>
                                        <strong>Files:</strong>
                                        <ul className="list-disc pl-5 mt-1 space-y-1">
                                            {appt.files.map(file => (
                                                <li key={file.name}>
                                                    <a href={file.url} download={file.name} className="text-primary hover:underline flex items-center gap-1.5">
                                                       <FileText className="w-4 h-4" /> {file.name}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                           </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
             ) : (
                 <p>You have no appointment history.</p>
             )}
        </CardContent>
      </Card>
    </div>
  )
}
