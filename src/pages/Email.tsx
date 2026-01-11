import React from 'react';
import PageLayout from '@/components/PageLayout';
import EmailAppModern from '@/components/email/EmailAppModern';

const Email = () => {
  return (
    <PageLayout
      title="Email"
      description="Manage your university email communications"
    >
      <div className="container mx-auto py-6 px-4">
        <EmailAppModern />
      </div>
    </PageLayout>
  );
};

export default Email;
