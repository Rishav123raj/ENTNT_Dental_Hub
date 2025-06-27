import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const patientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Full name is required." }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date of birth." }),
  contact: z.string().min(10, { message: "A valid contact number is required." }),
  healthInfo: z.string().min(1, { message: "Health information is required." }),
});

export const appointmentSchema = z.object({
  id: z.string().optional(),
  patientId: z.string({ required_error: "Please select a patient." }),
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().min(1, "Description is required."),
  comments: z.string().optional(),
  appointmentDate: z.date({ required_error: "Appointment date is required." }),
  status: z.enum(["Scheduled", "Completed", "Cancelled"]),
  treatmentDescription: z.string().optional(),
  cost: z.coerce.number().optional(),
  nextAppointmentDate: z.date().optional().nullable(),
  files: z.any().optional(),
});
