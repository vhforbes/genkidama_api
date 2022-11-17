import { sign, verify } from 'jsonwebtoken';
import AuthConfig from '../../config/auth';
import AppError from '../../errors/AppError';

interface Request {
  refreshToken: string;
}

interface Return {
  token: string;
}

interface JwtPayload {
  id: string;
  name: string;
}

class RefreshTokenService {
  public static async execute({ refreshToken }: Request): Promise<Return> {
    const RefreshTokenConfig = AuthConfig.refreshToken;
    const AuthTokenConfig = AuthConfig.jwt;

    try {
      const decoded = verify(
        refreshToken,
        RefreshTokenConfig.secret,
      ) as JwtPayload;

      let newToken = sign(
        { id: decoded.id, name: decoded.name },
        AuthTokenConfig.secret,
        {
          expiresIn: AuthTokenConfig.expiresIn,
        },
      );

      return { token: newToken };
    } catch {
      throw new AppError('Invalid refresh token');
    }
  }
}

export default RefreshTokenService;
