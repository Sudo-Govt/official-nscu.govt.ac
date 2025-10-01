import React, { useState } from 'react';
import EmailList from './EmailList';
import EmailViewer from './EmailViewer';
import EmailComposer from './EmailComposer';

const EmailInbox = () => {
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [showComposer, setShowComposer] = useState(false);

  if (showComposer) {
    return (
      <EmailComposer
        replyTo={selectedEmail ? {
          id: selectedEmail.id,
          subject: selectedEmail.subject,
          from_email: selectedEmail.from_email,
        } : undefined}
        onClose={() => {
          setShowComposer(false);
          setSelectedEmail(null);
        }}
      />
    );
  }

  if (selectedEmail) {
    return (
      <EmailViewer
        email={selectedEmail}
        onBack={() => setSelectedEmail(null)}
        onReply={() => setShowComposer(true)}
      />
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Inbox</h2>
      <EmailList type="inbox" onSelectEmail={setSelectedEmail} />
    </div>
  );
};

export default EmailInbox;
