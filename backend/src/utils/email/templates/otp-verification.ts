const otpVerificationTemplate = (otp: string): string => {
  return `
    <html>
    <head>
        <title>OTP Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: #333;
                padding: 20px;
            }
            h1 {
                color: #4CAF50;
            }
            p {
                padding: 20px;
            }
            h1 {
                color: #4CAF50;
            }
            a {
                color: #2196F3;
                text-decoration: none;
            }
        </style>
    </head>
    <body>
        <h1>OTP Verification</h1>
        <p>Your OTP for verification is: <strong>${otp}</strong></p>
        <p>If you did not request this, please ignore this email.</p>
    </body>
</html>
  `;
};

export default otpVerificationTemplate;
