import React, { useState } from 'react';
import EmailList from './EmailList';
import EmailViewer from './EmailViewer';

const EmailSent = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);

  if (selectedEmail) {
    return (
      <EmailViewer
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        onReply={() => {}}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sent Emails</h2>
      <EmailList type="sent" onSelectEmail={setSelectedEmail} />
    </div>
  );
};

export default EmailSent;
