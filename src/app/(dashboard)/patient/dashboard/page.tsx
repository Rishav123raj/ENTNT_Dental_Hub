import { PatientDashboardClient } from "@/components/dashboard/patient/PatientDashboardClient";

export default function PatientDashboardPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
      <PatientDashboardClient />
    </>
  );
}
