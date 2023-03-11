import { responseToCamel } from '../utils/responseToCamel';

// function convertData(originalData) {
//   // ...
//   // return something new
// }

// Maybe implement it one day, change all to camel? How??

export const responseInterceptor = (req, res, next) => {
  let send = res.send;

  res.send = (body: any) => {
    const newBody = responseToCamel(body);
    return newBody;
  };
  next();
};
