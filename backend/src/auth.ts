import { BadRequestException, CanActivate, Body, ConflictException, Controller, ExecutionContext, Injectable, Post, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { IsEmail, IsString, MinLength } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './entities';

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}
export class RegisterDto extends LoginDto {
  @IsString() @MinLength(2) name: string;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    try { req.user = this.jwt.verify(token); return true; }
    catch { throw new UnauthorizedException('Connexion requise'); }
  }
}

@Controller('auth')
export class AuthController {
  constructor(@InjectRepository(User) private users: Repository<User>, private jwt: JwtService) {}

  private session(u: User) {
    return { token: this.jwt.sign({ sub: u.id, email: u.email }), user: { id: u.id, email: u.email, name: u.name } };
  }

  @Post('register') async register(@Body() d: RegisterDto) {
    if (await this.users.findOneBy({ email: d.email })) throw new ConflictException('Cet e-mail est déjà utilisé');
    const u = await this.users.save(this.users.create({ email: d.email, name: d.name, passwordHash: await bcrypt.hash(d.password, 10) }));
    return this.session(u);
  }

  @Post('login') async login(@Body() d: LoginDto) {
    const u = await this.users.findOne({ where: { email: d.email }, select: ['id', 'email', 'name', 'passwordHash'] });
    if (!u || !(await bcrypt.compare(d.password, u.passwordHash))) throw new UnauthorizedException('E-mail ou mot de passe incorrect');
    return this.session(u);
  }
}
