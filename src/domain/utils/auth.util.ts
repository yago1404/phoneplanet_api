import * as jwt from 'jsonwebtoken';

export abstract class AuthUtil {
  static async generateJwt(name: string, id: number): Promise<string> {
    const payload: { id: number; name: string } = { id, name };
    const options: { expiresIn: string } = { expiresIn: '1h' };

    return await jwt.sign(payload, process.env.JWT_SECRET, options);
  }
}
