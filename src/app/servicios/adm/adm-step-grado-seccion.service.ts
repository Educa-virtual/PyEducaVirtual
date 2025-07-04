import { Injectable } from '@angular/core'

export interface ConfigTipo {
    iEstadoConfigId: number
    cEstadoConfigNombre: string
}

export interface Grado {
    iConfigGradoId: number
    iCicloId: number
    iGradoId: number
    iFasesPromId: number
    iYAcadId: number
    iSedeId: number
    bConfigGradoEstado: number
    cConfigGradoObs: string
    cYAcadNombre: string
    cFase: string
    cCiclo: string
    cGrado: string
}

export interface Ambientes {
    iIieeAmbienteId: number
    iTipoAmbienteId: number
    cTipoAmbienteNombre: string
    iEstadoAmbId: number
    cEstadoAmbNombre: string
    iUbicaAmbId: number
    cUbicaAmbNombre: string
    iUsoAmbId: number
    ambiente: string
    cUsoAmbNombre: string
    cUsoAmbDescripcion: string
    iPisoAmbid: number
    cPisoAmbNombre: string
    cPisoAmbDescripcion: string
    iYAcadId: number
    cYAcadNombre: string
    iSedeId: number
    cSedeNombre: string
    iIieeId: number
    bAmbienteEstado: boolean
    cAmbienteNombre: string
    cAmbienteObs: string
    iAmbienteArea: number
    iAmbienteAforo: number
    cAmbienteDescripcion: string
}

export interface ListaConfig {
    iConfigId: number
    iYAcadId: number
    iEstadoConfigId: number
    iNivelTipoId: number
    iSedeId: number
    iServEdId: number
    cConfigNroRslAprobacion: string
    cConfigUrlRslAprobacion: string
    cConfigDescripcion: string
    bConfigEsBilingue: boolean
    iEstado: number

    cEstadoConfigNombre: string
    cSedeNombre: string
    cYAcadNombre: string
    cServEdNombre: string
}

@Injectable({
    providedIn: 'root',
})
export class AdmStepGradoSeccionService {
    // Propiedades
    configTipo: ConfigTipo[] = []
    ambientes: Ambientes[] = []
    grados: Grado[] = []
    listaConfig: ListaConfig[] = []

    // configTipo: {
    //     iEstadoConfigId: number
    //     cEstadoConfigNombre: string
    // }[]

    //variables recibidas desde configuracion
    configuracion: any[]
    sede: []
    perfil: []
    anio: []
    listaGrados: []
    itemsStep = [
        {
            label: 'Configuración',
            routerLink: '/gestion-institucional/config',
        },
        {
            label: 'Ambientes',
            routerLink: '/gestion-institucional/ambiente',
        },
        // {
        //     label: 'Grados',
        //     routerLink: '/gestion-institucional/grado',
        // },
        {
            label: 'Grados y secciones',
            routerLink: '/gestion-institucional/seccion',
        },
        {
            label: 'Plan de estudios',
            routerLink: '/gestion-institucional/plan-estudio',
        },
        {
            label: 'Horas del docente',
            routerLink: '/gestion-institucional/hora-docente',
        },
        {
            label: 'Asignar grados y secciones',
            routerLink: '/gestion-institucional/asignar-grado',
        },
        {
            label: 'Resumen',
            routerLink: '/gestion-institucional/resumen',
        },
    ]

    iSedeId: number
    iYAcadId: number
    iNivelTipoId: number
    iCredId: number

    //Variables requeridas para el step de ambientes
    tipo_ambiente: any[] = []
    tipo_ubicacion: any[] = []
    uso_ambientes: any[] = []
    condicion_ambiente: any[] = []
    piso_ambiente: any[] = []

    //variables de secciones
    secciones: any[] = []
    secciones_asignadas: any[] = []
    dias_laborables: any[] = []

    //variables de plan de estudios
    servicio_educativo: any[] = []
    programacion_curricular: any[] = []

    //variables de horas del docente
    docentes: any = []

    constructor() {
        //       this.initializeData()
    }

    //SETEER
    setEstadoConfig(value: any) {
        // informacion de tabla estado de configuraciones
        this.configTipo = value
    }
    setListaConfig(item: any) {
        this.listaConfig = item.data
    }

    //GETTERS
    getEstadoConfig() {
        return this.configTipo
    }

    getConfig() {
        return this.configuracion
    }

    getListaConfig() {
        return this.listaConfig
    }
    // grados
    // Obtener grados
    getGrados(): Grado[] {
        return this.grados
    }

    // Agregar un nuevo grado
    addGrado(newGrado: Grado): void {
        this.grados.push(newGrado)
    }
    /*
    getFilesPrimaria() {
        return Promise.resolve(this.getTreeNodesPrimaria())
    } */

    // Actualizar un grado por ID
    updateGrado(id: number, updatedGrado: Partial<Grado>): void {
        const index = this.grados.findIndex((g) => g.iConfigGradoId === id)
        if (index !== -1) {
            this.grados[index] = { ...this.grados[index], ...updatedGrado }
        }
    }

    // Eliminar un grado por ID
    deleteGrado(id: number): void {
        this.grados = this.grados.filter((g) => g.iConfigGradoId !== id)
    }
}
