import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import SubscriptionCard from "../(protected)/subscription/_components/subscription-card";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  if (session?.user.plan) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-4">
      <div className="mx-auto max-w-2xl text-center">
        {/* Marketing Header */}
        <div className="mb-8">
          <div className="mb-4 inline-flex items-center rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
            🚀 Transforme sua clínica hoje mesmo
          </div>

          <h1 className="mb-4 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
            Desbloquei todo o potencial da sua clínica
          </h1>

          <p className="mb-6 text-xl leading-relaxed text-gray-600">
            Para continuar utilizando nossa plataforma e transformar a gestão do
            seu consultório, é necessário escolher um plano que se adapte às
            suas necessidades.
          </p>

          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="font-medium text-amber-800">
              ⚡{" "}
              <strong>
                Profiossionais que utilizam nossa plataforma economizam em média
                15 horas por semana
              </strong>{" "}
              em tarefas administrativas. Não perca mais tempo com agendas
              manuais e processos ineficientes!
            </p>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="mx-auto mb-8 w-full max-w-md">
          <SubscriptionCard userEmail={session?.user.email} />
        </div>
      </div>
    </div>
  );
}
