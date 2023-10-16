import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Blog } from '../model/blog.model';
import { QueryTypes } from 'sequelize';
import moment from 'moment';

@Injectable()
export class CronService {
  constructor (
        @Inject('BLOG_REPOSITORY')
        private blogRepository: typeof Blog
  ) {
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async hourlyJobs () {
    await this.blogScheduleJob()
  }

  // the following method is use get the blogs which have scheduling enabled and update their status
  async blogScheduleJob () {
    const query = 'SELECT * FROM blogs AS blogs WHERE blogs.deleted_at IS NULL AND blogs.status = false AND blogs.is_scheduled = true';

    const list = await this.blogRepository.sequelize.query(query, {
      type: QueryTypes.SELECT,
      raw: true
    });
    // @ts-ignore
    for (const blogKey : Blog in list) {
      // @ts-ignore
      if (list[blogKey].published_date) {
        // @ts-ignore
        const publishDate = moment(list[blogKey].published_date)
        const now = moment()
        if (now >= publishDate) {
          // @ts-ignore
          await this.blogRepository.sequelize.query('UPDATE blogs set status = true, is_scheduled = false where id = :id', { type: QueryTypes.UPDATE, raw: true, replacements: { id: list[blogKey].id } })
        }
      }
    }
  }
}
