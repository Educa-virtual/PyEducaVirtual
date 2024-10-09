import { Pipe, type PipeTransform } from '@angular/core'
import { tipoActividadesKeys } from '../interfaces/actividad.interface'

type ActividadConfig = {
    name: string
    'bg-color': string
    icon: string
}

const actividadesConfig: Record<tipoActividadesKeys, ActividadConfig> = {
    tarea: {
        name: 'Actividades',
        'bg-color': 'bg-blue-500 text-white',
        icon: 'matAssignment',
    },
    foro: {
        'bg-color': 'bg-green-500 text-white',
        icon: 'matForum',
        name: 'Foro',
    },
    evaluacion: {
        'bg-color': 'bg-yellow-500 text-white',
        icon: 'matQuiz',
        name: 'Evaluación',
    },
    'video-conferencia': {
        'bg-color': 'bg-pink-500 text-white',
        icon: 'matVideocam',
        name: 'VideoConferencia',
    },
    material: {
        'bg-color': 'bg-indigo-500 text-white',
        icon: 'matDescription',
        name: 'Material',
    },
}

@Pipe({
    name: 'appActividadConfig',
    standalone: true,
})
export class ActividadConfigPipe implements PipeTransform {
    transform(value: string, key: string): string {
        return actividadesConfig[value][key]
    }
}
