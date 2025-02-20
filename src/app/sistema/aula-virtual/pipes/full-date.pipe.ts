import { formatDate } from '@angular/common'
import { Pipe, type PipeTransform } from '@angular/core'

@Pipe({
    name: 'fullDate',
    standalone: true,
})
export class FullDatePipe implements PipeTransform {
    transform(value: Date | string | null): string {
        if (!value) return ''

        const format = "EEEE, d 'de' MMMM 'de' yyyy','"
        return formatDate(new Date(value), format, 'es-ES')
    }
}
