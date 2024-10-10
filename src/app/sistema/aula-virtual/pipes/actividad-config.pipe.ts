import { Pipe, type PipeTransform } from '@angular/core'

type ActividadConfig = {
    name: string
    'bg-color': string
    icon: string
}

const actividadesConfig: { [key: number]: ActividadConfig } = {
    1: {
        name: 'Actividades',
        'bg-color': 'bg-blue-500 text-white',
        icon: 'matAssignment',
    },
    2: {
        'bg-color': 'bg-green-500 text-white',
        icon: 'matForum',
        name: 'Foro',
    },
    3: {
        'bg-color': 'bg-yellow-500 text-white',
        icon: 'matQuiz',
        name: 'Evaluación',
    },
    4: {
        'bg-color': 'bg-pink-500 text-white',
        icon: 'matVideocam',
        name: 'VideoConferencia',
    },
    5: {
        'bg-color': 'bg-indigo-500 text-white',
        icon: 'matDescription',
        name: 'Material',
    },
    6: { 'bg-color': 'bg-purple-500 text-white', icon: '', name: '' },
    7: { 'bg-color': 'bg-red-500 text-white', icon: '', name: '' },
}

@Pipe({
    name: 'appActividadConfig',
    standalone: true,
})
export class ActividadConfigPipe implements PipeTransform {
    transform(value: number, key: string): string {
        return actividadesConfig[value][key]
    }
}
