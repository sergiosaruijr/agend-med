import dayjs from "dayjs";
import { CalendarIcon } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import { getDashboard } from "@/data/get-dashboard";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import { appointmentsTableColumns } from "../appointments/_components/table-columns";
import { AppointmentsChart } from "./_components/appointments-chart";
import { DatePicker } from "./_components/date-picker";
import StatsCards from "./_components/stats-cards";
import TopDoctors from "./_components/top-doctors";
import TopSpecialties from "./_components/top-specialties";

interface DashboardPageProps {
  searchParams: Promise<{
    from: string;
    to: string;
  }>;
}

const DashboardPage = async ({ searchParams }: DashboardPageProps) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const { from, to } = await searchParams;
  if (!from || !to) {
    redirect(
      `/dashboard?from=${dayjs().format("YYYY-MM-DD")}&to=${dayjs().add(1, "month").format("YYYY-MM-DD")}`,
    );
  }
  const clinicId = session?.user?.clinic?.id as string;
  const {
    totalRevenue,
    totalAppointments,
    totalPatients,
    totalDoctors,
    topDoctors,
    topSpecialties,
    todayAppointments,
    dailyAppointmentsData,
  } = await getDashboard({
    from,
    to,
    session: {
      user: {
        clinic: {
          id: clinicId,
        },
      },
    },
  });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Dashboard</PageTitle>
            <PageDescription>
              Tenha uma visão geral de suas consultas e pacientes.
            </PageDescription>
          </PageHeaderContent>
          <PageActions>
            <DatePicker />
          </PageActions>
        </PageHeader>

        <PageContent>
          <StatsCards
            totalRevenue={
              totalRevenue?.total ? Number(totalRevenue.total) : null
            }
            totalAppointments={totalAppointments?.total || 0}
            totalPatients={totalPatients?.total || 0}
            totalDoctors={totalDoctors?.total || 0}
          />
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <AppointmentsChart dailyAppointmentsData={dailyAppointmentsData} />
            <TopDoctors doctors={topDoctors} />
          </div>
          <div className="grid grid-cols-[2.25fr_1fr] gap-4">
            <Card>
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CalendarIcon className="text-muted-foreground" />
                    <CardTitle className="text-base">
                      Agendamentos de hoje
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={appointmentsTableColumns}
                  data={todayAppointments}
                />
              </CardContent>
            </Card>
            <TopSpecialties topSpecialties={topSpecialties} />
          </div>
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default DashboardPage;
