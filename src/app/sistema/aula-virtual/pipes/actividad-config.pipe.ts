import { Pipe, type PipeTransform } from '@angular/core'
import { actividadesConfig } from '../interfaces/actividad.interface'

@Pipe({
    name: 'appActividadConfig',
    standalone: true,
})
export class ActividadConfigPipe implements PipeTransform {
    transform(value: string, key: string): string {
        return actividadesConfig[value][key]
    }
}
