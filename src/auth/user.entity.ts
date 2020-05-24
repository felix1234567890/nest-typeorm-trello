import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  ManyToMany,
  JoinTable,
  BeforeInsert,
} from 'typeorm';
import { Section } from 'src/sections/section.entity';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity('users')
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  @Exclude()
  password: string;
  @ManyToMany(
    type => Section,
    section => section.users,
    { cascade: true, eager: false },
  )
  @JoinTable({
    name: 'users_sections',
  })
  sections: Section[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
}
