// src/admin/admin.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UniversityUpload } from '../university/entities/university-upload.entity';
import { Event } from '../event/entities/event.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UniversityUpload) private uploadRepo: Repository<UniversityUpload>,
    @InjectRepository(Event) private eventRepo: Repository<Event>,
  ) {}

  async getDashboardData() {
    const [pending, userCount, uploadCount, eventCount] = await Promise.all([
      this.uploadRepo.find({ where: { status: 'pending' }, relations: ['user'] }),
      this.userRepo.count(),
      this.uploadRepo.count({ where: { status: 'approved' } }),
      this.eventRepo.count(),
    ]);

    return {
      kpis: {
        total_users: userCount,
        approved_researches: uploadCount,
        total_events: eventCount,
        pending_count: pending.length,
      },
      pending,
    };
  }

  async processUpload(id: string, action: string, feedback?: string) {
    const status = action === 'approve' ? 'approved' : 'rejected';
    await this.uploadRepo.update(id, { status });
    return { message: `Upload ${status} successfully` };
  }

  async getUsers() {
    return this.userRepo.find();
  }

  async updateUser(id: string, data: any) {
    await this.userRepo.update(id, data);
    return { message: 'User updated' };
  }

  async deleteUser(id: string) {
    await this.userRepo.delete(id);
    return { message: 'User deleted' };
  }

  async getApprovedBooks(filters: any) {
    const where: any = { status: 'approved' };
    if (filters.title) where.title = Like(`%${filters.title}%`);
    if (filters.university) where.university = Like(`%${filters.university}%`);

    const books = await this.uploadRepo.find({ where });
    return { books };
  }
}
