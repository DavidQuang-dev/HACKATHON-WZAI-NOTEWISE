export interface JwtPayload {
    sub: string; // User ID
    email: string; // User email
}

export interface Tokens {
    accessToken: string;
}