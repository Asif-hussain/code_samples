import {
  Body,
  Controller, Delete,
  Get,
  Param, Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { TransactionInterceptor } from '../../shared/interceptor/transaction.interceptor';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { BlogService } from '../service/blog-service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateStatusRequest } from '../dto/update-status.request';
import { BlogAuthorDto } from '../dto/blog-author.dto';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { CreateBlogRequestDto } from '../dto/create-blog-request.dto';
import { BlogListingRequestDto } from '../dto/blog-listing-request.dto';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('cms/blogs')
@SkipThrottle()
@UseInterceptors(TransactionInterceptor)
@ApiTags('CMS - Blog')
export class BlogController {
  constructor (private readonly service: BlogService) {
  }

  /**
   * @param req
   * @param request
   * @param file
   * @returns BlogAuthorDto
   */
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  create (
      @Request() req,
      @Body() request: CreateBlogRequestDto,
      @UploadedFile() file
  ): Promise<any> {
    return this.service.create(request, file)
  }

  /**
   * @param id
   * @param req
   * @param request
   * @param file
   * @returns BlogAuthorDto
   */
  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a blog that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  update (
      @Param('id') id,
      @Request() req,
      @Body() request: CreateBlogRequestDto,
      @UploadedFile() file
  ): Promise<any> {
    return this.service.update(id, request, file)
  }

  /**
   * @param id
   * @param req
   * @returns BlogAuthorDto
   */
  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a blog that exists in the database',
    type: Number
  })
  getOne (
      @Param('id') id,
      @Request() req
  ): Promise<any> {
    return this.service.getOne(id)
  }

  /**
   * @param id
   * @param req
   * @param request
   * @param file
   * @returns void
   */
  @Patch('/:id/update-status')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a blog that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  updateStatus (
      @Param('id') id,
      @Request() req,
      @Body() request: UpdateStatusRequest,
      @UploadedFile() file
  ): Promise<any> {
    return this.service.updateStatus(id, request)
  }

  /**
   * @param id
   * @param req
   * @returns void
   */
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a blog that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  delete (
      @Param('id') id,
      @Request() req
  ): Promise<any> {
    return this.service.delete(id)
  }

  /**
   * @param request
   * @returns PageResponseDto
   */
  @Post('all')
  @ApiOkResponse({ type: [BlogAuthorDto] })
  getAll (@Body() request: BlogListingRequestDto): Promise<PageResponseDto> {
    return this.service.getAll(request)
  }
}
