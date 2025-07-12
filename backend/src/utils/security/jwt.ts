import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { User } from "../../models/user";
import "../../env";

interface Decoded {
  id: number;
}

export const generateJWT = (user: User) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as Secret,
    {
      expiresIn: process.env.JWT_EXPIRATION,
    } as SignOptions
  );
};

export const verifyJWT = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET as Secret) as Decoded;
};
