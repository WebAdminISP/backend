import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  async getUsers(page: number, limit: number) {
    const skippedItems = (page - 1) * limit;
    return this.usersRepository.find({
      skip: skippedItems,
      take: limit,
    });
  }

  async getUserById(id: string) {
    const user = await this.usersRepository.findOne({
      where: { id: id },
    });

    if (user) {
      return {
        ...user,
      };
    } else {
      return null;
    }
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({ where: { email } });
  }

  async updateUser(id: string, updatedUserData: Partial<User>) {
    const oldUser = await this.usersRepository.findOneBy({ id: id });

    if (!oldUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Merge de datos: copiar las propiedades actualizadas al usuario existente
    Object.assign(oldUser, updatedUserData);

    const updatedUser = await this.usersRepository.save(oldUser);
    return updatedUser;
  }

  async deleteUser(id: string) {
    const oldUser = await this.usersRepository.findOne({
      where: { id },
    });

    if (!oldUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.usersRepository.remove(oldUser);

    return { success: `User with id: ${id} deleted successfully` };
  }
}
