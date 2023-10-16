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
import { BlogAuthorService } from '../service/blog-author.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CreateBlogAuthorRequestDto } from '../dto/create-blog-author-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateStatusRequest } from '../dto/update-status.request';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { BlogAuthorDto } from '../dto/blog-author.dto';
import { SkipThrottle } from '@nestjs/throttler';
import { BlogAuthorListingRequestDto } from '../dto/blog-author-listing-request.dto';

@Controller('cms/blogs/author')
@SkipThrottle()
@SkipThrottle()
@UseInterceptors(TransactionInterceptor)
@ApiTags('CMS - Blog Author')
export class BlogAuthorController {
  constructor (private readonly service: BlogAuthorService) {
  }

  /**
   * @param req
   * @param request
   * @param file
   * @returns dto
   */
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  create (
      @Request() req,
      @Body() request: CreateBlogAuthorRequestDto,
      @UploadedFile() file
  ): Promise<any> {
    return this.service.create(request, file)
  }

  /**
   * @param id
   * @param req
   * @param request
   * @param file
   * @returns dto
   */
  @Put('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a author that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @UseGuards(JwtAuthGuard)
  update (
      @Param('id') id,
      @Request() req,
      @Body() request: CreateBlogAuthorRequestDto,
      @UploadedFile() file
  ): Promise<any> {
    return this.service.update(id, request, file)
  }

  /**
   * @param id
   * @param req
   * @returns dto
   */
  @Get('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a author that exists in the database',
    type: Number
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
   * @returns dto
   */
  @Patch('/:id/update-status')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a author that exists in the database',
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
   * @returns dto
   */
  @Delete('/:id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of a author that exists in the database',
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
   * @returns dto
   */
  @Post('all')
  @ApiOkResponse({ type: [BlogAuthorDto] })
  getAll (@Body() request: BlogAuthorListingRequestDto): Promise<PageResponseDto> {
    return this.service.getAll(request)
  }
}
