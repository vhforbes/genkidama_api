import axios from 'axios';

const ValidateSignature = async () => {
  //   const transmissionId = headers['PAYPAL-TRANSMISSION-SIG'];
  //   const authAlgo = headers['PAYPAL-AUTH-ALGO'];
  //   const signature = headers['PAYPAL-CERT-URL'];

  const response = await axios.post(
    'https://api-m.sandbox.paypal.com/v1/notifications/verify-webhook-signature',
    {
      headers: {
        Authorization:
          'Bearer A21AAIm0iaYkeBqI8EmDV2QKL3xNMSjGUabITwtjvmGzP51Rw4jw4s3_j-BD34zklCuPNPUCGsXq3VjqxZtuAShacn2I5CjAQ',
      },
    },
  );

  console.log(response);
};

export default ValidateSignature;
