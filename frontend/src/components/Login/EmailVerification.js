// Frontend: EmailVerification.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Success from '../success/Success';
import Failed from '../failed/Failed';
import axios from '../../Axios/axios';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        console.log('Before axios request');
        const response = await axios.post(
          `http://localhost:5000/api/auth/email/activation`,
          { emailCode: id }, // Ensure `id` contains the JWT token
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log('After axios request');
        console.log('Response:', response.data); // Log the response data
        // Update the verificationStatus based on the server response
        setVerificationStatus(response.data.success);
      } catch (error) {
        console.error('Error occurred:', error);
        // Set verificationStatus to false in case of an error
        setVerificationStatus(false);
      }
    };

    verifyEmailUrl();
  }, [id]);

  return (
    <div>
      {verificationStatus === true && <Success />}
      {verificationStatus === false && <Failed />}
      {verificationStatus === null && <p>Verifying...</p>}
    </div>
  );
}

export default EmailVerification;