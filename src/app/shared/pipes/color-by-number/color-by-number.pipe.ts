import { Pipe, PipeTransform } from '@angular/core'

const colors = {
    1: 'bg-blue-500 text-white',
    2: 'bg-green-500 text-white',
    3: 'bg-yellow-500 text-white',
    4: 'bg-pink-500 text-white',
    5: 'bg-indigo-500 text-white',
    6: 'bg-purple-500 text-white',
    7: 'bg-red-500 text-white',
}

@Pipe({
    name: 'colorByNumber',
    standalone: true,
})
export class ColorByNumberPipe implements PipeTransform {
    transform(value: number): string {
        return colors[value]
    }
}
