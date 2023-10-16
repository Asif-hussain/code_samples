import { CacheModule, Logger, Module } from '@nestjs/common';
import { DatabaseModule } from '../../db/database.module'
import { BlogAuthorController } from './controller/blog-author.controller';
import { BlogAuthorService } from './service/blog-author.service';
import { blogProvider } from './model/blog.provider';
import { BlogController } from './controller/blog-controller';
import { BlogService } from './service/blog-service';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [DatabaseModule, TagsModule, CacheModule.register()],
  controllers: [BlogAuthorController, BlogController],
  providers: [BlogAuthorService, BlogService, ...blogProvider, Logger],
  exports: [BlogAuthorService, BlogService, ...blogProvider]
})
export class BlogsModule {}
