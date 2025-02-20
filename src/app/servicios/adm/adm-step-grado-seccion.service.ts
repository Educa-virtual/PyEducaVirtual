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
    iEstadoConfigId: number
    cConfigDescripcion: string
    cConfigNroRslAprobacion: string
    cConfigUrlRslAprobacion: string
    cEstadoConfigNombre: string
    cSedeNombre: string
    iSedeId: number
    iYAcadId: number
    cYAcadNombre: string
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

    constructor() {
        this.initializeData()
    }

    private initializeData(): void {
        this.grados = [
            {
                iConfigGradoId: 1,
                iCicloId: 3,
                iGradoId: 1,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO III',
                cGrado: 'PRIMERO',
            },
            {
                iConfigGradoId: 2,
                iCicloId: 3,
                iGradoId: 2,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO III',
                cGrado: 'SEGUNDO',
            },
            {
                iConfigGradoId: 3,
                iCicloId: 4,
                iGradoId: 3,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO IV',
                cGrado: 'TERCERO',
            },
            {
                iConfigGradoId: 4,
                iCicloId: 4,
                iGradoId: 4,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO IV',
                cGrado: 'CUARTO',
            },
            {
                iConfigGradoId: 5,
                iCicloId: 5,
                iGradoId: 5,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO V',
                cGrado: 'QUINTO',
            },
            {
                iConfigGradoId: 6,
                iCicloId: 5,
                iGradoId: 6,
                iFasesPromId: 1,
                iYAcadId: 3,
                iSedeId: 1,
                bConfigGradoEstado: 1,
                cConfigGradoObs: '',
                cYAcadNombre: '2024',
                cFase: 'Fase Regular',
                cCiclo: 'CICLO V',
                cGrado: 'SEXTO',
            },
            // Agregar los demás grados aquí...
        ]
    }

    getTreeNodesPrimaria() {
        return [
            {
                key: '0',
                label: 'Fase Regular-Primaria',
                data: 'Documents Folder',
                expanded: true,
                icon: 'pi pi-fw pi-folder',
                children: [
                    {
                        key: '3',
                        label: 'CICLO III',
                        data: 'Documents Folder',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            {
                                key: '3-I',
                                label: '1° Grado (2)',
                                data: 'Work Folder',
                                icon: 'pi pi-fw pi-cog',
                                children: [
                                    {
                                        key: '0-0-0',
                                        label: 'Seccion A',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Expenses Document',
                                    },
                                    {
                                        key: '0-0-1',
                                        label: 'Seccion B',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Resume Document',
                                    },
                                ],
                            },
                            {
                                key: '3-II',
                                label: '2° Grado (1)',
                                data: 'Home Folder',
                                icon: 'pi pi-fw pi-home',
                                children: [
                                    {
                                        key: '0-1-0',
                                        label: 'Seccion A',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Invoices for this month',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        key: '4',
                        label: 'CICLO IV',
                        data: 'Events Folder',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            {
                                key: '4-III',
                                label: '3° Grado',
                                data: 'Work Folder',
                                icon: 'pi pi-fw pi-cog',
                                children: [
                                    {
                                        key: '0-0-0',
                                        label: 'Expenses.doc',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Expenses Document',
                                    },
                                    {
                                        key: '0-0-1',
                                        label: 'Resume.doc',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Resume Document',
                                    },
                                ],
                            },
                            {
                                key: '4-IV',
                                label: '4° Grado',
                                data: 'Work Folder',
                                icon: 'pi pi-fw pi-cog',
                                children: [
                                    {
                                        key: '0-0-0',
                                        label: 'Expenses.doc',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Expenses Document',
                                    },
                                    {
                                        key: '0-0-1',
                                        label: 'Resume.doc',
                                        icon: 'pi pi-fw pi-file',
                                        data: 'Resume Document',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        key: '5',
                        label: 'CICLO V',
                        data: 'Movies Folder',
                        icon: 'pi pi-fw pi-folder',
                        children: [
                            {
                                key: '5-V',
                                icon: 'pi pi-fw pi-star-fill',
                                label: 'Al Pacino',
                                data: 'Pacino Movies',
                                children: [
                                    {
                                        key: '2-0-0',
                                        label: 'Scarface',
                                        icon: 'pi pi-fw pi-video',
                                        data: 'Scarface Movie',
                                    },
                                    {
                                        key: '2-0-1',
                                        label: 'Serpico',
                                        icon: 'pi pi-fw pi-video',
                                        data: 'Serpico Movie',
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ]
    }

    setEstadoConfig(value: any) {
        // informacion de tabla estado de configuraciones
        this.configTipo = value
    }
    getEstadoConfig() {
        return this.configTipo
    }

    getConfig() {
        return this.configuracion
    }

    setListaConfig(item: any) {
        this.listaConfig = item.data
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

    getFilesPrimaria() {
        return Promise.resolve(this.getTreeNodesPrimaria())
    }

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
