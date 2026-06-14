import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PuzzleService } from './puzzle.service';
import { PuzzleController } from './puzzle.controller';
import { CoachGateway } from './coach.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'supersecret_chessos_key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController, PuzzleController],
  providers: [PrismaService, AuthService, PuzzleService, CoachGateway],
})
export class AppModule {}
export default AppModule;
