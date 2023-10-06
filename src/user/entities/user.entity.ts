import { Verification } from '../../verification/entities/verification.entity';
import { Post } from '../../post/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  firstname: string;

  @Column({
    nullable: false,
  })
  lastname: string;

  @Column({
    nullable: false,
  })
  email: string;

  @Column({
    nullable: false,
  })
  phoneNo: string;

  @Column({
    nullable: false,
  })
  username: string;

  @Column({
    nullable: true
  })
  profilepic: string;

  @Column({
    nullable: false
  })
  dob: string;

  @Column({
    nullable: false,
  })
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  post: Post[]

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Verification, (verification) => verification.user)
  verification: Verification[]
}
