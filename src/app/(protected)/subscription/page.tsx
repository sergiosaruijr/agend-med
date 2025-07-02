import {
  PageActions,
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageHeaderContent,
  PageTitle,
} from "@/components/ui/page-container";

import SubscriptionCard from "./_components/subscription-card";

const SubscriptionPage = () => {
  return (
    <PageContainer>
      <PageHeader>
        <PageHeaderContent>
          <PageTitle>Assinatura</PageTitle>
          <PageDescription>Gerencie a sua assinatura.</PageDescription>
        </PageHeaderContent>
        <PageActions>
          {/* <AddPatientButton /> */}
          <button></button>
        </PageActions>
      </PageHeader>

      <PageContent>
        <SubscriptionCard active={false} className="w-[350px]" />
      </PageContent>
    </PageContainer>
  );
};

export default SubscriptionPage;
