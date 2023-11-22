import crypto from 'crypto';

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
    'fd8907a756c5d4a9cc1ad6cfb559d9a8fdf248e206207264eea4e4a4b7822b78',
  );
  return hmac.update(prehash).digest('base64');
};
