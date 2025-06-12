import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import AddPatientButton from "./_components/add-patient-button";
import EditPatientButton from "./_components/edit-patient-button";

const PatientsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }
  if (!session?.user.clinic) {
    redirect("/clinic-form");
  }

  const patients = await db.query.patientsTable.findMany({
    where: eq(patientsTable.clinicId, session.user.clinic.id),
  });

  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Pacientes</PageTitle>
          <PageDescription>
            Gerencie os pacientes da sua clínica
          </PageDescription>
        </PageHeaderContent>
        <PageActions>
          <AddPatientButton />
        </PageActions>
      </PageHeader>

      <PageContent>
        {patients.length === 0 ? (
          <div className="text-muted-foreground">
            Nenhum paciente cadastrado ainda.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="bg-card text-card-foreground flex flex-col gap-2 rounded-lg border p-6 shadow-sm"
              >
                <div className="text-lg font-semibold">{patient.name}</div>
                <div className="text-muted-foreground text-sm">
                  {patient.email}
                </div>
                <div className="text-muted-foreground text-sm">
                  {patient.phoneNumber}
                </div>
                <div className="text-sm">
                  Sexo:{" "}
                  {patient.sex === "male"
                    ? "Masculino"
                    : patient.sex === "female"
                      ? "Feminino"
                      : "Outro"}
                </div>
                <div className="mt-2 flex justify-end">
                  <EditPatientButton patient={patient} />
                </div>
              </div>
            ))}
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
};

export default PatientsPage;
