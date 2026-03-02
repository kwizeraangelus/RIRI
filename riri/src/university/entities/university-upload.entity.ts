// university/entities/university-upload.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('university_uploads')
export class UniversityUpload {
  @PrimaryGeneratedColumn('uuid')
  id!:  string;

  @Column()
  submission_type:  string= ''; // e.g., "thesis-computer_science"

  @Column()
  university:  string= '';

  @Column()
  title:  string= '';

  @Column()
  authors:  string= '';

  @Column()
  year: string= '';

  @Column('text')
  description:  string= '';

  @Column()
  supervisor_name:  string= '';

  @Column()
  file_path:  string= '';

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected' = 'pending';

  @ManyToOne(() => User, (user) => user.id)
  user?: User;

  @CreateDateColumn()
  created_at: Date = new Date();
}
