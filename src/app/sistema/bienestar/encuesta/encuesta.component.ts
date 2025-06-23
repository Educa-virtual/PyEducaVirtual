import { PrimengModule } from '@/app/primeng.module'
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MessageService } from 'primeng/api'
import { DatosEncuestaService } from '../services/datos-encuesta.service'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-encuesta',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './encuesta.component.html',
    styleUrl: './encuesta.component.scss',
})
export class EncuestaComponent implements OnInit {
    @Output() es_visible = new EventEmitter<any>()
    active: number = 0
    iYAcadId: number
    perfil: any

    ultima_fecha_anio: Date = new Date(new Date().getFullYear(), 11, 31)
    fecha_actual: Date = new Date()
    es_especialista: boolean = false

    formEncuesta: FormGroup
    formPoblacion: FormGroup
    formEditores: FormGroup

    categorias: Array<object>
    opciones: Array<object>
    distritos: Array<object>
    nivel_tipos: Array<object>
    nivel_grados: Array<object>
    areas: Array<object>
    secciones: Array<object>
    zonas: Array<object>
    tipo_sectores: Array<object>
    ugeles: Array<object>
    cursos: Array<object>
    ies: Array<object>
    sexos: Array<object>
    estados: Array<object>
    perfiles: Array<object>

    poblacion: Array<object> = []
    editores: Array<object> = []

    cantidad_poblacion: number = 0

    private _messageService = inject(MessageService)

    constructor(
        private fb: FormBuilder,
        private datosEncuestas: DatosEncuestaService,
        private store: LocalStoreService
    ) {
        this.iYAcadId = this.store.getItem('dremoiYAcadId')
        this.perfil = this.store.getItem('dremoPerfil')
    }

    ngOnInit(): void {
        this.formEncuesta = this.fb.group({
            iYAcadId: [this.iYAcadId],
            iCredEntPerfId: [this.perfil.iCredEntPerfId],
            iEncuId: [null],
            cEncuNombre: ['', Validators.required],
            cEncuDescripcion: ['', Validators.required],
            iEncuCateId: [null, Validators.required],
            iEstado: [1, Validators.required],
            dEncuDesde: [null, Validators.required],
            dEncuHasta: [null, Validators.required],
            poblacion: [null],
            editores: [null],
            jsonPoblacion: [null],
            jsonEditores: [null],
        })

        this.formPoblacion = this.fb.group({
            iEncuPobId: [null],
            iNivelTipoId: [null],
            iCursoId: [null],
            iTipoSectorId: [null],
            iZonaId: [null],
            iUgelId: [null],
            iDsttId: [null],
            iIieeId: [null],
            iNivelGradoId: [null],
            iSeccionId: [null],
            cPersSexo: [null],
            poblacion: [''],
        })

        this.formEditores = this.fb.group({
            iEncuPobId: [null],
            iPerfilId: [null],
            cPerfilNomnre: [''],
            iEncuOpcId: [null],
            cEncuOpcNombre: [''],
            cantidad: [0],
        })

        this.datosEncuestas.getEncuestaParametros().subscribe((data: any) => {
            this.perfiles = this.datosEncuestas.getPerfiles(data?.perfiles)
            this.categorias = this.datosEncuestas.getCategorias(
                data?.categorias
            )
            this.opciones = this.datosEncuestas.getOpciones(data?.opciones)
            this.distritos = this.datosEncuestas.getDistritos(data?.distritos)
            this.secciones = this.datosEncuestas.getSecciones(data?.secciones)
            this.zonas = this.datosEncuestas.getZonas(data?.zonas)
            this.tipo_sectores = this.datosEncuestas.getTipoSectores(
                data?.tipo_sectores
            )
            this.ugeles = this.datosEncuestas.getUgeles(data?.ugeles)
            this.nivel_tipos = this.datosEncuestas.getNivelesTipos(
                data?.nivel_tipos
            )
            this.ies = this.datosEncuestas.getInstitucionesEducativas(
                data?.instituciones_educativas
            )
            this.sexos = this.datosEncuestas.getSexos()
            this.estados = this.datosEncuestas.getEstados()
            this.datosEncuestas.getNivelesGrados(data?.nivel_grados)
            this.datosEncuestas.getAreas(data?.areas)
        })

        this.formPoblacion
            .get('iNivelTipoId')
            .valueChanges.subscribe((value) => {
                this.formPoblacion.get('iNivelGradoId')?.setValue(null)
                this.nivel_grados = null
                this.filterNivelesGrados(value)

                this.formPoblacion.get('iCursoId')?.setValue(null)
                this.areas = null
                this.filterAreas(value)

                this.formPoblacion.get('iIieeId')?.setValue(null)
                this.ies = null
                this.filterInstitucionesEducativas()
            })
        this.formPoblacion.get('iDsttId').valueChanges.subscribe(() => {
            this.formPoblacion.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formPoblacion.get('iZonaId').valueChanges.subscribe(() => {
            this.formPoblacion.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formPoblacion.get('iTipoSectorId').valueChanges.subscribe(() => {
            this.formPoblacion.get('iIieeId')?.setValue(null)
            this.ies = null
            this.filterInstitucionesEducativas()
        })
        this.formPoblacion.get('iUgelId').valueChanges.subscribe((value) => {
            this.formPoblacion.get('iDsttId')?.setValue(null)
            this.formPoblacion.get('iIieeId')?.setValue(null)
            this.ies = null
            this.distritos = null
            this.filterInstitucionesEducativas()
            this.filterDistritos(value)
        })
    }

    filterNivelesTipos() {
        this.nivel_tipos = this.datosEncuestas.filterNivelesTipos()
    }

    filterNivelesGrados(iNivelTipoId: number) {
        this.nivel_grados =
            this.datosEncuestas.filterNivelesGrados(iNivelTipoId)
    }

    filterAreas(iNivelTipoId: number) {
        this.areas = this.datosEncuestas.filterAreas(iNivelTipoId)
    }

    filterDistritos(iUgelId: number) {
        this.distritos = this.datosEncuestas.filterDistritos(iUgelId)
    }

    filterInstitucionesEducativas() {
        const iNivelTipoId = this.formPoblacion.get('iNivelTipoId')?.value
        const iDsttId = this.formPoblacion.get('iDsttId')?.value
        const iZonaId = this.formPoblacion.get('iZonaId')?.value
        const iTipoSectorId = this.formPoblacion.get('iTipoSectorId')?.value
        const iUgelId = this.formPoblacion.get('iUgelId')?.value
        this.ies = this.datosEncuestas.filterInstitucionesEducativas(
            iNivelTipoId,
            iDsttId,
            iZonaId,
            iTipoSectorId,
            iUgelId
        )
    }

    actualizarPoblacion() {
        const nivel_tipo: any = this.nivel_tipos
            ? this.nivel_tipos.find(
                  (nivel: any) =>
                      nivel.value ==
                      this.formPoblacion.get('iNivelTipoId')?.value
              )
            : null
        const tipo_sector: any = this.tipo_sectores
            ? this.tipo_sectores.find(
                  (sector: any) =>
                      sector.value ==
                      this.formPoblacion.get('iTipoSectorId')?.value
              )
            : null
        const tipo_zona: any = this.zonas
            ? this.zonas.find(
                  (zona: any) =>
                      zona.value == this.formPoblacion.get('iZonaId')?.value
              )
            : null
        const ugel: any = this.ugeles
            ? this.ugeles.find(
                  (ugel: any) =>
                      ugel.value == this.formPoblacion.get('iUgelId')?.value
              )
            : null
        const distrito: any = this.distritos
            ? this.distritos.find(
                  (distrito: any) =>
                      distrito.value == this.formPoblacion.get('iDsttId')?.value
              )
            : null
        const ie: any = this.ies
            ? this.ies.find(
                  (ie: any) =>
                      ie.value == this.formPoblacion.get('iIieeId')?.value
              )
            : null
        const area: any = this.areas
            ? this.areas.find(
                  (area: any) =>
                      area.value == this.formPoblacion.get('iCursoId')?.value
              )
            : null
        const nivel_grado: any = this.nivel_grados
            ? this.nivel_grados.find(
                  (nivel: any) =>
                      nivel.value ==
                      this.formPoblacion.get('iNivelGradoId')?.value
              )
            : null
        const seccion: any = this.secciones
            ? this.secciones.find(
                  (seccion: any) =>
                      seccion.value ==
                      this.formPoblacion.get('iSeccionId')?.value
              )
            : null
        const sexo: any = this.sexos
            ? this.sexos.find(
                  (sexo: any) =>
                      sexo.value == this.formPoblacion.get('cPersSexo')?.value
              )
            : null

        let poblacion: any = [
            nivel_tipo?.label,
            tipo_sector?.label,
            tipo_zona?.label,
            ugel?.label,
            distrito?.label,
            ie?.label,
            area?.label,
            nivel_grado?.label,
            seccion?.label,
            sexo?.label,
        ]
        poblacion = poblacion.filter((item: any) => item != null)
        this.formPoblacion.get('poblacion')?.setValue(poblacion.join(', '))
        this.formEncuesta.get('poblacion')?.setValue(poblacion)
        this.formPoblacion.get('iEncuPobId')?.setValue(new Date().getTime())
    }

    actualizarEditores() {
        const perfil: any = this.perfiles.find(
            (perfil: any) =>
                perfil.value == this.formEditores.get('iPerfilId')?.value
        )
        const opcion: any = this.opciones.find(
            (opcion: any) =>
                opcion.value == this.formEditores.get('iOpcionId')?.value
        )
        this.formEditores
            .get('cPerfilNombre')
            ?.setValue(perfil ? perfil.label : '')
        this.formEditores
            .get('cEncuOpcNombre')
            ?.setValue(opcion ? opcion.label : '')
        this.formPoblacion.get('iEncuPermId')?.setValue(new Date().getTime())
    }

    formControlJsonStringify(
        form: FormGroup,
        formJson: string,
        formControlName: string | string[] | null,
        groupControl: string | null = null
    ): void {
        form.get(formJson).setValue(null)
        if (!formControlName) {
            return null
        }
        const items = []
        if (typeof formControlName === 'string') {
            formControlName = [formControlName]
        }
        formControlName.forEach((control) => {
            if (form.get(control).value === null) {
                return null
            }
            form.get(control).value.forEach((item) => {
                if (groupControl) {
                    items.push({
                        [groupControl]: item,
                    })
                } else if (groupControl == '') {
                    items.push(item)
                } else {
                    items.push({
                        [control]: item,
                    })
                }
            })
        })
        form.get(formJson).setValue(JSON.stringify(items))
    }

    guardarEncuesta() {
        if (this.formEncuesta.invalid) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe llenar todos los campos de la primera sección: Información General',
            })
            return
        }

        if (this.poblacion.length == 0) {
            this._messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe especificar al menos una población objetivo',
            })
            return
        }

        this.formControlJsonStringify(
            this.formEncuesta,
            'jsonPoblacion',
            'poblacion',
            ''
        )
        this.formControlJsonStringify(
            this.formEncuesta,
            'jsonEditores',
            'editores',
            ''
        )
        console.log(this.formEncuesta.value, 'form encuesta')
        this.datosEncuestas.guardarEncuesta(this.formEncuesta.value).subscribe({
            next: (data: any) => {
                console.log(data, 'guardar encuesta')
                this._messageService.add({
                    severity: 'success',
                    summary: 'Registro exitoso',
                    detail: 'Se registraron los datos',
                })
                this.es_visible.emit(false)
            },
            error: (error) => {
                console.error('Error guardando encuesta:', error)
                this._messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: error.error.message,
                })
            },
        })
    }

    agregarPoblacion() {
        this.actualizarPoblacion()
        const form: Array<object> = this.formPoblacion.value
        this.poblacion = [...this.poblacion, form]
        this.formEncuesta.get('poblacion')?.setValue(this.poblacion)
        this.formPoblacion.reset()
    }

    agregarEditor() {
        this.actualizarEditores()
        const form = this.formEditores.value
        this.editores = [...this.editores, form]
        this.formEncuesta.get('editores')?.setValue(this.editores)
        this.formEditores.reset()
    }

    accionBtnItemTablePoblacion({ accion, item }) {
        if (accion == 'eliminar') {
            this.poblacion = this.poblacion.filter(
                (poblacion: any) => item.iEncuPobId != poblacion.iEncuPobId
            )
        }
    }

    accionBtnItemTableEditores({ accion, item }) {
        if (accion == 'eliminar') {
            this.editores = this.editores.filter(
                (editor: any) => item.iEncuPobId != editor.iEncuPobId
            )
        }
    }

    actions_poblacion: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    actions_editores: IActionTable[] = [
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns_poblacion = [
        {
            type: 'item',
            width: '10%',
            field: '',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '70%',
            field: 'poblacion',
            header: 'Población',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '20%',
            field: '',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]

    columns_editores = [
        {
            type: 'item',
            width: '5%',
            field: 'item',
            header: '#',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '20%',
            field: 'cPerfilNombre',
            header: 'Editor',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '10%',
            field: 'cEncuOpcNombre',
            header: 'Opción',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'actions',
            width: '20%',
            field: '',
            header: 'Acciones',
            text_header: 'left',
            text: 'left',
        },
    ]
}
