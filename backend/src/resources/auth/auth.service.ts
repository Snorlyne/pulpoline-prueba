import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import CustomeResponse from '../../../core/interfaces/customeResponse';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    password,
    username,
  }: RegisterDto): Promise<CustomeResponse<null>> {
    const user = await this.usersService.findOneByUsername(username);

    if (user) {
      throw new BadRequestException('Username already exists');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    await this.usersService.create({
      username,
      password: hashedPassword,
    });

    return new CustomeResponse(null, 201, 'Registration successful');
  }

  async login({
    username,
    password,
  }: LoginDto): Promise<CustomeResponse<{ token: string; username: string }>> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid username');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = { userId: user.id, username: user.username };

    const token = await this.jwtService.signAsync(payload);

    return new CustomeResponse({ token, username }, 200, 'Login successful');
  }
}
