import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { CloudStorageService } from '../../shared/service/cloudStorage.service';
import { BlogAuthor } from '../model/blog-author.model';
import { CreateBlogAuthorRequestDto } from '../dto/create-blog-author-request.dto';
import { HelperService } from '../../shared/service/helper.service';
import { BlogAuthorDto } from '../dto/blog-author.dto';
import { UpdateStatusRequest } from '../dto/update-status.request';
import { WhereAttributeHash } from 'sequelize/types/model';
import { Op, QueryTypes } from 'sequelize';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { Blog } from '../model/blog.model';
import { BlogAuthorListingRequestDto } from '../dto/blog-author-listing-request.dto';

@Injectable()
export class BlogAuthorService extends BaseService {
  constructor (
        @Inject('BLOG_AUTHOR_REPOSITORY')
        private blogAuthorRepository: typeof BlogAuthor,
        @Inject('BLOG_REPOSITORY')
        private blogRepository: typeof Blog,
        private readonly cloudStorage: CloudStorageService
  ) {
    super()
  }

/**
 * create
 * @param request 
 * @param file 
 * @returns 
 */
  async create (request: CreateBlogAuthorRequestDto, file: any) {
    const blogAuthor = new BlogAuthor()
    blogAuthor.nameEn = request.nameEn
    blogAuthor.bioEn = request.bioEn
    blogAuthor.status = request.status
    blogAuthor.nameAr = !HelperService.isNull(request.nameAr) ? request.nameAr : null
    blogAuthor.bioAr = !HelperService.isNull(request.bioAr) ? request.bioAr : null
    blogAuthor.linkedIn = !HelperService.isNull(request.linkedIn) ? request.linkedIn : null
    blogAuthor.github = !HelperService.isNull(request.github) ? request.github : null
    blogAuthor.behance = !HelperService.isNull(request.behance) ? request.behance : null
    blogAuthor.twitter = !HelperService.isNull(request.twitter) ? request.twitter : null
    blogAuthor.instagram = !HelperService.isNull(request.instagram) ? request.instagram : null
    blogAuthor.facebook = !HelperService.isNull(request.facebook) ? request.facebook : null
    blogAuthor.youtube = !HelperService.isNull(request.youtube) ? request.youtube : null

    const author = await blogAuthor.save()
    if (file) {
      blogAuthor.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        author.id.toString(),
        'blog-author-pictures'
      )
      await blogAuthor.save()
    }

    return await this.getOne(author.id)
  }

  // update
  async update (id: string, request: CreateBlogAuthorRequestDto, file: any) {
    const blogAuthor = await this.blogAuthorRepository.findByPk<BlogAuthor>(id)
    if (!blogAuthor) {
      throw new HttpException('Author not found.', HttpStatus.NOT_FOUND)
    }
    blogAuthor.nameEn = request.nameEn
    blogAuthor.bioEn = request.bioEn
    blogAuthor.status = request.status
    blogAuthor.nameAr = !HelperService.isNull(request.nameAr) ? request.nameAr : null
    blogAuthor.bioAr = !HelperService.isNull(request.bioAr) ? request.bioAr : null
    blogAuthor.linkedIn = !HelperService.isNull(request.linkedIn) ? request.linkedIn : null
    blogAuthor.github = !HelperService.isNull(request.github) ? request.github : null
    blogAuthor.behance = !HelperService.isNull(request.behance) ? request.behance : null
    blogAuthor.twitter = !HelperService.isNull(request.twitter) ? request.twitter : null
    blogAuthor.instagram = !HelperService.isNull(request.instagram) ? request.instagram : null
    blogAuthor.facebook = !HelperService.isNull(request.facebook) ? request.facebook : null
    blogAuthor.youtube = !HelperService.isNull(request.youtube) ? request.youtube : null

    const author = await blogAuthor.save()
    if (file) {
      blogAuthor.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        author.id.toString(),
        'blog-author-pictures'
      )
      await blogAuthor.save()
    }

    return await this.getOne(author.id)
  }

  // get one
  async getOne (id: string) {
    const blogAuthor = await this.blogAuthorRepository.findByPk<BlogAuthor>(id)
    if (!blogAuthor) {
      throw new HttpException('Author not found.', HttpStatus.NOT_FOUND)
    }

    return new BlogAuthorDto(blogAuthor)
  }

  // update status
  async updateStatus (id: string, request: UpdateStatusRequest) {
    const blogAuthor = await this.blogAuthorRepository.findByPk<BlogAuthor>(id)
    if (!blogAuthor) {
      throw new HttpException('Author not found.', HttpStatus.NOT_FOUND)
    }

    blogAuthor.status = request.status
    await blogAuthor.save()
  }

  // delete
  async delete (id: string) {
    const blogAuthor = await this.blogAuthorRepository.findByPk<BlogAuthor>(id)
    if (!blogAuthor) {
      throw new HttpException('Author not found.', HttpStatus.NOT_FOUND)
    }

    const validate = await this.blogRepository.findOne<Blog>({ where: { author: id } })
    if (validate) {
      throw new HttpException(
        'Author is associated with a blog',
        HttpStatus.CONFLICT
      )
    }

    await blogAuthor.destroy()
  }

  // listing
  async getAll (request: BlogAuthorListingRequestDto) {
    const searchOrCondition: WhereAttributeHash = []
    const filterAndCondition = []
    let where: any = this.whereCondition

    // if the search query is provided
    if (request.search) {
      // searchOrCondition.push({ id: { [Op.like]: Number(request.search) } })
      searchOrCondition.push({
        name_en: { [Op.iLike]: `%${request.search}%` }
      })
    }

    if (searchOrCondition.length > 0) {
      where = {
        [Op.and]: [{ [Op.or]: searchOrCondition }, this.whereCondition]
      }
    }

    if (request.active !== undefined) {
      filterAndCondition.push({ status: request.active })
    }

    const authorIds = []
    if (request.hasResources) {
      const query = await this.blogRepository.sequelize.query('SELECT DISTINCT author FROM blogs WHERE blogs.deleted_at IS NULL', { type: QueryTypes.SELECT, raw: true })
      // eslint-disable-next-line array-callback-return
      query.map(q => {
        // eslint-disable-next-line dot-notation
        authorIds.push(q['author'])
      })
    }

    if (request.hasResources && authorIds.length >= 0) {
      filterAndCondition.push({ id: { [Op.in]: authorIds } })
    }

    // getting the updated where condition
    where = this.getWhereConditions(where, searchOrCondition, filterAndCondition)

    // performing the find count all to find all the results
    const authors: { rows: BlogAuthor[]; count: number } =
        await this.blogAuthorRepository.findAndCountAll(
          this.getFindAllOptions(request, where, [])
        )

    return new PageResponseDto(
      authors.rows.map((data) => new BlogAuthorDto((data))),
      authors.count,
      request.page,
      request.size
    )
  }
}
