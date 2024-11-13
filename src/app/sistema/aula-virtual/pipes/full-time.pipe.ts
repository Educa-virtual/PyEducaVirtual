import { formatDate } from '@angular/common'
import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
    name: 'fullTime',
    standalone: true,
})
export class FullTimePipe implements PipeTransform {
    transform(value: Date | string | null): string {
        if (!value) return ''

        const format = 'h:mm a'
        return formatDate(new Date(value), format, 'es-ES')
    }
}
