import { DOCENTE } from '@/app/servicios/perfilesConstantes';
import {
  IActividadConfig,
  TAREA,
  FORO,
  EVALUACION,
  VIDEO_CONFERENCIA,
  IActividad,
  CUESTIONARIO,
} from '../interfaces/actividad.interface';

export const actividadesConfig: Record<number, Omit<IActividadConfig, 'cProgActTituloLeccion'>> = {
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
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-trash',
        accion: 'ELIMINAR',
        class: '',
        label: 'Eliminar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
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
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-trash',
        accion: 'ELIMINAR',
        class: '',
        label: 'Eliminar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
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
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-trash',
        accion: 'ELIMINAR',
        class: '',
        label: 'Eliminar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-eye',
        accion: 'VER',
        class: '',
        label: 'Ver',
      },
    ],
  },
  [VIDEO_CONFERENCIA]: {
    'icon-color': 'text-pink-500',
    'bg-color': 'bg-pink-500 text-white',
    icon: 'matVideocam',
    cActTipoNombre: 'Video Conferencia',
    iActTipoId: VIDEO_CONFERENCIA,
    acciones: [
      {
        icon: 'pi pi-pencil',
        accion: 'EDITAR',
        class: '',
        label: 'Editar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-trash',
        accion: 'ELIMINAR',
        class: '',
        label: 'Eliminar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-external-link',
        accion: 'INGRESAR',
        class: '',
        label: 'Ingresar',
      },
    ],
  },
  // [MATERIAL]: {
  //     'icon-color': 'text-indigo-500',
  //     'bg-color': 'bg-indigo-500 text-white',
  //     icon: 'matDescription',
  //     cActTipoNombre: 'Material',
  //     iActTipoId: MATERIAL,
  // },
  [CUESTIONARIO]: {
    'icon-color': 'text-pink-500',
    'bg-color': 'bg-pink-500 text-white',
    icon: 'matDescription',
    cActTipoNombre: 'Cuestionario',
    iActTipoId: CUESTIONARIO,
    acciones: [
      {
        icon: 'pi pi-pencil',
        accion: 'EDITAR',
        class: '',
        label: 'Editar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-trash',
        accion: 'ELIMINAR',
        class: '',
        label: 'Eliminar',
        isVisible: (row, iPerfilId) => [1, 2].includes(row['iEstado']) && iPerfilId === DOCENTE,
      },
      {
        icon: 'pi pi-eye',
        accion: 'VER',
        class: '',
        label: 'Ver',
      },
    ],
  },
};

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
];

export const abecedario = [
  {
    code: 'a',
    id: 0,
  },
  {
    code: 'b',
    id: 1,
  },
  {
    code: 'c',
    id: 2,
  },
  {
    code: 'd',
    id: 3,
  },
  {
    code: 'e',
    id: 4,
  },
  {
    code: 'f',
    id: 5,
  },
  {
    code: 'g',
    id: 6,
  },
  {
    code: 'h',
    id: 7,
  },
  {
    code: 'i',
    id: 8,
  },
  {
    code: 'j',
    id: 9,
  },
  {
    code: 'k',
    id: 10,
  },
  {
    code: 'l',
    id: 11,
  },
  {
    code: 'm',
    id: 12,
  },
  {
    code: 'n',
    id: 13,
  },
  {
    code: 'ñ',
    id: 14,
  },
  {
    code: 'o',
    id: 15,
  },
  {
    code: 'p',
    id: 16,
  },
  {
    code: 'q',
    id: 17,
  },
  {
    code: 'r',
    id: 18,
  },
  {
    code: 's',
    id: 19,
  },
  {
    code: 't',
    id: 20,
  },
  {
    code: 'u',
    id: 21,
  },
  {
    code: 'v',
    id: 22,
  },
  {
    code: 'x',
    id: 23,
  },
  {
    code: 'y',
    id: 24,
  },
  {
    code: 'z',
    id: 25,
  },
];
