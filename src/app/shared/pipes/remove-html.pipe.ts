import { Pipe, type PipeTransform } from '@angular/core';
// import { removeHTML } from '../utils/remove-html'

@Pipe({
  name: 'removeHTML',
  standalone: true,
})
export class RemoveHTMLPipe implements PipeTransform {
  // transform(value: string): string {
  //     return removeHTML(value)
  // }

  // transform(value: string): string {
  //     if (typeof value !== 'string') {
  //         return '';
  //     }
  // return value.replace(/<[^>]+>/g, '');

  // fullBack:)
  transform(value: any): string {
    return (value || '').toString().replace(/<[^>]+>/g, '');
  }
}
