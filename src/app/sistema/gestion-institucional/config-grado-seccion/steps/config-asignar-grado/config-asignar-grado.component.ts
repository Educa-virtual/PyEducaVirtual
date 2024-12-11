import { Component, inject, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { PrimengModule } from '@/app/primeng.module'
import { AdmStepGradoSeccionService } from '@/app/servicios/adm/adm-step-grado-seccion.service'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MenuItem, MessageService, TreeNode } from 'primeng/api'
import { GeneralService } from '@/app/servicios/general.service'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'

import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { TreeViewPrimengComponent } from '../../../../../shared/tree-view-primeng/tree-view-primeng.component'

@Component({
    selector: 'app-config-asignar-grado',
    standalone: true,
    imports: [
        StepsModule,
        PrimengModule,
        ContainerPageComponent,
        TablePrimengComponent,
        TreeViewPrimengComponent,
    ],
    templateUrl: './config-asignar-grado.component.html',

    styleUrl: './config-asignar-grado.component.scss',
})
export class ConfigAsignarGradoComponent implements OnInit {
    items: MenuItem[]
    form: FormGroup
    formSearch: FormGroup

    files!: TreeNode[]
    selectedFiles!: TreeNode[]

    visible: boolean = false
    caption: string
    c_accion: string

    lista: any = {} // para componente tree
    rawData: Array<object> // para componente tree

    docentes: any = []
    lista_niveles_grados: any = []

    semestres: Array<object>
    cursos: Array<object>

    grados: any[]
    planes: any[]
    modalidades: any = []
    turnos: any[]
    secciones: any = []

    lista_areas_docente: any = []
    horas_asignadas: number
    minimo: number = 0

    configuracion: any = []
    sede: any[]
    seccionesAsignadas: any[]

    private _confirmService = inject(ConfirmationModalService)

    constructor(
        private stepService: AdmStepGradoSeccionService,
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private query: GeneralService
    ) {
        this.items = this.stepService.itemsStep
        this.configuracion = this.stepService.configuracion
        this.sede = this.stepService.sede
        console.log(this.configuracion, 'configuracion servicio')
    }

    ngOnInit(): void {
        console.log(this.configuracion, 'configuracion onit')

        try {
            this.searchPersonalDocente()
            this.SearchNivelGrados()

            this.getGrado()
            //this.getPlanes()
            this.getSeccionesAsignadas()
            this.getSemestres()

            this.formSearch = this.fb.group({
                iSemAcadId_search: [0],
                iProgId_search: [this.configuracion[0].iProgId],
                iNivelGradoId_search: [0],
                iTurnoId_search: [0],
                iSeccionId_search: [0],
                iModalServId_search: [0],
                buscador: [1],
            })
            this.form = this.fb.group({
                idDocCursoId: [0], // PK,
                iSemAcadId: [0], // tabla docente_curso (FK)
                iYAcadId: [this.configuracion[0].iYAcadId], // tabla docente_curso (FK)
                iDocenteId: [0, Validators.required], // tabla docente_curso (FK)
                iIeCursoId: [{ value: 0, disabled: true }],

                iModalServId: [0],

                iSeccionId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
                iTurnoId: [{ value: 0, disabled: true }, Validators.required], // tabla docente_curso (FK)
                cDocCursoObsevaciones: [''], // tabla docente_curso (FK)
                // iDocCursoHorasLectivas: [0, [Validators.pattern(/^\d+$/),  Validators.min(4), Validators.max(40)]],
                iEstado: [1],
                iCursoId: [{ value: 0, disabled: true }],

                iNivelGradoId: [{ value: 0, disabled: true }],
                cCicloNombre: [{ value: '', disabled: true }],
                cNivelNombre: [{ value: '', disabled: true }],
                cNivelTipoNombre: [{ value: '', disabled: true }],
                ihora_disponible: [{ value: 0 }, [Validators.min(this.minimo)]],
                ihora_total: [
                    { value: 0, disabled: true },
                    [Validators.pattern(/^\d+$/)],
                    Validators.required,
                ],
                ihora_asignada: [
                    { value: 0, disabled: true },
                    [Validators.pattern(/^\d+$/)],
                    Validators.required,
                ],

                iCursosNivelGradId: [],
                iCursosNivelGradId_ies_cursos: [],
                iDocenteId_ies_curso: [],
            })
        } catch (error) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error en conexion al servidor',
                detail: 'La conexion excedió tiempo de espera',
            })
            this.router.navigate(['/gestion-institucional/configGradoSeccion'])
            console.log(error, 'error de variables')
        }
    }

    extraerSecciones(seccionesPosGrado) {
        // Agrupar las secciones por grado
        const agruparSeccionesPorGrado = (
            datos: any[]
        ): Record<string, string[]> => {
            return datos.reduce(
                (acumulador, item) => {
                    const grado = item.cGradoNombre // Nombre del grado
                    const seccion = item.cSeccionNombre // Nombre de la sección

                    // Si el grado no existe en el acumulador, inicializarlo como un array vacío
                    if (!acumulador[grado]) {
                        acumulador[grado] = []
                    }

                    // Agregar la sección al grado (evitando duplicados)
                    if (!acumulador[grado].includes(seccion)) {
                        acumulador[grado].push(seccion)
                    }

                    return acumulador
                },
                {} as Record<string, string[]>
            )
        }

        // Usar la función para agrupar las secciones
        const resultado = agruparSeccionesPorGrado(seccionesPosGrado)
        return resultado
    }
    //==============================================

    onChange(event: any, cbo: string): void {
        const selected = event.value

        // const iSemAcadId_search = this.formSearch.get('iSemAcadId_search')?.value ?? null;
        const iNivelGradoId_search =
            this.formSearch.get('iNivelGradoId_search')?.value ?? null
        const iModalServId_search =
            this.formSearch.get('iModalServId_search')?.value ?? null
        // const iTurnoId_search= this.formSearch.get('iTurnoId_search')?.value ?? null;
        // const iProgId_search = this.formSearch.get('iProgId_search')?.value ?? null;

        if (cbo === 'searchNivelGrado') {
            this.cursos = [] // limpia los valores del array en caso de seleccion de cbo
            console.log(event.value, 'valor para buscar ')
        }
        if (cbo === 'grado') {
            // Encuentra el objeto
            // Extraer los valores únicos de "cGradoNombre" e "iNivelGradoId"
            this.cursos = [] // limpia los valores del array en caso de seleccion de cbo
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
            // Encuentra el objeto
            this.cursos = [] // limpia los valores del array en caso de seleccion de cbo
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
            this.cursos = [] // limpia los valores del array en caso de seleccion de cbo
            const filteredData = this.lista_niveles_grados.filter(
                (item) =>
                    item.iNivelGradoId === iNivelGradoId_search &&
                    item.iModalServId === iModalServId_search &&
                    item.iTurnoId === selected
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
            this.searchListarAsignaturas()
        }

        if (cbo === 'docente') {
            this.searchListaAreaDocente()
        }
    }
    // buscadores

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
            iYAcadId: this.configuracion[0].iYAcadId,
        })
        this.query
            .searchAmbienteAcademico({
                json: params,
                _opcion: 'listarAreasModalidadTurnoSeccion',
            })
            .subscribe({
                next: (data: any) => {
                    //this.lista = this.extraerSecciones(data.data)
                    this.cursos = data.data
                    console.log(data.data, ' cursos xxx')
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
                    console.log(this.lista, 'desde getSeccionesAsignadas')
                },
            })
    }

    searchListaAreaDocente() {
        const iDocenteId = this.form.get('iDocenteId')?.value ?? null
        const registro = this.docentes.find(
            (option) => option.iDocenteId === iDocenteId
        ) // devuelve el campo
        this.form.get('ihora_total')?.setValue(registro.iHorasLabora)
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iProgId: this.formSearch.get('iProgId_search')?.value,
                    iYAcadId: this.configuracion[0].iYAcadId,
                    iDocenteId: iDocenteId,
                }),
                _opcion: 'listarAreaXDocenteSedeAnio',
            })
            .subscribe({
                next: (data: any) => {
                    this.lista_areas_docente = data.data
                    const datos = data.data
                    this.horas_asignadas = datos.reduce(
                        (sum, docente) =>
                            Number(sum) + Number(docente.nCursoTotalHoras),
                        0
                    )
                    console.log(datos, 'datos')
                    // this.seccionesAsignadas = data.data
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error en conexión',
                        detail: 'Error en listar docentes asignados',
                    })
                    console.error(
                        'Error fetching  lista de Áreas curriculares:',
                        error
                    )
                },
                complete: () => {
                    const total = this.form.get('ihora_total')?.value
                    if (iDocenteId > 0) {
                        const disponible = total - Number(this.horas_asignadas)
                        const valor = !isNaN(disponible) ? disponible : 0
                        this.form.get('ihora_disponible')?.setValue(valor)
                        this.actualizarMinimo(
                            this.form.get('ihora_asignada')?.value
                        )
                    } else {
                        this.form.get('ihora_disponible')?.setValue(0)
                    }
                },
            })
    }

    SearchNivelGrados() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iConfigId: this.configuracion[0].iConfigId,
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

                    console.log(this.docentes, 'personal ies')
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
    // getPlanes(){
    //     const params = 'iSedeId = '+  this.configuracion[0].iSedeId
    //     this.query.searchCalAcademico({
    //             esquema: 'acad',
    //             tabla: 'programas_estudios',
    //             campos: '*',
    //             condicion: params,
    //         })
    //         .subscribe({
    //             next: (data: any) => {
    //                 this.planes = data.data
    //                 console.log(this.planes,'secciones')
    //             },
    //             error: (error) => {
    //                 console.error('Error fetching secciones:', error)
    //             },
    //             complete: () => {
    //                 // console.log('Request completed')
    //             },
    //         })
    // }

    getSemestres() {
        const params = 'iYAcadId = ' + this.configuracion[0].iYAcadId
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

    //tree
    getSeccionesAsignadas() {
        this.query
            .searchAmbienteAcademico({
                json: JSON.stringify({
                    iConfigId: this.configuracion[0].iConfigId,
                }),
                _opcion: 'getSeccionesConfig',
            })
            .subscribe({
                next: (data: any) => {
                    // this.seccionesAsignadas = data.data
                    //    this.iServId = this.serv_atencion[0].iServEdId
                    this.lista = this.extraerSecciones(data.data)
                    this.seccionesAsignadas = data.data.map((ambiente: any) => {
                        return {
                            ...ambiente, // Mantén todos los campos originales
                            arrayAmbientes: {
                                ciclo: ambiente.cCicloRomanos,
                                grado: ambiente.cGradoNombre,
                                seccion: ambiente.cSeccionNombre,
                                estudiantes: ambiente.iDetConfCantEstudiantes,
                                ambiente: ambiente.cAmbienteNombre,
                            },
                        }
                    })

                    //   console.log(this.seccionesAsignadas,' seccionesAsignadas')
                },
                error: (error) => {
                    console.error('Error fetching  seccionesAsignadas:', error)
                },
                complete: () => {
                    // console.log('Request completed')
                    //    setTimeout(() => {

                    //    // this.updateData();
                    // }, 2000);
                    console.log(this.lista, 'desde getSeccionesAsignadas')
                },
            })
    }

    getGrado() {
        this.query
            .searchGradoCiclo({
                iNivelTipoId: this.stepService.iNivelTipoId,
            })
            .subscribe({
                next: (data: any) => {
                    // this.grados = data.data
                    this.rawData = data.data
                    console.log(this.grados, 'grados desde getGrado')
                },
                error: (error) => {
                    console.error('Error fetching grados:', error)
                },
                complete: () => {
                    console.log(this.grados, 'grados desde getGrado')
                },
            })
    }
    //========================================================
    //funciones de registro

    deleteAsignacionArea(id: number) {
        const params = {
            esquema: 'acad',
            tabla: 'Docente_cursos',
            campo: 'idDocCursoId',
            valorId: id,
        }
        this.query.deleteAcademico(params).subscribe({
            next: (data: any) => {
                console.log(data.data)
            },
            error: (error) => {
                // console.error('Error fetching ambiente:', error)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Mensaje de error',
                    detail: 'NO se pudo eliminar registro' + error,
                })
            },
            complete: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Eliminado',
                    detail: 'Registro eliminado correctamente',
                })
                console.log('Request completed')
                this.searchListaAreaDocente()
                this.searchListarAsignaturas()
            },
        })
    }

    addAreaDocente() {
        //agrega asignatura a Docente
        const params = JSON.stringify({
            iProgId: Number(this.formSearch.get('iProgId_search')?.value),
            iCursosNivelGradId: Number(
                this.form.get('iCursosNivelGradId')?.value
            ),
            iCursosNivelGradId_ies_cursos:
                Number(this.form.get('iCursosNivelGradId_ies_cursos')?.value) ??
                0,
            idDocCursoId: Number(this.form.get('idDocCursoId')?.value) ?? 0,
            iIeCursoId: Number(this.form.get('iIeCursoId')?.value) ?? 0,

            iSemAcadId: Number(this.form.get('iSemAcadId')?.value),
            iYAcadId: Number(this.configuracion[0].iYAcadId),
            iCursoId: this.form.get('iCursoId')?.value,
            cDocCursoObservaciones: this.form.get('cDocCursoObservaciones')
                ?.value,
            iDocCursoHorasLectivas: this.form.get('ihora_asignada')?.value,
            iEstado: this.form.get('iEstado')?.value,
            iSeccionId: this.form.get('iSeccionId')?.value,
            iTurnoId: this.form.get('iTurnoId')?.value,
            iModalServId: this.form.get('iModalServId')?.value,
            iDocenteId: this.form.get('iDocenteId')?.value,
        })

        this.query
            .addAmbienteAcademico({
                json: params,
                _opcion: 'addDocenteGradoSecciones',
            })
            .subscribe({
                next: (data: any) => {
                    this.form.get('idDocCursoId').setValue(data.data[0].id)
                    console.log(data, 'id', data.data[0].id)
                    console.log(data.data)
                },
                error: (error) => {
                    console.error('Error fetching ambiente:', error)
                },
                complete: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Mensaje',
                        detail: 'Proceso exitoso',
                    })
                    console.log('Request completed')
                    this.searchListaAreaDocente()
                    this.visible = true
                },
            })
    }
    // Método para actualizar dinámicamente el validador
    actualizarMinimo(nuevoMinimo: number): void {
        const iDocenteId = this.form.get('iDocenteId')?.value ?? 0
        const iDocenteId_ies_curso =
            this.form.get('iDocenteId_ies_curso')?.value ?? 0
        this.minimo = nuevoMinimo // Actualiza el valor de mínimo

        if (iDocenteId_ies_curso > 0 && iDocenteId === iDocenteId_ies_curso) {
            //se valida que el registro existente sea del docente y pueda agregar observaciones
            this.form.get('ihora_disponible').setValidators([
                Validators.required,
                Validators.pattern(/^\d+$/),
                //Validators.min(0)  // Asegura que haya al menos una hora disponible ! No es necesario para editar el mismo registro existente
            ])

            // Reevaluar el estado del campo después de cambiar los validadores
            this.form.get('ihora_disponible')?.updateValueAndValidity()
        } else {
            // delimita crear un registro que no cumpla con la cantidad de horas
            this.form.get('ihora_disponible').setValidators([
                Validators.required,
                Validators.pattern(/^\d+$/),
                Validators.min(this.minimo), // Asegura que haya al menos una hora disponible
            ])

            // Reevaluar el estado del campo después de cambiar los validadores
            this.form.get('ihora_disponible')?.updateValueAndValidity()
        }
    }
    // acciones de componente table
    accionBtnItemTable({ accion, item }) {
        if (accion === 'editar') {
            console.log(item, 'btnTable')
            this.c_accion = accion
            this.caption = 'Editar áreas curricularesasignadas a docente'

            this.form
                .get('iNivelGradoId')
                ?.setValue(this.formSearch.get('iNivelGradoId_search')?.value)
            this.form
                .get('iModalServId')
                ?.setValue(this.formSearch.get('iModalServId_search')?.value)
            this.form
                .get('iSemAcadId')
                ?.setValue(this.formSearch.get('iSemAcadId_search')?.value)
            this.form
                .get('iTurnoId')
                ?.setValue(this.formSearch.get('iTurnoId_search')?.value)
            this.form
                .get('iSeccionId')
                ?.setValue(this.formSearch.get('iSeccionId_search')?.value)
            this.form.get('iCursoId')?.setValue(item.iCursoId)
            this.form.get('iDocenteId')?.setValue(item.iDocenteId)
            this.form.get('idDocCursoId')?.setValue(item.idDocCursoId)
            this.form.get('ihora_asignada')?.setValue(item.nCursoTotalHoras) //.iDocCursoHorasLectivas
            this.form.get('idDocCursoId')?.setValue(item.idDocCursoId)
            this.form
                .get('iCursosNivelGradId')
                ?.setValue(item.iCursosNivelGradId)
            this.form
                .get('iCursosNivelGradId_ies_cursos')
                ?.setValue(item.iCursosNivelGradId_ies_cursos)

            // detecta si el área curricular fue asignada a una seccion de la institución
            if (item.iSeccionId === null) {
                this._confirmService.openConfirm({
                    header: 'Advertencia área curricular sin asignar',
                    message: 'Desea asignar docente al area curricular',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        // Acción para eliminar el registro
                        this.form.get('ihora_disponible')?.setValue(0)
                        this.form.get('iDocenteId_ies_curso')?.setValue(0)
                        this.visible = true
                        this.lista_areas_docente = []
                    },
                    reject: () => {
                        // Mensaje de cancelación (opcional)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Mensaje',
                            detail: 'Registro cancelado',
                        })
                    },
                })
            } else {
                this.visible = true
                this.form.get('iDocenteId_ies_curso')?.setValue(item.iDocenteId)
                this.searchListaAreaDocente()
            }
        }

        if (accion === 'agregar') {
            this.c_accion = accion
            this.form.get('iPersId')?.enable()
            this.caption = 'Asignar área curricular a docente'
            //this.clearForm();
            this.visible = true
            this.form
                .get('iNivelGradoId')
                ?.setValue(this.formSearch.get('iNivelGradoId_search')?.value)
            this.form
                .get('iModalServId')
                ?.setValue(this.formSearch.get('iModalServId_search')?.value)
            this.form
                .get('iTurnoId')
                ?.setValue(this.formSearch.get('iTurnoId_search')?.value)
            this.form
                .get('iSeccionId')
                ?.setValue(this.formSearch.get('iSeccionId_search')?.value)
            this.form.get('iCursoId')?.setValue(item.iCursoId)
            this.form.get('ihora_asignada')?.setValue(item.nCursoTotalHoras) //.iDocCursoHorasLectivas
        }
        if (accion === 'eliminar') {
            this._confirmService.openConfirm({
                message: '¿Estás seguro de que deseas eliminar este registro?',
                header: 'Confirmación de eliminación',
                icon: 'pi pi-exclamation-triangle',
                accept: () => {
                    // Acción para eliminar el registro
                    this.deleteAsignacionArea(item.idDocCursoId)
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
    }

    accionBtnItem(accion) {
        switch (accion) {
            case 'guardar':
                //this.addPersonal();
                this.searchListarAsignaturas()
                this.visible = false
                break
            case 'editar':
                //this.updatePersonal();
                this.addAreaDocente()
                this.searchListaAreaDocente()
                this.searchListarAsignaturas()
                this.visible = false
                break
        }
    }

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Retornar',
            text: 'Retornar',
            icon: 'pi pi-arrow-circle-left',
            accion: 'retornar',
            class: 'p-button-warning',
        },
        // {
        //     labelTooltip: 'Asignar grado y sección',
        //     text: 'Asignar grado y sección',
        //     icon: 'pi pi-plus',
        //     accion: 'agregar',
        //     class: 'p-button-primary',
        // },
        {
            labelTooltip: 'Exportar PDF',
            text: 'Reporte',
            icon: 'pi pi-file-pdf',
            accion: 'agregar',
            class: 'p-button-danger',
        },
    ]

    selectedItems = []
    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        // {
        //     labelTooltip: 'Eliminar',
        //     icon: 'pi pi-trash',
        //     accion: 'eliminar',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-danger p-button-text',
        // },
    ]

    actionsArea: IActionTable[] = [
        // {
        //     labelTooltip: 'Editar',
        //     icon: 'pi pi-pencil',
        //     accion: 'editarArea',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-warning p-button-text',
        // },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    actionsLista: IActionTable[]
    columns = [
        {
            type: 'item',
            width: '1rem',
            field: 'item',
            header: 'N°',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '7rem',
            field: 'cCursoNombre',
            header: 'Area curricular',
            text_header: 'center',
            text: 'left',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'nombre_completo',
            header: 'Docente',
            text_header: 'center',
            text: 'left',
        },

        {
            type: 'actions',
            width: '1rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
    columnaArea = [
        {
            type: 'item',
            width: '3%',
            field: 'item',
            header: '',
            text_header: 'left',
            text: 'left',
        },

        {
            type: 'text',
            width: '1rem',
            field: 'cCursoNombre',
            header: 'Área',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cGradoNombre',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'cSeccionNombre',
            header: 'Sección',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '6rem',
            field: 'nCursoTotalHoras',
            header: 'Hora',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actionsArea',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
