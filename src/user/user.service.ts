import { Injectable, Inject, BadRequestException } from '@nestjs/common'
// import { CreateUserDto } from './dto/create-user.dto'
// import { UpdateUserDto } from './dto/update-user.dto'
import { RegisterUserDto } from './dto/register-user.dto'
import { LoginUserDto } from './dto/login-user.dto'
import { DbService } from 'src/db/db.service'
import { User } from './entities/user.entity'
@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService

  async register(registerUserDto: RegisterUserDto) {
    const users: User[] = await this.dbService.read()

    const foundUser = users.find(
      (item) => item.username === registerUserDto.username,
    )

    if (foundUser) {
      throw new BadRequestException('该用户已经注册')
    }

    const user = new User()
    user.username = registerUserDto.username
    user.password = registerUserDto.password
    users.push(user)

    await this.dbService.write(users)
    return user
  }

  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read<User>()
    const foundUser = users.find(
      (item) => item.username === loginUserDto.username,
    )
    if (!foundUser) {
      throw new BadRequestException('该用户未注册，请注册！')
    }
    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('密码错误！')
    }

    return foundUser
  }
}
