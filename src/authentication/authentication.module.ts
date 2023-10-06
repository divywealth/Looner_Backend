import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { VerificationService } from '../verification/verification.service'
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Verification } from '../verification/entities/verification.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Verification]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `../../env/.env.development`
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {expiresIn: '1h'}
    })
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, VerificationService]
})
export class AuthenticationModule {}
