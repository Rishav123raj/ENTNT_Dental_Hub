"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { appointmentSchema } from "@/lib/schemas";
import { useApp } from "@/hooks/use-app";
import type { Incident, FileAttachment } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CalendarIcon, FileUp, Sparkles, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  incident?: Incident;
  onSuccess: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export function AppointmentForm({ incident, onSuccess }: AppointmentFormProps) {
  const { data, addIncident, updateIncident } = useApp();
  const { toast } = useToast();
  const [attachedFiles, setAttachedFiles] = useState<FileAttachment[]>(incident?.files || []);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      ...incident,
      appointmentDate: incident ? new Date(incident.appointmentDate) : new Date(),
      nextAppointmentDate: incident?.nextAppointmentDate ? new Date(incident.nextAppointmentDate) : undefined,
      cost: incident?.cost || undefined,
      files: incident?.files || [],
    }
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileAttachment[] = [];
      for (const file of Array.from(files)) {
        if (attachedFiles.some(f => f.name === file.name)) continue;
        const base64 = await fileToBase64(file);
        newFiles.push({ name: file.name, type: file.type, size: file.size, url: base64 });
      }
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveFile = (fileName: string) => {
    setAttachedFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const getAiSuggestion = () => {
    const suggestions = [
      "Recommend a six-month cleaning and check-up schedule. Cost: $150.",
      "Suggest fluoride treatment for enamel protection. Cost: $75.",
      "Propose cosmetic whitening. Cost: $300.",
      "Plan for molar extraction and potential implant. Cost: $2500."
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    form.setValue('treatmentDescription', randomSuggestion);
    toast({ title: "AI Suggestion", description: "A treatment plan has been suggested." });
  }

  const onSubmit = (values: AppointmentFormValues) => {
    const submissionData = {
        ...values,
        appointmentDate: values.appointmentDate.toISOString(),
        nextAppointmentDate: values.nextAppointmentDate ? values.nextAppointmentDate.toISOString() : undefined,
        files: attachedFiles
    };

    try {
      if (incident) {
        updateIncident({ ...submissionData, id: incident.id });
        toast({ title: "Appointment Updated" });
      } else {
        addIncident(submissionData);
        toast({ title: "Appointment Scheduled" });
      }
      onSuccess();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField name="title" render={({ field }) => (<FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Annual Checkup" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Reason for visit" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField name="appointmentDate" render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Appointment Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Scheduled">Scheduled</SelectItem><SelectItem value="Completed">Completed</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />

        {form.watch('status') === 'Completed' && (
            <div className="space-y-4 pt-4 mt-4 border-t">
                <h3 className="text-lg font-medium text-center text-muted-foreground">Post-Appointment Details</h3>
                <div className="relative">
                    <FormField name="treatmentDescription" render={({ field }) => (<FormItem><FormLabel>Treatment Description</FormLabel><FormControl><Textarea placeholder="Details of the treatment provided" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <Button type="button" size="sm" variant="outline" className="absolute top-0 right-0 gap-1" onClick={getAiSuggestion}><Sparkles className="h-4 w-4 text-yellow-400" /> AI Suggestion</Button>
                </div>
                <FormField name="cost" render={({ field }) => (<FormItem><FormLabel>Cost ($)</FormLabel><FormControl><Input type="number" placeholder="e.g., 150" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl><FormMessage /></FormItem>)} />
                <FormField name="nextAppointmentDate" render={({ field }) => (
                     <FormItem className="flex flex-col">
                        <FormLabel>Next Appointment Date</FormLabel>
                        <Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} /></PopoverContent></Popover>
                        <FormMessage />
                    </FormItem>
                )}/>
                <FormItem>
                    <FormLabel>Attach Files</FormLabel>
                     <FormControl>
                        <div className="flex items-center gap-2">
                         <label className="flex-1 cursor-pointer"><Input type="file" multiple onChange={handleFileChange} className="hidden" /><Button type="button" asChild variant="outline" className="w-full"><div className="gap-2 flex items-center"><FileUp className="h-4 w-4"/>Upload Files</div></Button></label>
                        </div>
                    </FormControl>
                   {attachedFiles.length > 0 && (
                        <FormDescription>
                            <div className="mt-2 space-y-2">
                                <h4 className="text-sm font-medium">Attached Files:</h4>
                                <ul className="space-y-1">
                                    {attachedFiles.map((f) => (
                                    <li key={f.name} className="text-xs text-muted-foreground flex items-center justify-between p-1.5 bg-muted rounded-md">
                                        <span className="truncate pr-2">{f.name} ({(f.size / 1024).toFixed(2)} KB)</span>
                                        <Button type="button" variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleRemoveFile(f.name)}>
                                        <X className="h-3 w-3" />
                                        </Button>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </FormDescription>
                    )}
                </FormItem>
            </div>
        )}
        <div className="flex justify-end">
          <Button type="submit">{incident ? "Update Appointment" : "Create Appointment"}</Button>
        </div>
      </form>
    </Form>
  );
}
