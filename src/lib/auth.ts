import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function auth(req?: NextRequest) {
  if (!req) return null;
  const token = await getToken({ req });
  if (!token) return null;
  
  return {
    user: {
      id: token.id as string,
      email: token.email as string,
      username: token.username as string,
      isVerified: token.isVerified as boolean,
      accessToken: token.accessToken as string,
    }
  };
}