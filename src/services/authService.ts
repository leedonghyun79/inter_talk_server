import { TLSClient, TLSResponse } from '../utils/TLSClient';

const AUTH_API_BASE = process.env.AUTH_API_BASE || 'https://apps-in-toss-api.toss.im/api-partner/v1/apps-in-toss/user/oauth2';
const CLIENT_CERT_PATH = process.env.CLIENT_CERT_PATH;
const CLIENT_KEY_PATH = process.env.CLIENT_KEY_PATH;

let client: TLSClient | null = null;

function getClient(): TLSClient {
  if (!client) {
    if (!CLIENT_CERT_PATH || !CLIENT_KEY_PATH) {
      throw new Error('CLIENT_CERT_PATH or CLIENT_KEY_PATH is not defined in environment variables');
    }
    client = new TLSClient(CLIENT_CERT_PATH, CLIENT_KEY_PATH);
  }
  return client;
}

export interface GetAccessTokenParams {
  authorizationCode: string;
  referrer: string;
}

export interface RefreshTokenParams {
  refreshToken: string;
}

export async function getAccessToken({ authorizationCode, referrer }: GetAccessTokenParams): Promise<TLSResponse> {
  return getClient().post(`${AUTH_API_BASE}/generate-token`, {
    authorizationCode,
    referrer,
  });
}

export async function refreshAccessToken({ refreshToken }: RefreshTokenParams): Promise<TLSResponse> {
  return getClient().post(`${AUTH_API_BASE}/refresh-token`, {
    refreshToken,
  });
}

export async function getUserInfo(accessToken: string): Promise<TLSResponse> {
  return getClient().get(`${AUTH_API_BASE}/login-me`, {
    'Content-Type': 'application/json',
    Authorization: accessToken,
  });
}

export async function logoutByAccessToken(accessToken: string): Promise<TLSResponse> {
  return getClient().post(
    `${AUTH_API_BASE}/access/remove-by-access-token`,
    {},
    { Authorization: accessToken }
  );
}

export async function logoutByUserKey(userKey: string): Promise<TLSResponse> {
  return getClient().post(`${AUTH_API_BASE}/access/remove-by-user-key`, { userKey });
}
