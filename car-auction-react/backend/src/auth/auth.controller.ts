import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IUser } from 'src/model/user.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
    public login(@Body() Userdata:any){
      return this.authService.createUserOrLogin(Userdata);
    }
    
  
   
}
