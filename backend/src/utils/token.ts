import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { config } from '../config';

export interface JwtPayload {
  userId: string;
  role: string;
  jti?: string;
}

export function generateTokens(userId: string, role: string) {
  const accessToken = jwt.sign(
    { userId, role } as JwtPayload,
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );

  // jti aléatoire : deux tokens générés la même seconde restent uniques
  // (la colonne refresh_tokens.token est UNIQUE → sans jti, reconnexion
  // immédiate = contrainte P2002 = erreur 500 au login).
  const refreshToken = jwt.sign(
    { userId, role, jti: randomUUID() } as JwtPayload,
    config.jwtRefreshSecret,
    { expiresIn: config.jwtRefreshExpiresIn }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtRefreshSecret) as JwtPayload;
}
