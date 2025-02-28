import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
    name: 'removeHTMLCSS',
    standalone: true,
})
export class RemoveHTMLCSSPipe implements PipeTransform {
    transform(text: string): string {
        const div = document.createElement('div')
        div.innerHTML = text
        return div.textContent || div.innerText || ''
    }
}
