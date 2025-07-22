import { headers } from "next/headers";

import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";
import WithAuthentication from "@/hocs/with-authentication";
import { auth } from "@/lib/auth";

import SubscriptionCard from "./_components/subscription-card";

const SubscriptionPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <WithAuthentication mustHaveClinic>
      <PageContainer>
        <PageHeader>
          <PageHeaderContent>
            <PageTitle>Assinatura</PageTitle>
            <PageDescription>Gerencie a sua assinatura.</PageDescription>
          </PageHeaderContent>
        </PageHeader>

        <PageContent>
          <SubscriptionCard
            active={session!.user.plan === "essential"}
            className="w-[350px]"
            userEmail={session!.user.email}
          />
        </PageContent>
      </PageContainer>
    </WithAuthentication>
  );
};

export default SubscriptionPage;
