import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity("users")
  export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    public id!: number;
  
    @Column({ type: 'varchar', length: 120 })
    public name: string;
  
    @Column({ type: 'varchar', length: 120 })
    surname: string;
  
    @Column({ type: 'varchar', length: 120 })
    email: string;
  
    @Column({ type: 'varchar', length: 120 })
    passwordHash: string;
  
    @Column({ type: 'boolean', default: false })
    public isDeleted: boolean;
  
    @CreateDateColumn({ type: 'timestamp' })
    public createdAt: Date;
  
    @CreateDateColumn({ type: 'timestamp' })
    public updateAt: Date;
  }
  