import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { BadRequest } from 'src/Services/BadRequestResponse';

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  findAll() {
    try {
      return this.userRepository.find();
    } catch (err) {
      throw err.message
    }
  }

  findOne(id: number) {
    try {
      const existingUser = this.userRepository.findOne({
        where: {
          id : id
        }
      })
      if (existingUser) {
        return existingUser
      }
      return BadRequest('No user with this id found')
    } catch (err) {
      throw err.message
    }
  }
}
