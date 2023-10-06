import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { Verification } from './entities/verification.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { BadRequest } from 'src/Services/BadRequestResponse';

@Injectable()
export class VerificationService {
  constructor (
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>
  ) {}

  async create(user: User, verificationCode: string) {
    try {
      return await this.verificationRepository.save({
        user: user,
        verificationCode: verificationCode
      })
    } catch (err) {
      throw err.message
    }
  }

  findAll() {
    return `This action returns all verification`;
  }

  findOne(id: number) {
    return `This action returns a #${id} verification`;
  }

  update(id: number, updateVerificationDto: UpdateVerificationDto) {
    return `This action updates a #${id} verification`;
  }

  async removeUserVerification (user: User) {
    try {
      const existingVerification = this.verificationRepository.findOne({
        where: {
            user: {
              id: user.id
            }
        }
      })
      if (!existingVerification) {
        return BadRequest('User dosent have a verificationCode')
      }
      return this.verificationRepository.delete({user})
    } catch (err) {
      throw err.message
    }
  }

  remove(id: number) {
    
  }
}
