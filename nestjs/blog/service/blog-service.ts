import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/service/base.service';
import { CloudStorageService } from '../../shared/service/cloudStorage.service';
import { Blog } from '../model/blog.model';
import { HelperService } from '../../shared/service/helper.service';
import { BlogDto } from '../dto/blog.dto';
import { UpdateStatusRequest } from '../dto/update-status.request';
import { WhereAttributeHash } from 'sequelize/types/model';
import sequelize, { Op, QueryTypes } from 'sequelize';
import { PageResponseDto } from '../../shared/dto/page-response.dto';
import { CreateBlogRequestDto } from '../dto/create-blog-request.dto';
import { BlogAuthor } from '../model/blog-author.model';
import { BlogListingRequestDto } from '../dto/blog-listing-request.dto';
import { TagBlog } from '../model/tag-blog.model';
import { BlogTag } from '../../tags/model/blog-tag.model';

@Injectable()
export class BlogService extends BaseService {
  constructor (
        @Inject('BLOG_REPOSITORY')
        private blogRepository: typeof Blog,
        @Inject('TAG_BLOG_REPOSITORY')
        private tagBlogRepository: typeof TagBlog,
        private readonly cloudStorage: CloudStorageService
  ) {
    super()
  }

  private readonly logger = new Logger(BlogService.name)
  // create
  async create (request: CreateBlogRequestDto, file: any) {
    const blog = new Blog()
    blog.author = Number(request.author)
    // if its published then only we mark it as active
    blog.status = request.status
    if (request.status === 'false') {
      blog.isScheduled = request.isScheduled
    } else {
      blog.isScheduled = false
    }
    blog.slugEn = request.slugEn
    blog.articleTitleEn = request.articleTitleEn
    blog.descriptionEn = request.descriptionEn
    blog.readingTime = !HelperService.isNull(request.readingTime) ? request.readingTime : null
    blog.publishedDate = !HelperService.isNull(request.publishedDate) ? request.publishedDate : null
    blog.publishedTime = !HelperService.isNull(request.publishedTime) ? request.publishedTime : null
    blog.slugAr = !HelperService.isNull(request.slugAr) ? request.slugAr : null
    blog.articleTitleAr = !HelperService.isNull(request.articleTitleAr) ? request.articleTitleAr : null
    blog.descriptionAr = !HelperService.isNull(request.descriptionAr) ? request.descriptionAr : null
    blog.metaDescriptionEn = !HelperService.isNull(request.metaDescriptionEn) ? request.metaDescriptionEn : null
    blog.metaKeywordsEn = !HelperService.isNull(request.metaKeywordsEn) ? request.metaKeywordsEn : null
    blog.metaDescriptionAr = !HelperService.isNull(request.metaDescriptionAr) ? request.metaDescriptionAr : null
    blog.metaKeywordsAr = !HelperService.isNull(request.metaKeywordsAr) ? request.metaKeywordsAr : null

    const blogRec = await blog.save()

    const tags = request.tag.split(',')
    const bulkAdd = []
    for (const tag of tags) {
      bulkAdd.push({ tagId: tag, blogId: blogRec.id })
    }

    const self = this
    await TagBlog.bulkCreate(bulkAdd).catch(function (err) {
      self.logger.log(err)
    })

    if (file) {
      blogRec.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        blogRec.id.toString(),
        'blog-pictures'
      )
      await blogRec.save()
    }

    return await this.getOne(blogRec.id)
  }

  // update
  async update (id: string, request: CreateBlogRequestDto, file: any) {
    const blog = await this.blogRepository.findByPk<Blog>(id)
    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND)
    }
    blog.author = Number(request.author)
    // if its published then only we mark it as active
    blog.status = request.status
    if (request.status === 'false') {
      blog.isScheduled = request.isScheduled
    } else {
      blog.isScheduled = false
    }
    blog.slugEn = request.slugEn
    blog.articleTitleEn = request.articleTitleEn
    blog.descriptionEn = request.descriptionEn
    blog.readingTime = !HelperService.isNull(request.readingTime) ? request.readingTime : null
    blog.publishedDate = !HelperService.isNull(request.publishedDate) ? request.publishedDate : null
    blog.publishedTime = !HelperService.isNull(request.publishedTime) ? request.publishedTime : null
    blog.slugAr = !HelperService.isNull(request.slugAr) ? request.slugAr : null
    blog.articleTitleAr = !HelperService.isNull(request.articleTitleAr) ? request.articleTitleAr : null
    blog.descriptionAr = !HelperService.isNull(request.descriptionAr) ? request.descriptionAr : null
    blog.metaDescriptionEn = !HelperService.isNull(request.metaDescriptionEn) ? request.metaDescriptionEn : null
    blog.metaKeywordsEn = !HelperService.isNull(request.metaKeywordsEn) ? request.metaKeywordsEn : null
    blog.metaDescriptionAr = !HelperService.isNull(request.metaDescriptionAr) ? request.metaDescriptionAr : null
    blog.metaKeywordsAr = !HelperService.isNull(request.metaKeywordsAr) ? request.metaKeywordsAr : null

    const blogRec = await blog.save()

    const tags = request.tag.split(',')
    const bulkAdd = []
    for (const tag of tags) {
      bulkAdd.push({ tagId: tag, blogId: blogRec.id })
    }

    // force : will remove permanently
    await TagBlog.destroy({
      where: { blogId: id },
      force: true
    })

    const self = this
    await TagBlog.bulkCreate(bulkAdd).catch(function (err) {
      self.logger.log(err)
    })

    if (file) {
      blogRec.image = await this.cloudStorage.prop.uploadFile(
        file,
        this.cloudStorage.publicBucket,
        blogRec.id.toString(),
        'blog-pictures'
      )
      await blogRec.save()
    }

    // force blog update
    await this.blogRepository.sequelize.query('UPDATE blogs set updated_at = now() where id = :id', { type: QueryTypes.UPDATE, raw: true, replacements: { id } })

    return await this.getOne(blogRec.id)
  }

  // get one
  async getOne (id: string) {
    const blog = await this.blogRepository.findOne<Blog>({
      where: { id },
      include: [
        { model: BlogAuthor },
        {
          model: TagBlog,
          include: [{ model: BlogTag }]
        }
      ]
    })
    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND)
    }

    return new BlogDto(blog)
  }

  // get schedule records
  async getScheduledRecords () {
    const records = await this.blogRepository.findAll<Blog>({
      where: { status: false, isScheduled: true }, logging: true
    })

    const dtos = [];
    for (const record of records) {
      dtos.push(await new BlogDto(record))
    }

    return dtos
  }

  // update status
  async updateStatus (id: string, request: UpdateStatusRequest) {
    const blog = await this.blogRepository.findByPk<Blog>(id)
    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND)
    }

    blog.status = request.status
    await blog.save()
  }

  // delete
  async delete (id: string) {
    const blog = await this.blogRepository.findByPk<Blog>(id)
    if (!blog) {
      throw new HttpException('Blog not found.', HttpStatus.NOT_FOUND)
    }

    await this.blogRepository.sequelize.query('update tag_blogs set deleted_at = now() where blog_id= (:id)',
      { replacements: { id }, type: QueryTypes.UPDATE, raw: true })

    await blog.destroy()
  }

  // listing
  async getAll (request: BlogListingRequestDto) {
    const searchOrCondition: WhereAttributeHash = []
    const filterAndCondition = []
    let where: any = this.whereCondition

    // if the search query is provided
    if (request.search) {
      searchOrCondition.push(sequelize.where(
        sequelize.cast(sequelize.col('blogs.id'), 'varchar'),
        { [Op.iLike]: `%${request.search}%` }
      ))
      searchOrCondition.push({
        article_title_en: { [Op.iLike]: `%${request.search}%` }
      })
      // searchOrCondition.push({
      //   '$blogTag.title$': { [Op.iLike]: `%${request.search}%` }
      // })
      // searchOrCondition.push({
      //   '$blogAuthor.title$': { [Op.iLike]: `%${request.search}%` }
      // })
    }

    if (searchOrCondition.length > 0) {
      where = {
        [Op.and]: [{ [Op.or]: searchOrCondition }, this.whereCondition]
      }
    }

    if (request.active !== undefined) {
      filterAndCondition.push({ status: request.active })
    }

    if (request.author !== undefined) {
      filterAndCondition.push({ author: request.author })
    }

    if (request.status && request.status === 'unpublish') {
      filterAndCondition.push({ status: false })
    }
    if (request.status && request.status === 'publish') {
      filterAndCondition.push({ status: true })
    }

    const blogIds = []
    if (request.tags !== undefined) {
      const query = await this.tagBlogRepository.sequelize.query('select DISTINCT blog_id from tag_blogs where deleted_at is NULL and tag_id in (:tags)',
        { replacements: { tags: request.tags }, type: QueryTypes.SELECT, raw: true })
      // eslint-disable-next-line array-callback-return
      query.map(q => {
        // eslint-disable-next-line dot-notation
        blogIds.push(q['blog_id'])
      })
    }

    if (blogIds.length > 0) {
      filterAndCondition.push({ id: { [Op.in]: blogIds } })
    }
    if (request.tags !== undefined && blogIds.length === 0) {
      filterAndCondition.push({ id: { [Op.eq]: 0 } })
    }

    // if dates filters are provided
    if (request.fromDate) {
      filterAndCondition.push({
        publishedDate: {
          [Op.gte]: new Date(request.fromDate).setHours(0, 0, 0)
        }
      })
    }
    if (request.toDate) {
      filterAndCondition.push({
        publishedDate: {
          [Op.lte]: new Date(request.toDate).setHours(24, 60, 60)
        }
      })
    }

    // getting the updated where condition
    where = this.getWhereConditions(where, searchOrCondition, filterAndCondition)

    // include relationships
    const includes = [
      { model: BlogAuthor },
      {
        model: TagBlog,
        include: [{ model: BlogTag }]
      }
    ]

    // performing the find count all to find all the results
    const blogs: { rows: Blog[]; count: number } =
            await this.blogRepository.findAndCountAll(
              this.getFindAllOptions(request, where, includes)
            )
    return new PageResponseDto(
      blogs.rows.map((blog) => new BlogDto(blog)),
      blogs.count,
      request.page,
      request.size
    )
  }

  async validateTagDelete (id) {
    return await this.tagBlogRepository.findOne<TagBlog>({ where: { tag: id } })
  }
}
