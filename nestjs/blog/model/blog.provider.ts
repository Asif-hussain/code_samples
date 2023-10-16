import { BlogAuthor } from './blog-author.model';
import { Blog } from './blog.model';
import { TagBlog } from './tag-blog.model';

export const blogProvider = [
  {
    provide: 'BLOG_AUTHOR_REPOSITORY',
    useValue: BlogAuthor
  },
  {
    provide: 'BLOG_REPOSITORY',
    useValue: Blog
  },
  {
    provide: 'TAG_BLOG_REPOSITORY',
    useValue: TagBlog
  }
]
