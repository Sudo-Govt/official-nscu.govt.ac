
import React from 'react';
import PageLayout from '@/components/PageLayout';
import AdmissionForm from '@/components/AdmissionForm';

const AdmissionApplication = () => {
  return (
    <PageLayout 
      title="Admission Application" 
      description="Apply to join our university programs"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Apply Now</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start your journey with us by completing the application form below. 
            All fields marked with an asterisk (*) are required.
          </p>
        </div>
        <AdmissionForm />
      </div>
    </PageLayout>
  );
};

export default AdmissionApplication;
