import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.task.findMany();
  }

  async findOne(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  async create(data: CreateTaskDto) {
    const existing = await this.prisma.task.findFirst({
      where: { title: data.title },
    });
    if (existing) {
      throw new ConflictException(
        `A task titled "${data.title}" already exists`,
      );
    }
    return this.prisma.task.create({ data });
  }

  async update(id: number, data: UpdateTaskDto) {
    await this.findOne(id);
    return this.prisma.task.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.task.delete({ where: { id } });
    return { removed: true };
  }
}
