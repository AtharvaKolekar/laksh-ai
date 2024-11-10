"use client"
import React, { useState } from 'react';
import { Button, message } from 'antd';

const Page = () => {
  // Array of random 6-digit OTPs
  const randomNumbers = [
    '295276', '559636', '990764', '569440', '609128', '847605',
    '766801', '744819', '432837', '374635', '771808', '654322',
    '442211', '842420', '966982', '917758', '141602', '677487',
    '184840', '652583'
  ];

  // State to hold the generated OTP
  const [otp, setOtp] = useState('');

  // Function to generate a random OTP from the array
  const generateOtp = () => {
    const randomOtp = randomNumbers[Math.floor(Math.random() * randomNumbers.length)];
    setOtp(randomOtp);
  };

  // Function to copy the OTP to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(otp);
    message.success('OTP copied to clipboard');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1E3A8A' }}>OTP Generator for Mentors</h1>
      
      {/* Generate OTP button */}
      <Button 
        onClick={generateOtp}
        style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginBottom: '1rem' }}
      >
        Generate OTP
      </Button>
      
      {/* Display OTP if generated */}
      {otp && (
        <div style={{ marginTop: '1.5rem', padding: '1rem',  borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4B5563' }}>Your OTP:</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1E3A8A', marginBottom: '1rem' }}>{otp}</p>
          
          <Button 
            onClick={copyToClipboard}
            style={{ padding: '0.5rem 1rem' }}
          >
            Copy OTP
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
