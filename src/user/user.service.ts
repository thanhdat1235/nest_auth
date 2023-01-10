import { SigninDTO } from './../auth/dto/signin.dto';
import { PrismaService } from './../prisma/prisma.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
    const { email, password } = createUserDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashPasword = await bcrypt.hash(password, 10);

    createUserDto.password = hashPasword;

    try {
      const newUser = await this.prisma.user.create({
        data: createUserDto,
      });
      newUser.password = undefined;
      return newUser;
    } catch (error) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException('Invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      const user = await this.prisma.user.findMany();
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findUnique(userSignin: SigninDTO): Promise<User> {
    const { email, password } = userSignin;

    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
    }

    const passwordMatch = await new Promise((resolve, reject) =>
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          return reject(err);
        }
        return resolve(result);
      }),
    );

    if (!passwordMatch) {
      throw new HttpException(
        'Password was not match',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
