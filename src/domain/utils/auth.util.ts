import * as jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

export abstract class AuthUtil {
  static async generateJwt(name: string, id: number): Promise<string> {
    const payload: { id: number; name: string } = { id, name };
    const options: { expiresIn: string } = { expiresIn: '1h' };

    return await jwt.sign(payload, process.env.JWT_SECRET, options);
  }

  static async generateRefreshToken(): Promise<string> {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomString = '';

    while (randomString.length < 80) {
      const byte: number = randomBytes(1)[0];
      const id: number = byte % characters.length;
      const character: string = characters[id];
      randomString += character;
    }

    return randomString;
  }
}
