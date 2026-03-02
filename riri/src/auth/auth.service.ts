import { BadRequestException, ConflictException, Injectable, UnauthorizedException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserCategory } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    if (dto.password !== dto.password_confirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const existing = await this.userRepository.findOne({
      where: [{ email: dto.email }, { username: dto.username }],
    });
    if (existing) {
      throw new ConflictException(existing.email === dto.email ? 'Email already in use' : 'Username already taken');
    }

    const user = this.userRepository.create(dto);
    await this.userRepository.save(user);

    return { message: 'User registered successfully' };
  }






  async login(loginDto: LoginDto): Promise<{ access_token: string; redirect: string }> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'user_category', 'is_active','is_staff'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Decide redirect based on user category
   
    let redirect = '/'; 

if (user.is_staff) {
  redirect = '/admin'; // Matches your Admin folder
} else {
  switch (user.user_category) {
    case 'university': redirect = '/university'; break;
    case 'researcher': redirect = '/researcher'; break;
    case 'conf_organizer': redirect = '/organizer'; break;
    case 'public_visitor':
        redirect = '/';
        break;
    case 'innovator':
        redirect = '/innovator';
        break;
    default: redirect = '/dashboard';
  }
}

    // Generate JWT
    const payload = {
      sub: user.id,
      email: user.email,
      category: user.user_category,
       is_staff: user.is_staff,
    };

    const token = this.jwtService.sign(payload);

   return { 
      access_token: token, // Now the variable is being "read"
      redirect: redirect 
    };}

  // You can add validateUser if you want to use it with Passport local strategy later





  // src/auth/auth.service.ts

async onModuleInit() {
  await this.seedAdmin();
}

async seedAdmin() {
  const adminEmail = 'kwizeraangelus@gmail.com';
  const existingAdmin = await this.userRepository.findOneBy({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const admin = this.userRepository.create({
      username: 'admin',
      email: adminEmail,
      password: hashedPassword,
      first_name: 'System',
      last_name: 'Admin',
      phone_number: '+250782020044',
      user_category: UserCategory.UNIVERSITY, // Use your Enum
      is_staff: true,
      is_active: true,
    });
    await this.userRepository.save(admin);
    console.log(' Admin user created: admin@riri.com / admin123');
  }
}


}