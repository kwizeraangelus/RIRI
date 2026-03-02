// university/university.controller.ts
import { Controller, Get, Post, Patch, Body, UseInterceptors, UploadedFile, Req, UseGuards, UnauthorizedException, Param,NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UniversityService } from './university.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { User } from '../users/entities/user.entity';

@Controller('api')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
   const userId = req.user.sub; 
  
  // Fetch the full user object so the frontend has 'username', 'university_name', etc.
  const user = await  this.universityService.getUserById(userId);


  if (!user) throw new UnauthorizedException();
  return user;
  
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('profile_image', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => cb(null, `${Date.now()}${extname(file.originalname)}`)
    })
  }))
  async updateProfile(@Req() req, @Body() body, @UploadedFile() file) {
    const updateData = { ...body };
    if (file) updateData.profile_image = `/uploads/profiles/${file.filename}`;
    return this.universityService.updateProfile(req.user.sub, updateData);
  }
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/research',
      filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
    })
  }))
  async uploadResearch(@Req() req, @Body() body, @UploadedFile() file) {
    return this.universityService.createUpload(req.user.sub, body, file.path);
  }
 @UseGuards(JwtAuthGuard)
  @Get('my-uploads')
  async getMyUploads(@Req() req) {
    return this.universityService.getMyUploads(req.user.id);
  }





@Get('book/:id')
@UseGuards(JwtAuthGuard)
async getBook(@Param('id') id: string) {
  const book = await this.universityService.getUploadById(id);
  
  if (!book) {
    throw new NotFoundException('Book not found');
  }

  // Map the database fields to match what your frontend expects
  return {
    ...book,
    // Ensure file_url points to your NestJS static folder
    file_url: `http://localhost:8000/${book.file_path}`,
    status_display: book.status.toUpperCase(),
  };
}
}
