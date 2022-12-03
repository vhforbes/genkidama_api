// import axios from 'axios';
// import url from 'url';

// /*
// [] Check if a auth token already exists ou is expired
// [] Get auth token
// [] Save it somewhere
// []
// */

// class AuthTokenPaypal {
//   public static async execute(): Promise<{}> {
//     const response = await axios({
//       url: 'https://api.sandbox.paypal.com/v1/oauth2/token',
//       method: 'post',
//       headers: {
//         Accept: 'application/json',
//         'Accept-Language': 'en_US',
//         'content-type': 'application/x-www-form-urlencoded',
//       },
//       auth: {
//         username:
//           'AVXXx1iHH4B-iILgv85Hx0KxnPwekFNSP42RGcUyeFRkabrwjaEeS_nfVeggJkKQPplrUi3BbgwTdfFu',
//         password:
//           'ECvYMdjdbnMpGPkJozlM_zK-UE3EETLo9vC5TB5cMX2n4enECYvdJF9o0QD2dSRROvD70NLAme4uSnTC',
//       },
//       params: {
//         grant_type: 'client_credentials',
//       },
//     });

//     const token = response.data.access_token;

//     return {};
//   }
// }

// export default AuthTokenPaypal;
