import { NestMiddleware, Injectable, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Unauthorized', 401);
    }
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
      const user = await this.usersService.findOne(decoded.email);
      delete user.password;
      if (!user) {
        throw new HttpException('User not found', 401);
      }
      req.user = user;
    } catch (error) {
      throw new HttpException('Unauthorized', 401);
    }

    next();
  }
}
