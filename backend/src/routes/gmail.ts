import { Hono } from 'hono';

const app = new Hono();

/**
 * GET /api/gmail/profile
 * Get user's Gmail profile
 */
app.get('/profile', (c) => {
  return c.json({
    email: 'user@example.com',
    name: 'User',
    picture: 'https://avatar.example.com/user.png',
  });
});

/**
 * GET /api/gmail/labels
 * List all Gmail labels
 */
app.get('/labels', (c) => {
  return c.json({
    labels: [
      { id: 'INBOX', name: 'Inbox', type: 'system' },
      { id: 'SENT', name: 'Sent Mail', type: 'system' },
      { id: 'DRAFT', name: 'Drafts', type: 'system' },
      { id: 'TRASH', name: 'Trash', type: 'system' },
      { id: 'SPAM', name: 'Spam', type: 'system' },
    ],
  });
});

/**
 * GET /api/gmail/messages
 * List messages with pagination
 */
app.get('/messages', async (c) => {
  // This would be implemented with actual Gmail API calls
  return c.json({
    messages: [],
    nextPageToken: null,
    resultSizeEstimate: 0,
  });
});

/**
 * POST /api/gmail/send
 * Send an email
 */
app.post('/send', async (c) => {
  const body = await c.req.json();
  
  // Validate input
  if (!body.to || !body.subject || !body.text) {
    return c.json({ error: 'Missing required fields (to, subject, text)' }, 400);
  }

  // Would send via Gmail API
  return c.json({
    id: Date.now().toString(),
    threadId: Date.now().toString(),
    labelIds: ['SENT'],
  });
});

export default app;
