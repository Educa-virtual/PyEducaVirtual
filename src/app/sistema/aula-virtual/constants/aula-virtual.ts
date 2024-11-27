import {
    IActividadConfig,
    TAREA,
    FORO,
    EVALUACION,
    VIDEO_CONFERENCIA,
    MATERIAL,
    IActividad,
} from '../interfaces/actividad.interface'
import { ConstantesService } from '@/app/servicios/constantes.service'
const _ConstantesService = new ConstantesService()
const iPerfilId = _ConstantesService.iPerfilId
export const actividadesConfig: Record<
    number,
    Omit<IActividadConfig, 'cProgActTituloLeccion'>
> = {
    [TAREA]: {
        'icon-color': 'text-blue-500',
        'bg-color': 'bg-blue-500 text-white',
        icon: 'matAssignment',
        cActTipoNombre: 'Tarea',
        iActTipoId: TAREA,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
                isVisible: () => iPerfilId === 7,
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
                isVisible: () => iPerfilId === 7,
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
        ],
    },
    [FORO]: {
        'icon-color': 'text-green-500',
        'bg-color': 'bg-green-500 text-white',
        icon: 'matForum',
        cActTipoNombre: 'Foro',
        iActTipoId: FORO,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
                isVisible: () => iPerfilId === 7,
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
                isVisible: () => iPerfilId === 7,
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
        ],
    },
    [EVALUACION]: {
        'icon-color': 'text-yellow-500',
        'bg-color': 'bg-yellow-500 text-white',
        icon: 'matQuiz',
        cActTipoNombre: 'Evaluación Formativa',
        iActTipoId: EVALUACION,
        acciones: [
            {
                icon: 'pi pi-pencil',
                accion: 'EDITAR',
                class: '',
                label: 'Editar',
                isVisible: (row) => row.iEstado === 1 && iPerfilId === 7,
            },
            {
                icon: 'pi pi-trash',
                accion: 'ELIMINAR',
                class: '',
                label: 'Eliminar',
                isVisible: (row) => row.iEstado === 1 && iPerfilId === 7,
            },
            {
                icon: 'pi pi-eye',
                accion: 'VER',
                class: '',
                label: 'Ver',
            },
            {
                icon: {
                    size: 'xs',
                    color: '',
                    name: 'matSendOutline',
                },
                accion: 'PUBLICAR',
                class: '',
                label: 'Publicar',
                isVisible: (row) => row.iEstado === 1 && iPerfilId === 7,
            },
            {
                icon: {
                    size: 'xs',
                    color: '',
                    name: 'matCancelScheduleSendOutline',
                },
                accion: 'ANULAR_PUBLICACION',
                class: '',
                label: 'Anular Publicación',
                isVisible: (row) => row.iEstado === 2 && iPerfilId === 7,
            },
            {
                icon: {
                    size: 'xs',
                    color: '',
                    name: 'pi pi-file-export', // Clase PrimeNG para ícono de exportar archivo
                },
                accion: 'EXPORTAR_ARCHIVO',
                class: '',
                label: 'Exportar Word',
                isVisible: (row) => row.iEstado === 2 && iPerfilId === 7,
            },
        ],
    },
    [VIDEO_CONFERENCIA]: {
        'icon-color': 'text-pink-500',
        'bg-color': 'bg-pink-500 text-white',
        icon: 'matVideocam',
        cActTipoNombre: 'Video Conferencia',
        iActTipoId: VIDEO_CONFERENCIA,
    },
    [MATERIAL]: {
        'icon-color': 'text-indigo-500',
        'bg-color': 'bg-indigo-500 text-white',
        icon: 'matDescription',
        cActTipoNombre: 'Material',
        iActTipoId: MATERIAL,
    },
}

export const actividadesConfigList: Partial<IActividad>[] = [
    {
        iProgActId: '1',
        cProgActTituloLeccion: 'Sesiones de Aprendizaje',
        cActTipoNombre: 'Tareas',
    },
    {
        iProgActId: '2',
        cProgActTituloLeccion: 'Debate sobre tema de actualidad',
        cActTipoNombre: 'Foro',
    },
    {
        iProgActId: '3',
        cProgActTituloLeccion: 'Examen parcial',
        cActTipoNombre: 'Evaluación',
    },
    {
        iProgActId: '4',
        cProgActTituloLeccion: 'Clase virtual de Matemáticas',
        cActTipoNombre: 'Video Conferencia',
    },
    {
        iProgActId: '5',
        cProgActTituloLeccion: 'Lectura de material adicional',
        cActTipoNombre: 'Material',
    },
]
