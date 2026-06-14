import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, passwordHash: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordHash, salt);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hash,
        puzzleRating: 1200,
        xp: 0,
        level: 1,
        streak: 1
      }
    });

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, xp: user.xp, level: user.level, puzzleRating: user.puzzleRating, streak: user.streak } };
  }

  async login(email: string, passwordHash: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, xp: user.xp, level: user.level, puzzleRating: user.puzzleRating, streak: user.streak } };
  }
}
export default AuthService;
