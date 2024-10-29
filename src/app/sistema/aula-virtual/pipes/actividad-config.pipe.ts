import { Pipe, type PipeTransform } from '@angular/core'
import { actividadesConfig } from '../interfaces/actividad.interface'

@Pipe({
    name: 'appActividadConfig',
    standalone: true,
})
export class ActividadConfigPipe implements PipeTransform {
    transform(value: number, key: string): any {
        return actividadesConfig[value][key]
    }
}
