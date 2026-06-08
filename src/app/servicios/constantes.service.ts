import { Injectable } from '@angular/core';
import { LocalStoreService } from './local-store.service';
import {
  ADMINISTRADOR,
  DIRECTOR_IE,
  DOCENTE,
  ESTUDIANTE,
  JEFE_DE_PROGRAMA,
  SUBDIRECTOR_IE,
  APODERADO,
  AUXILIAR,
  ASISTENTE_SOCIAL,
} from './perfilesConstantes';
import {
  ADMINISTRADOR_DREMO,
  ESPECIALISTA_DREMO,
  ESPECIALISTA_UGEL,
  INSTRUCTOR,
  PARTICIPANTE,
} from './seg/perfiles';
import { administradorDremo, especialistaDremo, especialistaUgel } from './seg/menu-ere';
import { instructor } from './seg/menus/instructor';

const store = new LocalStoreService();
// const modulo = store.getItem('dremoModulo')
const perfil = store.getItem('dremoPerfil');
const verificado = store.getItem('dremoPerfilVerificado');
const user = store.getItem('dremoUser');
const iYAcadId = store.getItem('dremoiYAcadId');
const years = store.getItem('dremoYear');
const inicio = {
  label: 'Inicio',
  icon: 'pi pi-fw pi-home',
  routerLink: ['/inicio'],
};
const docente = [
  {
    items: [
      inicio,
      {
        label: 'Mis áreas curriculares',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/aula-virtual/areas-curriculares'],
      },
      {
        label: 'Actividades de gestión',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['/docente/actividades-no-lectivas'],
      },

      {
        label: 'Informes',
        icon: 'pi pi-fw pi-objects-column',
        items: [
          {
            label: 'Logros alcanzados',
            icon: 'pi pi-fw pi-share-alt',
            routerLink: ['/evaluaciones/registro-logro'],
          },
          {
            label: 'Actividades académicas',
            icon: 'pi pi-fw pi-briefcase',
            routerLink: ['reporte-informe-actividades'],
          },
        ],
      },
      {
        label: 'Estudiantes y apoderados',
        icon: 'pi pi-fw pi-user',
        routerLink: ['estudiantes-apoderados'],
      },
      {
        label: 'Calendario',
        icon: 'pi pi-fw pi-calendar-clock',
        routerLink: ['/docente/calendario'],
      },
      {
        label: 'Banco de preguntas',
        icon: 'pi pi-fw pi-folder',
        routerLink: ['/aula-virtual/banco-preguntas'],
      },
      {
        label: 'Bienestar social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Ficha socioeconómica',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: ['/bienestar/ficha-declaracion'],
          },
          {
            label: 'Recordatorios de cumpleaños',
            icon: 'pi pi-fw pi-bell',
            routerLink: ['/bienestar/recordario-fechas'],
          },
        ],
      },
      {
        label: 'Comunicados',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['/comunicados/gestion-comunicados'],
      },
      {
        label: 'Encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['./encuestas/categorias'],
      },
      {
        label: 'Exámenes ECE',
        icon: 'pi pi-fw pi-file',
        url: 'http://umc.minedu.gob.pe/evaluaciones-censales/',
        target: '_blank', // opcional
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

const estudiante = [
  {
    items: [
      inicio,
      {
        label: 'Mis áreas curriculares',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/aula-virtual/areas-curriculares'],
      },
      {
        label: 'Evaluación ERE',
        icon: 'pi pi-fw pi-pen-to-square',
        routerLink: ['/ere/evaluacion/areas'],
      },
      {
        label: 'Practicar evaluación ERE',
        icon: 'pi pi-fw pi-pen-to-square',
        routerLink: ['/ere/evaluacion-practica'],
      },
      {
        label: 'Horario',
        icon: 'pi pi-fw pi-calendar-clock',
        routerLink: ['/estudiante/horario'],
      },
      {
        label: 'Calendario institucional',
        icon: 'pi pi-fw pi-calendar',
        routerLink: ['/estudiante/calendario-institucional'],
      },
      {
        label: 'Asistencia',
        icon: 'pi pi-fw pi-clock',
        routerLink: ['/estudiante/asistencia'],
      },
      {
        label: 'Méritos y ranking',
        icon: 'pi pi-fw pi-star',
        routerLink: ['/estudiante/merito-estudiante'],
      },
      {
        label: 'Bienestar social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Ficha socioeconómica',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: ['/bienestar/ficha-declaracion'],
          },
          {
            label: 'Gestionar encuestas',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/bienestar/gestionar-encuestas'],
          },
          {
            label: 'Recordatorios de cumpleaños',
            icon: 'pi pi-fw pi-bell',
            routerLink: ['/bienestar/recordario-fechas'],
          },
        ],
      },
      {
        label: 'Encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['./encuestas/categorias'],
      },
      {
        label: 'Buzón de sugerencias',
        icon: 'pi pi-fw pi-envelope',
        routerLink: ['/buzon-sugerencias/estudiante'],
      },
      {
        label: 'Reportes académicos',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          {
            label: 'Progreso',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/estudiante/reportes-academicos/progreso'],
          },
          {
            label: 'Académico',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/estudiante/reportes-academicos/academico'],
          },
          {
            label: 'Resultados ERE',
            icon: 'pi pi-fw pi-ticket',
            routerLink: ['/estudiante/reportes-academicos/resultados-ere'],
          },
        ],
      },
      {
        label: 'Mesa de partes GORE',
        icon: 'pi pi-fw pi-external-link',
        routerLink: ['/estudiante/mesa-partes-gore'],
      },
      {
        label: 'Codigo QR',
        icon: 'pi pi-fw pi-qrcode',
        routerLink: ['/estudiante/codigo-qr'],
      },
      {
        label: 'Comunicados',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['/comunicados/lista-comunicados'],
      },
      {
        label: 'Exámenes ECE',
        icon: 'pi pi-fw pi-file',
        url: 'http://umc.minedu.gob.pe/evaluaciones-censales/',
        target: '_blank', // opcional
      },
    ],
  },
];

const administrador = [
  //MODULO DE SEGURIDAD
  {
    items: [
      inicio,
      {
        label: 'Auditoría',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/administrador/auditoria'],
      },
      {
        label: 'Gestión de usuarios',
        icon: 'pi pi-fw pi-book',
        routerLink: ['/administrador/gestion-usuarios'],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];
const jefe_programa = [
  {
    items: [
      inicio,
      {
        label: 'Administracion del sistema',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Registro calendario escolar',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/gestion-institucional/calendarioAcademico'],
          },
        ],
      },
      {
        label: 'Personas',
        icon: 'pi pi-fw pi-desktop',
        routerLink: ['/configuracion/personas'],
      },
      {
        label: 'Administracion de la I.E',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Registro de año escolar',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/gestion-institucional/apertura'],
          },
          {
            label: 'Personal',
            icon: 'pi pi-fw pi-cog',
            routerLink: ['/configuracion/personal'],
          },
        ],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

const registro_asistencia = [
  {
    items: [inicio],
  },
  {
    label: 'Gestión de usuarios',
    icon: 'pi pi-fw pi-user',
    routerLink: ['/administrador/gestion-usuarios'],
  },
  {
    label: 'Bienestar social',
    icon: 'pi pi-fw pi-check-square',
    items: [
      {
        label: 'Ficha socioeconómica',
        icon: 'pi pi-fw pi-file-edit',
        routerLink: ['/bienestar/ficha-declaracion'],
      },
      {
        label: 'Consultar fichas socioeconómicas',
        icon: 'pi pi-fw pi-user-edit',
        routerLink: ['/bienestar/gestion-fichas'],
      },
      {
        label: 'Gestionar encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['/bienestar/gestionar-encuestas'],
      },
      {
        label: 'Recordatorios de cumpleaños',
        icon: 'pi pi-fw pi-bell',
        routerLink: ['/bienestar/recordario-fechas'],
      },
      {
        label: 'Informes y estadística',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/bienestar/informe-estadistico'],
      },
    ],
  },
  {
    label: 'Enlaces de ayuda',
    icon: 'pi pi-fw pi-share-alt',
    routerLink: ['ayuda'],
  },
];

const administracion = [
  // Director
  {
    label: 'Administración',
    items: [
      {
        label: 'Información de la Institución',
        icon: 'pi pi-fw pi-home',
        routerLink: ['/gestion-institucional/Informacion-ie'],
      },
      {
        label: 'Registro de condiciones operativas',
        icon: 'pi pi-fw pi-briefcase',
        items: [
          {
            label: 'Configurar calendario escolar',
            icon: 'pi pi-fw pi-lock-open',
            routerLink: ['/gestion-institucional/calendario-escolar'],
          },
          {
            label: 'Configurar año académico',
            icon: 'pi pi-fw pi-building-columns',
            routerLink: ['/gestion-institucional/config'],
          },
          {
            label: 'Personal de IE',
            icon: 'pi pi-fw pi-user-plus',
            routerLink: ['/gestion-institucional/IesPersonal'],
          },
          {
            label: 'Fechas importantes',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/gestion-institucional/fechas-importantes'],
          },
          {
            label: 'Actividades de gestión',
            icon: 'pi pi-fw pi-check',
            routerLink: ['/gestion-institucional/validacion-no-lectiva'],
          },
          {
            label: 'Gestión de horarios',
            icon: 'pi pi-fw pi-calendar',
            items: [
              {
                label: 'Configurar horarios',
                icon: 'pi pi-fw pi-calendar-times',
                routerLink: ['/horario/horario'],
              },
              {
                label: 'Asignar horarios',
                icon: 'pi pi-fw pi-calendar-clock',
                routerLink: ['/horario/configurar-horario'],
              },
            ],
          },
        ],
      },
      {
        label: 'Sincronizar archivos y descarga de plantillas',
        icon: 'pi pi-fw pi-wrench',
        routerLink: ['/gestion-institucional/sincronizar-archivo'],
      },
      {
        label: 'Gestión de estudiantes',
        icon: 'pi pi-fw pi-cog',
        items: [
          {
            label: 'Buzón de sugerencias',
            icon: 'pi pi-fw pi-envelope',
            routerLink: ['/buzon-sugerencias/director'],
          },
          {
            label: 'Registro de vacantes',
            icon: 'pi pi-fw pi-file-import',
            routerLink: ['/gestion-institucional/gestion-vacantes'],
          },
        ],
      },
      {
        label: 'Gestionar matrículas',
        icon: 'pi pi-fw pi-file-edit',
        badge: '',
        routerLink: ['/gestion-institucional/gestionar-matriculas'],
      },
      {
        label: 'Reportes y estadísticas',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          {
            label: 'Indicadores',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/gestion-institucional/reporte-indicadores'],
          },
          {
            label: 'Reportes académicos',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/gestion-institucional/reportes-academicos'],
          },
          {
            label: 'Reporte de asistencia',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['reporte-asistencia-auxiliar'],
          },
        ],
      },
      {
        label: 'Descarga de Plantillas',
        icon: 'pi pi-fw pi-download',
        routerLink: ['/gestion-institucional/descargar-plantillas'],
      },
    ],
  },
  {
    label: 'Otros Módulos',
    items: [
      {
        label: 'Gestión de méritos',
        icon: 'pi pi-fw pi-star',
        routerLink: ['/gestion-institucional/gestion-meritos'],
      },
      {
        label: 'Comunicados',
        icon: 'pi pi-fw pi-bell',
        routerLink: ['/comunicados/gestion-comunicados'],
      },
      {
        label: 'ERE',
        icon: 'pi pi-fw pi-pen-to-square',
        items: [
          {
            label: 'Resultados',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/ere/informes-ere'],
          },
          {
            label: 'Evaluaciones',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/ere/evaluaciones'],
          },
        ],
      },
      {
        label: 'Gestión de usuarios',
        icon: 'pi pi-fw pi-wrench',
        routerLink: ['/gestion-institucional/mantenimiento-usuario'],
      },
      {
        label: 'Bienestar social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Ficha socioeconomica',
            icon: 'pi pi-fw pi-file-edit',
            routerLink: ['/bienestar/ficha-declaracion'],
          },
          {
            label: 'Consultar fichas socioeconómicas',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: ['/bienestar/gestion-fichas'],
          },
          {
            label: 'Gestionar encuestas',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/bienestar/gestionar-encuestas'],
          },
          {
            label: 'Recordatorios de cumpleaños',
            icon: 'pi pi-fw pi-bell',
            routerLink: ['/bienestar/recordario-fechas'],
          },
          {
            label: 'Seguimiento de bienestar',
            icon: 'pi pi-fw pi-eye',
            routerLink: ['/bienestar/seguimiento-bienestar'],
          },
          {
            label: 'Informes y estadística',
            icon: 'pi pi-fw pi-chart-line',
            routerLink: ['/bienestar/informe-estadistico'],
          },
        ],
      },
      {
        label: 'Encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['./encuestas/categorias'],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

const participante = [
  {
    items: [
      inicio,
      {
        label: 'Mis capacitaciones',
        icon: 'pi pi-fw pi-id-card',
        routerLink: ['/actualizacion-docente/curso-capacitaciones'],
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

const apoderado = [
  {
    label: 'Apoderado',
    items: [
      inicio,
      {
        label: 'Bienestar social',
        icon: 'pi pi-fw pi-check-square',
        items: [
          {
            label: 'Gestionar fichas socioeconómicas',
            icon: 'pi pi-fw pi-user-edit',
            routerLink: ['/bienestar/gestion-fichas-apoderado'],
          },
          {
            label: 'Gestionar encuestas',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/bienestar/gestionar-encuestas'],
          },
        ],
      },
      {
        label: 'Reportes académicos',
        icon: 'pi pi-fw pi-chart-bar',
        items: [
          {
            label: 'Progreso',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['/apoderado/reportes-academicos/progreso'],
          },
        ],
      },
      {
        label: 'Encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['./encuestas/categorias'],
      },
      {
        label: 'Asistencia',
        icon: 'pi pi-fw pi-clock',
        routerLink: ['apoderado/asistencia'],
      },
      {
        label: 'Bandeja de Comunicados',
        icon: 'pi pi-fw pi-inbox',
        routerLink: ['/comunicados/lista-comunicados'],
      },
      {
        label: 'Mesa de partes GORE',
        icon: 'pi pi-fw pi-external-link',
        url: 'http://190.119.150.252/sisgedonew/app/main.php',
        target: '_blank',
      },
      {
        label: 'Enlaces de ayuda',
        icon: 'pi pi-fw pi-share-alt',
        routerLink: ['ayuda'],
      },
    ],
  },
];

const first = [
  {
    items: [inicio],
  },
];

const auxiliar = [
  {
    items: [
      inicio,
      {
        label: 'Asistencia',
        icon: 'pi pi-fw pi-list-check',
        items: [
          {
            label: 'Registro de asistencia',
            icon: 'pi pi-fw pi-list-check',
            routerLink: ['asistencia-auxiliar'],
          },
          {
            label: 'Reporte de asistencia',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['reporte-asistencia-auxiliar'],
          },
        ],
      },
      {
        label: 'Estudiantes y apoderados',
        icon: 'pi pi-fw pi-user',
        routerLink: ['estudiantes-apoderados'],
      },
    ],
  },
];

const asistente_social = [
  {
    label: 'Bienestar social',
    icon: 'pi pi-fw pi-check-square',
    items: [
      {
        label: 'Ficha socioeconomica',
        icon: 'pi pi-fw pi-file-edit',
        routerLink: ['/bienestar/ficha-declaracion'],
      },
      {
        label: 'Consultar fichas socioeconómicas',
        icon: 'pi pi-fw pi-user-edit',
        routerLink: ['/bienestar/gestion-fichas'],
      },
      {
        label: 'Gestionar encuestas',
        icon: 'pi pi-fw pi-list-check',
        routerLink: ['/bienestar/gestionar-encuestas'],
      },
      {
        label: 'Recordatorios de cumpleaños',
        icon: 'pi pi-fw pi-bell',
        routerLink: ['/bienestar/recordario-fechas'],
      },
      {
        label: 'Seguimiento de bienestar',
        icon: 'pi pi-fw pi-eye',
        routerLink: ['/bienestar/seguimiento-bienestar'],
      },
      {
        label: 'Informes y estadística',
        icon: 'pi pi-fw pi-chart-line',
        routerLink: ['/bienestar/informe-estadistico'],
      },
    ],
  },
  {
    label: 'Estudiantes y apoderados',
    icon: 'pi pi-fw pi-user',
    routerLink: ['estudiantes-apoderados'],
  },
];

@Injectable({
  providedIn: 'root',
})
export class ConstantesService {
  iPersId = user ? user.iPersId : null;
  iCredId = user ? user.iCredId : null;
  iDocenteId = user ? user?.iDocenteId : null;
  iNivelCicloId = user?.iNivelCicloId ?? 1;
  iEspecialistaId = user?.iEspecialistaId ?? 1;
  iEstudianteId = user ? user?.iEstudianteId : null;
  iPerfilId = perfil ? Number(perfil.iPerfilId) : null;
  // verificar si viene del usuario/perfil
  iCurrContId = user?.iCurrContId ?? 1;
  iYAcadId = iYAcadId;

  nav = this.getMenu();
  getMenu() {
    if (!perfil) return first;
    switch (Number(perfil.iPerfilId)) {
      case ADMINISTRADOR:
        return administrador;
      case ADMINISTRADOR_DREMO:
        return administradorDremo;
      case ESPECIALISTA_DREMO:
        return especialistaDremo;
      case ESPECIALISTA_UGEL:
        return especialistaUgel;
      case ESTUDIANTE:
        return estudiante;
      case SUBDIRECTOR_IE:
        return registro_asistencia;
      case JEFE_DE_PROGRAMA:
        return jefe_programa;
      case DOCENTE:
        return docente;
      case PARTICIPANTE:
        return participante;
      case DIRECTOR_IE:
        return administracion;
      case APODERADO:
        return apoderado;
      case AUXILIAR:
        return auxiliar;
      case ASISTENTE_SOCIAL:
        return asistente_social;
      case INSTRUCTOR:
        return instructor;

      default:
        return first;
    }
  }
  verificado = verificado;

  nombres = user ? user.cPersNombre + ' ' + user.cPersPaterno + ' ' + user.cPersMaterno : null;
  nombre = user ? user.cPersNombre : null;
  codModular = perfil ? perfil.cIieeCodigoModular : null;
  iIieeId = perfil ? perfil.iIieeId : null;
  iSedeId = perfil ? perfil.iSedeId : null;
  grados = perfil ? perfil.grados : null;
  iSemAcadId = perfil ? perfil.semestres_acad : null;
  years = user ? user.years : null;
  cIieeNombre = perfil ? perfil.cIieeNombre : null;
  nivelTipo = perfil ? perfil.iNivelTipoId : null;
  cNivelTipoNombre = perfil ? perfil.cNivelTipoNombre : null;
  cNivelNombre = perfil ? perfil.cNivelNombre : null;
  year = years ? years : null;
  fotografia = user ? user.cPersFotografia : null;
}
