// university/university.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from './entities/university-upload.entity';


@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UniversityUpload) private uploadRepo: Repository<UniversityUpload>,
  ) {}

  async updateProfile(userId: string, updateData: Partial<User>) {
    await this.userRepo.update(userId, updateData);
    return this.userRepo.findOneBy({ id: userId });
  }

  async createUpload(userId: string, data: any, filePath: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    const upload = this.uploadRepo.create({
      ...data,
      file_path: filePath,
      user,
    });
    return this.uploadRepo.save(upload);
  }

  async getMyUploads(userId: string) {
    return this.uploadRepo.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }



   async getUserById(userId: string) {
    // This finds the full user profile (name, university, bio, image)
    return this.userRepo.findOneBy({ id: userId });
  }


  async getUploadById(id: string) {
  return this.uploadRepo.findOne({
    where: { id },
    relations: ['user'], // Optional: if you need user data too
  });
}
}
