import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ summary: 'List all tasks' })
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @ApiOperation({ summary: 'Get one task by id' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a task' })
  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateTaskDto) {
    return this.tasksService.update(id, body);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.remove(id);
  }
}
