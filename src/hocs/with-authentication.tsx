// Higher Order Component
// recebe componente e renderiza, executa uma ação antes

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const WithAuthentication = async ({
  children,
  mustHavePlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHavePlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }

  if (mustHavePlan && !session.user.plan) {
    redirect("/plan");
  }

  if (mustHaveClinic && !session.user.clinic) {
    redirect("/clinic-form");
  }
  return children;
};

export default WithAuthentication;
