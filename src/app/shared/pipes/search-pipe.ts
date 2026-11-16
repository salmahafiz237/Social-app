import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../../features/timeline/components/posts/models/post.interface';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(arr:Post[], searchWord: string): any  {

    return arr.filter((post)=> post.user.name.toLowerCase().includes(searchWord.toLowerCase()));
  }
}
