import { Image } from '../../image/entities/image.entity';
import { User } from '../../user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    OneToMany
  } from 'typeorm';
  
  @Entity()
  export class Post {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    text: string;

    @ManyToOne(() => User, (user) => user.post)
    user: User;

    @OneToMany(() => Image, (image) => image.post)
    image: Image[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
