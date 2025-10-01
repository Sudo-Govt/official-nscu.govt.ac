import React, { useState } from 'react';
import EmailList from './EmailList';
import EmailComposer from './EmailComposer';

const EmailDrafts = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  if (selectedEmail) {
    return (
      <EmailComposer
        onClose={() => setSelectedEmail(null)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Drafts</h2>
      <EmailList type="drafts" onSelectEmail={setSelectedEmail} />
    </div>
  );
};

export default EmailDrafts;
