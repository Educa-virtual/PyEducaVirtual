import { Pipe, type PipeTransform } from '@angular/core'
import { removeHTML } from '../utils/remove-html'

@Pipe({
    name: 'removeHTML',
    standalone: true,
})
export class RemoveHTMLPipe implements PipeTransform {
    transform(value: string): string {
        return removeHTML(value)
    }
}
