import { Component, inject, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { PrimengModule } from '@/app/primeng.module'
import { MenuItem, MessageService } from 'primeng/api'
import { FormBuilder, FormGroup } from '@angular/forms'
import { DatosInformeBienestarService } from '../services/datos-infome-bienestar.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-informe-estadistico',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './informe-estadistico.component.html',
    styleUrl: './../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class InformeEstadisticoComponent implements OnInit {
    title: string = 'Informes y Estadístico'
    activeItem: any

    perfil: any
    iYAcadId: number
    formReportes: FormGroup
    reportes: any
    cantidad_matriculados: number
    cantidad_fichas: number
    cantidad_con_discapacidad: number

    nivel_tipos: any
    nivel_grados: any
    areas: any
    secciones: any
    zonas: any
    tipo_sectores: any
    ugeles: any
    ies: any
    sexos: any
    distritos: any

    es_especialista: boolean = false

    private _messageService = inject(MessageService)

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private datosInformes: DatosInformeBienestarService,
        private store: LocalStoreService
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
    }

    ngOnInit(): void {
        this.formReportes = this.fb.group({
            iCredEntPerfId: [this.perfil.iCredEntPerfId],
            iYAcadId: [this.iYAcadId],
            iNivelTipoId: [null],
            iNivelGradoId: [null],
            iTipoSectorId: [null],
            iZonaId: [null],
            iUgelId: [null],
            iDsttId: [null],
            iIieeId: [null],
            iSeccionId: [null],
            cPersSexo: [null],
        })

        this.activeItem = this.tabItems[0]
        this.router.navigate([this.activeItem.route])
        this.handleTabChange(this.activeItem)

        this.datosInformes
            .obtenerParametros({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iYAcadId: this.iYAcadId,
            })
            .subscribe((data: any) => {
                this.distritos = this.datosInformes.getDistritos(
                    data?.distritos
                )
                this.secciones = this.datosInformes.getSecciones(
                    data?.secciones
                )
                this.zonas = this.datosInformes.getZonas(data?.zonas)
                this.tipo_sectores = this.datosInformes.getTipoSectores(
                    data?.tipo_sectores
                )
                this.ugeles = this.datosInformes.getUgeles(data?.ugeles)
                this.nivel_tipos = this.datosInformes.getNivelesTipos(
                    data?.nivel_tipos
                )
                this.ies = this.datosInformes.getInstitucionesEducativas(
                    data?.instituciones_educativas
                )
                this.distritos = this.datosInformes.getDistritos(
                    data?.distritos
                )
                this.sexos = this.datosInformes.getSexos()
                this.datosInformes.getNivelesGrados(data?.nivel_grados)

                if (!this.es_especialista) {
                    const nivel_tipo =
                        this.nivel_tipos && this.nivel_tipos.length > 0
                            ? this.nivel_tipos[0]['value']
                            : null
                    const ie =
                        this.ies && this.ies.length > 0
                            ? this.ies[0]['value']
                            : null
                    this.formReportes.get('iNivelTipoId')?.setValue(nivel_tipo)
                    this.filterNivelesGrados(nivel_tipo)
                    this.formReportes.get('iIieeId')?.setValue(ie)
                }
            })

        this.formReportes
            .get('iNivelTipoId')
            .valueChanges.subscribe((value) => {
                this.formReportes.get('iNivelGradoId')?.setValue(null)
                this.nivel_grados = null
                this.filterNivelesGrados(value)

                this.formReportes.get('iIieeId')?.setValue(null)
                this.ies = null
                this.filterInstitucionesEducativas()
            })
        this.formReportes.get('iDsttId').valueChanges.subscribe(() => {
            this.formReportes.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formReportes.get('iZonaId').valueChanges.subscribe(() => {
            this.formReportes.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formReportes.get('iTipoSectorId').valueChanges.subscribe(() => {
            this.formReportes.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formReportes.get('iUgelId').valueChanges.subscribe((value) => {
            this.formReportes.get('iDsttId')?.setValue(null)
            this.formReportes.get('iIieeId')?.setValue(null)
            this.ies = null
            this.distritos = null
            this.filterInstitucionesEducativas()
            this.filterDistritos(value)
        })

        this.verReporte()
    }

    filterNivelesTipos() {
        this.nivel_tipos = this.datosInformes.filterNivelesTipos()
    }

    filterNivelesGrados(iNivelTipoId: number) {
        this.nivel_grados = this.datosInformes.filterNivelesGrados(iNivelTipoId)
    }

    filterDistritos(iUgelId: number) {
        this.distritos = this.datosInformes.filterDistritos(iUgelId)
    }

    filterInstitucionesEducativas() {
        const iEvaluacionId = this.formReportes.get('iEvaluacionId')?.value
        const iNivelTipoId = this.formReportes.get('iNivelTipoId')?.value
        const iDsttId = this.formReportes.get('iDsttId')?.value
        const iZonaId = this.formReportes.get('iZonaId')?.value
        const iTipoSectorId = this.formReportes.get('iTipoSectorId')?.value
        const iUgelId = this.formReportes.get('iUgelId')?.value
        this.ies = this.datosInformes.filterInstitucionesEducativas(
            iEvaluacionId,
            iNivelTipoId,
            iDsttId,
            iZonaId,
            iTipoSectorId,
            iUgelId
        )
    }

    verReporte() {
        this.datosInformes.verReporte(this.formReportes.value).subscribe({
            next: (data: any) => {
                if (data.data) {
                    this.reportes = data.data
                    this.cantidad_matriculados =
                        this.reportes.cantidad_matriculados
                    this.cantidad_fichas = this.reportes.cantidad_fichas
                    this.cantidad_con_discapacidad =
                        this.reportes.cantidad_con_discapacidad
                }
            },
            error: (error) => {
                console.error('Error obteniendo informe:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error,
                })
            },
        })
    }

    handleTabChange(newItem: MenuItem) {
        this.activeItem = newItem
    }

    tabItems = [
        {
            label: 'Familia',
            icon: 'pi pi-fw pi-users',
            route: '/bienestar/informe-estadistico/nivel-pobreza',
        },
        {
            label: 'Económico',
            icon: 'pi pi-fw pi-wallet',
            route: '/bienestar/informe-estadistico/salud',
        },
        {
            label: 'Vivienda',
            icon: 'pi pi-fw pi-home',
            route: '/bienestar/informe-estadistico/vivienda',
        },
        {
            label: 'Alimentación',
            icon: 'pi pi-fw pi-shopping-cart',
            route: '/bienestar/informe-estadistico/economica',
        },
        {
            label: 'Salud',
            icon: 'pi pi-fw pi-heart',
            route: '/bienestar/informe-estadistico/demografica',
        },
    ]
}
