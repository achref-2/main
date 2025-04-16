import React, { useState } from 'react';
import { gapi } from 'gapi-script';

const SCOPES = 'https://www.googleapis.com/auth/meetings.space.created';

const GoogleMeetIntegration = () => {
  const [meetLink, setMeetLink] = useState('');
  const [error, setError] = useState('');

  const handleAuthClick = () => {
    gapi.load('client:auth2', async () => {
      try {
        await gapi.client.init({
          apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
          clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: SCOPES,
        });

        const authInstance = gapi.auth2.getAuthInstance();
        if (!authInstance) {
          throw new Error('Google Auth instance is null. Ensure clientId and scope are correctly set.');
        }

        if (!authInstance.isSignedIn.get()) {
          await authInstance.signIn();
        }

        createMeetSpace();
      } catch (err) {
        console.error('Error during authentication:', err);
        setError('Failed to authenticate with Google API.');
      }
    });
  };

  const createMeetSpace = async () => {
    try {
      const response = await gapi.client.request({
        path: 'https://www.googleapis.com/meetings/v1/spaces',
        method: 'POST',
        body: {},
      });

      const meetingUri = response.result.meetingUri;
      setMeetLink(meetingUri);
    } catch (err) {
      console.error('Error creating meeting space:', err);
      setError('Failed to create a Google Meet space.');
    }
  };

  

  return (
    <div className="google-meet-integration">
      <button
        onClick={handleAuthClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Google Meet Space
      </button>

      {meetLink && (
        <div className="mt-4">
          <p>Google Meet Link:</p>
          <a
            href={meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {meetLink}
          </a>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-500">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMeetIntegration;