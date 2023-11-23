import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const generateSignature = (
  timestamp: string,
  method: string,
  requestPath: string,
  body: string = '',
  queryString: string = '',
): string => {
  const prehash =
    timestamp +
    method.toUpperCase() +
    requestPath +
    (queryString ? '?' + queryString : '') +
    body;
  const hmac = crypto.createHmac(
    'sha256',
    process.env.BITGET_ACCESS_SIGNATURE as string,
  );
  return hmac.update(prehash).digest('base64');
};
