
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

// src/admin/admin.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { AdminService } from './admin.service';


@Controller('api/admin')
@UseGuards(JwtAuthGuard, AdminGuard) // Only logged-in staff/admin can access
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 1. Dashboard Stats & Pending Books
  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardData();
  }

  // 2. Approve/Reject Research
  @Post('upload/:id/update')
  async updateUploadStatus(@Param('id') id: string, @Body() body: { action: string, feedback?: string }) {
    return this.adminService.processUpload(id, body.action, body.feedback);
  }

  // 3. User Management
  @Get('users')
  async getAllUsers() {
    return this.adminService.getUsers();
  }

  @Put('users/:id/update')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUser(id, body);
  }

  @Delete('users/:id/delete')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // 4. Approved Books with Filters
  @Get('approved-books')
  async getApproved(@Query() filters: any) {
    return this.adminService.getApprovedBooks(filters);
  }

}
