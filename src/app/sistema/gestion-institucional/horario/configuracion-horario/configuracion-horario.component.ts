import { Component, inject, OnInit } from '@angular/core'
import { GeneralService } from '@/app/servicios/general.service'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageService } from 'primeng/api'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { PrimengModule } from '@/app/primeng.module'

import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

import { GridHorarioComponent } from '../grid-horario/grid-horario.component'
import { AddHorarioComponent } from '../add-horario/add-horario.component'
import { AddDocenteComponent } from '../add-docente/add-docente.component'

import { BlockHorarioComponent } from '../block-horario/block-horario.component'

@Component({
    selector: 'app-configuracion-horario',
    standalone: true,
    templateUrl: './configuracion-horario.component.html',
    styleUrls: ['./configuracion-horario.component.scss'],
    imports: [
        PrimengModule,

        GridHorarioComponent,
        AddHorarioComponent,
        AddDocenteComponent,
        BlockHorarioComponent,
    ],
})
export class ConfiguracionHorarioComponent implements OnInit {
    formSearch: FormGroup

    configTime: any = {}
    dremoYear: number
    cicloAcad: number

    horaInicio: string = ''
    horaFin: string = ''
    lunes: boolean = false
    martes: boolean = false
    miercoles: boolean = false
    jueves: boolean = false
    viernes: boolean = false
    sabado: boolean = false
    domingo: boolean = false
    items: any = []
    ciclos: any

    perfil: any = []
    configuracion: any = []
    lista_niveles_grados: any = []
    areas: any = []
    areas_asignadas: any[]
    visible_grid: boolean = false

    grados: any[]
    planes: any[]
    modalidades: any = []
    semestres: any = []
    turnos: any[]
    secciones: any = []

    area: any = []
    visible_horario: boolean = false
    caption: string
    docentes: any = []
    option: string

    docente: any = []
    horas_asignadas: number = 0
    lista_areas_docente: any = []
    minimo: number
    caption_docente: string
    visible_docente: boolean = false
    c_accion: any = ''

    iTurnoId: number
    iModalServId: number
    iSeccionId: number

    horarios: any = []
    bloques: any = []
    visible_bloque: boolean = false
    tipo_bloque: any = []
    registros = [
        // { dia: 'Lunes', inicio: '07:00', fin: '08:30', asignatura: 'Matemática', profesor: 'Julio Salazar Jimenez' },
        // { dia: 'Lunes', inicio: '08:30', fin: '09:15', asignatura: 'Historia', profesor: 'Ana López' },
        // { dia: 'Martes', inicio: '07:45', fin: '08:30', asignatura: 'Ciencias', profesor: 'Carlos Pérez' },
        // { dia: 'Miércoles', inicio: '07:45', fin: '08:30', asignatura: 'Ciencias', profesor: 'Carlos Pérez' },
        // // Más registros...
    ]

    private _confirmService = inject(ConfirmationModalService)
    constructor(
        public query: GeneralService,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private router: Router,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this._confirmService.openAlert({
            header: 'Advertencia de configuracion',
            message: 'Tiene que seleccionar una configuracion valida.',
            icon: 'pi pi-exclamation-triangle',
        })

        this.getBloqueHorario()

        this.perfil = this.store.getItem('dremoPerfil')
        console.log(this.perfil, 'perfil dremo')
        console.log(this.store, 'console.log(this.store)')
        this.dremoYear = this.store.getItem('dremoYear')
        //this.getSemestres();
        this.searchConfiguraciones()

        //this.getCiclosAcademicos();
        this.formSearch = this.fb.group({
            iSemAcadId_search: [0],
            iYAcadId_search: [0],
            iConfigId: [0],
            iProgId_search: [this.perfil.iProgId], //[this.configuracion[0].iProgId],
            iNivelGradoId_search: [0],
            iTurnoId_search: [0],
            iSeccionId_search: [0],
            iModalServId_search: [0],
            iHorarioIeId_search: [0],
            buscador: [1],
        })
    }

    onChange(event: any, cbo: string): void {
        const selected = event.value
        // const iSemAcadId_search = this.formSearch.get('iSemAcadId_search')?.value ?? null;
        const iNivelGradoId_search =
            this.formSearch.get('iNivelGradoId_search')?.value ?? null
        const iModalServId_search =
            this.formSearch.get('iModalServId_search')?.value ?? null
        // const iTurnoId_search= this.formSearch.get('iTurnoId_search')?.value ?? null;
        // const iProgId_search = this.formSearch.get('iProgId_search')?.value ?? null;
        this.visible_horario = false
        this.visible_docente = false

        if (cbo === 'configuracion') {
            const filteredData = this.configuracion.filter(
                (item) => item.iConfigId === selected
            )

            this.formSearch
                .get('iYAcadId_search')
                .setValue(filteredData[0].iYAcadId)
            this.SearchNivelGrados(selected)
            this.areas = [] // limpia los valores del array en caso de seleccion de cbo
        }
        if (cbo === 'grado') {
            // se ejecuta cuando selecciona grado

            // Encuentra el objeto
            // Extraer los valores únicos de "cGradoNombre" e "iNivelGradoId"
            this.areas = [] // limpia los valores del array en caso de seleccion de cbo
            const filteredData = this.lista_niveles_grados.filter(
                (item) => item.iNivelGradoId === selected
            )

            this.modalidades = Array.from(
                new Map(
                    filteredData.map((item) => [
                        item.iModalServId,
                        {
                            iModalServId: item.iModalServId,
                            cModalServNombre: item.cModalServNombre,
                        },
                    ])
                ).values()
            )

            // Ordenar el arreglo sin importar el tamaño
            this.modalidades = this.modalidades.sort(
                (a, b) => Number(a.iModalServId) - Number(b.iModalServId)
            )
            console.log(this.modalidades, 'this.modalidades ')
        }
        if (cbo === 'modalidad') {
            this.searchPersonalDocente()
            this.items = [] //blanqueado de bloques

            this.formSearch.get('iTurnoId_search').reset()
            this.formSearch.get('iHorarioIeId_search').reset()
            this.formSearch.get('iSeccionId_search').reset()

            this.iModalServId = selected
            // Encuentra el objeto
            this.iTurnoId = 0
            this.areas = [] // limpia los valores del array en caso de seleccion de cbo
            this.secciones = []

            const filteredData = this.lista_niveles_grados.filter(
                (item) =>
                    item.iNivelGradoId === iNivelGradoId_search &&
                    item.iModalServId === selected
            )
            console.log(
                this.lista_niveles_grados,
                'lista_niveles_grados modalidad'
            )
            console.log(filteredData, 'filteredData en modalidad')
            this.turnos = Array.from(
                new Map(
                    filteredData.map((item) => [
                        item.iTurnoId, // Clave única para evitar duplicados
                        {
                            iTurnoId: item.iTurnoId,
                            cTurnoNombre: item.cTurnoNombre,
                        },
                    ])
                ).values()
            )

            // Ordenar el arreglo sin importar el tamaño
            this.turnos = this.turnos.sort(
                (a, b) => Number(a.iTurnoId) - Number(b.iTurnoId)
            )
            console.log(this.turnos, 'this.turnos ')
        }
        if (cbo === 'turno') {
            this.visible_bloque = true // Mostrar lista de bloques
            this.visible_grid = false
            this.items = [] //blanqueado de bloques

            this.formSearch.get('iHorarioIeId_search').reset()
            this.formSearch.get('iSeccionId_search').reset()
            this.iTurnoId = 0
            this.areas = [] // limpia los valores del array en caso de seleccion de cbo
            this.secciones = []
            this.iTurnoId = selected
            this.horarios = []

            this.searchHorarioIes()
            if (this.horarios.length < 1) {
                this._confirmService.openAlert({
                    header: 'Advertencia de configuracion',
                    message: 'Tiene que crear una distribucion de horas',
                    icon: 'pi pi-exclamation-triangle',
                })
            }
        }

        if (cbo === 'horario') {
            this.visible_grid = false
            this.formSearch.get('iSeccionId_search').reset()
            this.areas = [] // limpia los valores del array en caso de seleccion de cbo
            this.secciones = []

            this.formSearch.get('iHorarioIeId_search').setValue(selected)
            //console.table(this.horarios)
            const filteredDataHorario = this.horarios.filter(
                (item) => item.iHorarioIeId === selected
            )
            console.log(filteredDataHorario, 'filteredDataHorario')
            this.procesarBloques(filteredDataHorario)

            const filteredData = this.lista_niveles_grados.filter(
                (item) =>
                    item.iNivelGradoId === iNivelGradoId_search &&
                    item.iModalServId === iModalServId_search &&
                    item.iTurnoId === this.iTurnoId
            )

            // Construir un array único de turnos

            this.secciones = Array.from(
                new Map(
                    filteredData.map((item) => [
                        item.iSeccionId, // Clave única para evitar duplicados
                        {
                            iSeccionId: item.iSeccionId,
                            cSeccionNombre: item.cSeccionNombre,
                        },
                    ])
                ).values()
            )
            // Ordenar el arreglo sin importar el tamaño
            this.secciones = this.secciones.sort(
                (a, b) => Number(a.iSeccionId) - Number(b.iSeccionId)
            )

            console.log(this.secciones, 'this.iSeccionId ')
        }

        if (cbo === 'seccion') {
            this.visible_bloque = false
            this.visible_grid = true
            this.iSeccionId = selected
            this.searchListarAsignaturas()
        }
    }
    // buscadores

    searchConfiguraciones() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.perfil.iSedeId,
                }),
                _opcion: 'getConfiguracion',
            })
            .subscribe({
                next: (data: any) => {
                    this.configuracion = data.data
                    console.log(this.configuracion, ' this.configuracion')
                },
                error: (error) => {
                    console.log('Error procedimiento BD:', error)
                },
                complete: () => {
                    console.log('Request completed')

                    if (this.configuracion.length > 0) {
                        // this.SearchNivelGrados(this.configuracion[0].iConfigId) // carga los grados
                    } else {
                        this._confirmService.openAlert({
                            header: 'Advertencia de configuración',
                            message:
                                'No se encuentra registro de ambientes no creado, año acdémico ' +
                                this.dremoYear,
                            icon: 'pi pi-times-circle',
                            //severity : "error"
                        })

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Registro no valido',
                            detail: 'El calendario escolar y periodos no configurados',
                        })
                    }

                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }

    searchHorarioIes() {
        this.query
            .searchHorarioIes({
                iSedeId: this.perfil.iSedeId,
                iTurnoId: this.iTurnoId,
            })
            .subscribe({
                next: (data: any) => {
                    this.horarios = data.data
                    console.table(this.horarios)
                },
                error: (error) => {
                    console.log('Error procedimiento BD:', error)
                },
                complete: () => {
                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }

    getSemestres() {
        const params = 'iYAcadId = ' + this.perfil.iYAcadId
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'semestre_academicos',
                campos: '*',
                condicion: params,
            })
            .subscribe({
                next: (data: any) => {
                    this.semestres = data.data
                    //    this.iServId = this.serv_atencion[0].iServEdId
                    console.log(this.secciones, 'secciones')
                },
                error: (error) => {
                    console.error('Error fetching secciones:', error)
                },
                complete: () => {
                    // console.log('Request completed')
                },
            })
    }

    getBloqueHorario() {
        const params = ''
        this.query
            .searchCalAcademico({
                esquema: 'acad',
                tabla: 'bloques_horario',
                campos: '*',
                condicion: params,
            })
            .subscribe({
                next: (data: any) => {
                    this.bloques = data.data
                    //    this.iServId = this.serv_atencion[0].iServEdId
                    console.log(this.bloques, 'secciones')
                },
                error: (error) => {
                    console.error('Error fetching secciones:', error)
                },
                complete: () => {
                    // console.log('Request completed')
                },
            })
    }

    procesarBloques(data: any) {
        this.items = data.flatMap((item: any) => {
            // Asegúrate de que 'horarios' sea un arreglo, parseando si es una cadena JSON
            const horariosArray =
                typeof item.det_horario === 'string'
                    ? JSON.parse(item.det_horario)
                    : item.det_horario

            if (!Array.isArray(horariosArray)) {
                console.error(
                    'Horarios no es un arreglo válido:',
                    horariosArray
                )
                return [] // Si no es un arreglo, devuelve un arreglo vacío
            }

            // Mapea los horarios
            let counter = 1 // Inicializar contador
            return horariosArray.map((bloque: any) => ({
                id: counter++, // Incrementar el contador por cada elemento
                iHorarioIeId: item.iHorarioIeId, // Propiedad del objeto padre
                inicio: this.getFormattedTime(bloque.dtHorarioHInicio),
                fin: this.getFormattedTime(bloque.dtHorarioHFin),
                iBloqueHorarioId: bloque.iBloqueHorarioId, // Asumiendo que este es el ID correcto
                bloque: bloque.cBloqueHorarioNombre || '', // Verifica si este campo existe
                iTipoBloqueId: bloque.iTipoBloqueId || null, // Maneja casos donde falte el dato
            }))
        })
        console.log(this.items, 'this.items')
    }

    SearchNivelGrados(id: number) {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iConfigId: id,
                }),
                _opcion: 'getGradoModalidadTurnoSeccion',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_niveles_grados = data.data

                    // Extraer los valores únicos de "cGradoNombre" e "iNivelGradoId"
                    this.grados = Array.from(
                        new Map(
                            data.data.map((item) => [
                                item.iNivelGradoId + item.cGradoNombre,
                                {
                                    iNivelGradoId: item.iNivelGradoId,
                                    cGradoNombre: item.cGradoNombre,
                                },
                            ])
                        ).values()
                    )

                    console.log(this.grados, 'this.grados')
                    console.log(
                        this.lista_niveles_grados,
                        'this.lista_niveles_grados'
                    )
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                },
                complete: () => {
                    // Ordenar el arreglo sin importar el tamaño
                    this.grados = this.grados.sort(
                        (a, b) =>
                            Number(a.iNivelGradoId) - Number(b.iNivelGradoId)
                    )
                    console.log('Request completed')
                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }

    searchListarAsignaturas() {
        const params = JSON.stringify({
            iNivelGradoId:
                this.formSearch.get('iNivelGradoId_search')?.value ?? 0,
            iSemAcadId: this.formSearch.get('iSemAcadId_search')?.value ?? 0,
            iModalServId:
                this.formSearch.get('iModalServId_search')?.value ?? 0,
            iTurnoId: this.formSearch.get('iTurnoId_search')?.value ?? 0,
            iSeccionId: this.formSearch.get('iSeccionId_search')?.value ?? 0,
            iProgId: this.formSearch.get('iProgId_search')?.value ?? 0,
            iYAcadId: this.formSearch.get('iYAcadId_search')?.value ?? 0,
        })

        console.log(params, 'parameto searchListarAsignaturas')
        console.log(this.perfil, 'configuracion')
        this.query
            .searchAmbienteAcademico({
                json: params,
                _opcion: 'listarAreasModalidadTurnoSeccion',
            })
            .subscribe({
                next: (data: any) => {
                    //this.lista = this.extraerSecciones(data.data)
                    this.areas = data.data
                    // filtar horarios de los areas

                    const filteredData = data.data
                        .filter((item) => item.idDocCursoId > 0)
                        .map((item) => ({
                            idDocCursoId: Number(item.idDocCursoId),
                            horarios: item.horarios,
                            cCursoNombre: item.cCursoNombre,
                            iDocenteId: item.iDocenteId,
                            nCursoTotalHoras: item.nCursoTotalHoras,
                            nombre_completo: item.nombre_corto,
                        }))

                    this.searchHorarioAreas(filteredData)

                    //   console.log(data.data, ' areas xxx aqui')
                },
                error: (error) => {
                    console.error('Error fetching  seccionesAsignadas:', error)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error de conexión',
                        detail: 'Se registro error en el procedimiento',
                    })
                },
                complete: () => {
                    console.log(this.areas, 'desde getSeccionesAsignadas')
                },
            })
    }

    searchPersonalDocente() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iSedeId: this.configuracion[0].iSedeId,
                    iYAcadId: this.configuracion[0].iYAcadId,
                }),
                _opcion: 'getDocentesSede',
            })
            .subscribe({
                next: (data: any) => {
                    const item = data.data

                    this.docentes = item.map((persona) => ({
                        ...persona,
                        nombre_completo: (
                            persona.cPersDocumento +
                            ' ' +
                            persona.cPersPaterno +
                            ' ' +
                            persona.cPersMaterno +
                            ' ' +
                            persona.cPersNombre +
                            ' - ' +
                            persona.cEspDocNombre
                        ).trim(),
                    }))

                    //console.log(this.docentes, 'personal ies')
                },
                error: (error) => {
                    console.error('Error procedimiento BD:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    // this.getYearCalendarios(this.formCalendario.value)
                },
            })
    }

    searchHorarioAreas(asignados: any) {
        // console.log(asignados, 'areas_asignados en funcion')
        this.areas_asignadas = asignados.flatMap((item: any) => {
            // Asegúrate de que 'horarios' sea un arreglo, parseando si es una cadena JSON
            const horariosArray =
                typeof item.horarios === 'string'
                    ? JSON.parse(item.horarios)
                    : item.horarios

            if (!Array.isArray(horariosArray)) {
                console.error(
                    'Horarios no es un arreglo válido:',
                    horariosArray
                )
                return [] // Si no es un arreglo, devuelve un arreglo vacío
            }

            // Mapea los horarios
            return horariosArray.map((horario: any) => ({
                idDocCursoId: item.idDocCursoId, // Propiedad del objeto padre
                iHorarioId: horario.iHorarioId, // Propiedad dentro de cada horario
                iDiaId: horario.iDiaId, // Propiedad dentro de cada horario

                dia: this.getConfig(horario.iDiaId),
                inicio: this.getFormattedTime(horario.dtHorarioHInicio),
                fin: this.getFormattedTime(horario.dtHorarioHFin),
                iEstado: horario.iEstado,
                asignatura: item.cCursoNombre,
                iDocenteId: item.iDocenteId,
                nCursoTotalHoras: item.nCursoTotalHoras,
                profesor: item.nombre_completo,
            }))
        })
        this.registros = this.areas_asignadas
        console.table(this.areas_asignadas)
    }
    // acciones de componente table
    //  accionBtnItemTable({ accion, item }) {

    //  }
    confirm() {
        this._confirmService.openConfiSave({
            message: '¿Estás seguro de que deseas guardar y continuar?',
            header: 'Advertencia de autoguardado',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // Acción para eliminar el registro
                this.router.navigate(['/gestion-institucional/resumen'])
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Acción cancelada',
                })
            },
        })
    }
    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                //this.addPersonal();
                this.searchListarAsignaturas()
                //this.visible = false
                break
            case 'editar':
                //this.searchListaAreaDocente()
                this.searchListarAsignaturas()
                //this.visible = false
                break
        }
    }

    asignarHorario(area: any) {
        this.area = area
        this.visible_horario = false
        this.visible_docente = false

        if ((area.idDocCursoId ?? 0) < 1) {
            this.visible_docente = true
            this.caption_docente = 'Registrar docente de ' + area.cCursoNombre
            //  alert('mensaje dentro de if')
        } else {
            this.visible_horario = true
            this.caption = 'Registrar horario de ' + area.cCursoNombre
            this.option = 'crear'
            // alert('mensaje dentro de else')
        }

        console.log(area, 'area en configuración')
    }

    addHorario(registro: any) {
        console.log(registro, ' registro de componente add sin formate')
        const inicio = this.getFormattedTime(registro.inicio)
        const fin = this.getFormattedTime(registro.fin)

        this.query
            .addCalAcademico({
                json: JSON.stringify({
                    iDiaId: registro.iDiaId,
                    idDocCursoId: registro.idDocCursoId,
                    dtHorarioHInicio: inicio,
                    dtHorarioHFin: fin,
                    iEstado: 1,
                }),
                _opcion: 'addHorarioSede',
            })
            .subscribe({
                next: (data: any) => {
                    // let periodosAcademicos: Array<any> = JSON.parse(
                    //     data.data[0]['calPeriodos']
                    // )
                    console.log(data, 'addHorarioSede')
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.searchListarAsignaturas() // refresca los registros
                },
            })
    }

    addBlockHorario(registro: any) {
        console.table(registro)
        // const hoy = new Date().toISOString().split('T')[0] // Obtiene la fecha actual en formato YYYY-MM-DD
        const _array = registro.map((horario) => ({
            ...horario,
            iSedeId: this.perfil.iSedeId,
            iTurnoId: this.iTurnoId,
            inicio: horario.inicio, // Formato ISO 8601
            fin: horario.fin,
        }))
        console.log(_array, 'registro de componente add sin formate')
        this.query
            .addCalAcademico({
                json: JSON.stringify(_array),
                _opcion: 'addBloqueHorarioSede',
            })
            .subscribe({
                next: (data: any) => {
                    // let periodosAcademicos: Array<any> = JSON.parse(
                    //     data.data[0]['calPeriodos']
                    // )
                    console.log(data, 'addHorarioSede')
                },
                error: (error) => {
                    console.error('Error fetching modalidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                    this.searchHorarioIes()
                },
            })
    }

    getFormattedTime(date: Date): string {
        const formattedDate = new Date(date)
        formattedDate.setSeconds(0)
        return formattedDate.toLocaleTimeString('en-US', { hour12: false }) // Ajusta el formato según sea necesario
    }

    formatTimeToSQL(time: string): string {
        const date = new Date(`1970-01-01T${time}`)
        return date.toTimeString().split(' ')[0] // Devuelve 'HH:mm:ss'
    }

    getConfig(dia: number): string {
        switch (dia) {
            case 1:
                return 'Lunes'
            case 2:
                return 'Martes'
            case 3:
                return 'Miércoles'
            case 4:
                return 'Jueves'
            case 5:
                return 'Viernes'
            case 6:
                return 'Sábado'
            case 7:
                return 'Domingo'
            default:
                return 'Día no válido' // Valor por defecto para casos no válidos
        }
    }
}

//     addAreaDocente() {
//         //agrega asignatura a Docente
//         const params = JSON.stringify({
//             iProgId: Number(this.formSearch.get('iProgId_search')?.value),
//             iCursosNivelGradId: Number(
//                 this.form.get('iCursosNivelGradId')?.value
//             ),
//             iCursosNivelGradId_ies_cursos:
//                 Number(this.form.get('iCursosNivelGradId_ies_cursos')?.value) ??
//                 0,
//             idDocCursoId: Number(this.form.get('idDocCursoId')?.value) ?? 0,
//             iIeCursoId: Number(this.form.get('iIeCursoId')?.value) ?? 0,

//             iSemAcadId: Number(this.form.get('iSemAcadId')?.value),
//             iYAcadId: Number(this.configuracion[0].iYAcadId),
//             iCursoId: this.form.get('iCursoId')?.value,
//             cDocCursoObservaciones: this.form.get('cDocCursoObservaciones')
//                 ?.value,
//             iDocCursoHorasLectivas: this.form.get('ihora_asignada')?.value,
//             iEstado: this.form.get('iEstado')?.value,
//             iSeccionId: this.form.get('iSeccionId')?.value,
//             iTurnoId: this.form.get('iTurnoId')?.value,
//             iModalServId: this.form.get('iModalServId')?.value,
//             iDocenteId: this.form.get('iDocenteId')?.value,
//         })

//         this.query
//             .addAmbienteAcademico({
//                 json: params,
//                 _opcion: 'addDocenteGradoSecciones',
//             })
//             .subscribe({
//                 next: (data: any) => {
//                     this.form.get('idDocCursoId').setValue(data.data[0].id)
//                     console.log(data, 'id', data.data[0].id)
//                     console.log(data.data)
//                 },
//                 error: (error) => {
//                     console.error('Error fetching ambiente:', error)
//                 },
//                 complete: () => {
//                     this.messageService.add({
//                         severity: 'success',
//                         summary: 'Mensaje',
//                         detail: 'Proceso exitoso',
//                     })
//                     console.log('Request completed')
//                     this.searchListaAreaDocente()
//                     this.visible = true
//                 },
//             })
//     }
// }

// this.query.getConfiguracionHorario(this.cicloAcad).subscribe(
//   data => {
//     const dataConfig: any = data;
//     if (dataConfig.length > 0) {

//       const horaInicio = data[0].tHoraConfHini.split('.');
//       const horaFin = data[0].tHoraConfHfin.split('.');
//       this.horaInicio = horaInicio[0];
//       this.horaFin = horaFin[0];
//       this.lunes = data[0].iHoraConfLunes;
//       this.martes = data[0].iHoraConfMartes;
//       this.miercoles = data[0].iHoraConfMiercoles;
//       this.jueves = data[0].iHoraConfJueves;
//       this.viernes = data[0].iHoraConfViernes;
//       this.sabado = data[0].iHoraConfSabado;
//       this.domingo = data[0].iHoraConfDomingo;
//       this.items = data;

//     }

//   },
//   error => {
//     console.log(error);
//   },
// );

// save() {
//   const data = {
//     horaInicio: this.horaInicio,
//     horaFin: this.horaFin,
//     lunes: this.lunes || false,
//     martes: this.martes || false,
//     miercoles: this.miercoles || false,
//     jueves: this.jueves || false,
//     viernes: this.viernes || false,
//     sabado: this.sabado || false,
//     domingo: this.domingo || false,
//     cicloAcad: this.cicloAcad
//   };
//   this.query.hconfig(data).subscribe(
//     data => {
//       Swal.fire('Éxito', 'Se guardó exitosamente los datos.', 'success');
//     },
//     error => {
//       if (!error.error.hasOwnProperty('errors')) {
//         Swal.fire( '¡Hay un problema!', error.error.message, 'error');
//       } else {
//           let mensaje = '';
//           for (const i in error.error.errors) {
//               for (const j in error.error.errors[i]) {
//               const errorMensaje = error.error.errors[i][j];
//               mensaje += `${errorMensaje}\n`;
//               }
//           }
//           Swal.fire( 'Validación incompleta', mensaje, 'error');
//       }
//     },
//   );
// }
