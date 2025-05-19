import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component'
import { MessageService } from 'primeng/api'
import { FormBuilder, Validators } from '@angular/forms'
import { ConfirmationModalService } from '@/app/shared/confirm-modal/confirmation-modal.service'
import { ApiAulaService } from '@/app/sistema/aula-virtual/services/api-aula.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import imagenesRecursos from '@/app/shared/imagenes/recursos'
import { GalleriaModule } from 'primeng/galleria'
import { CapacitacionesServiceService } from '@/app/servicios/cap/capacitaciones-service.service'

interface Image {
    id: number
    url: string
    title: string
}

@Component({
    selector: 'app-apertura-curso',
    standalone: true,
    templateUrl: './apertura-curso.component.html',
    styleUrls: ['./apertura-curso.component.scss'],
    imports: [
        PrimengModule,
        ToolbarPrimengComponent,
        TablePrimengComponent,
        GalleriaModule,
    ],
    providers: [MessageService],
})
export class AperturaCursoComponent implements OnInit {
    portada = imagenesRecursos

    private _formBuilder = inject(FormBuilder)
    private _confirmService = inject(ConfirmationModalService)
    private _aulaService = inject(ApiAulaService)
    private _ConstantesService = inject(ConstantesService)
    private _capService = inject(CapacitacionesServiceService)

    iPago: boolean = true
    tipoCapacitacion: any[] = []
    nivelPedagogico: any[] = []
    publicoObjetivo: any[] = []
    cursos: any[] = []
    iCapacitacionId: string = ''
    responsiveOptions1: any[] | undefined
    showModalHorarios: boolean = false
    value!: number //para los dias
    selectedValues: string[] = [] // Se guardarán los valores seleccionados
    instructores: any
    selectedImageId: any

    diaSeleccionado: string | number = 123 //día seleccionado
    fechaSeleccionada: Date | null = null
    datosTemporales: {
        iHoraInicio: string
        iHoraFin: string
    }[] = [] // obtener los datos temporales

    modoFormulario: 'crear' | 'editar' = 'crear'

    dias = [
        { id: 1, nombre: 'Lunes' },
        { id: 2, nombre: 'Martes' },
        { id: 3, nombre: 'Miércoles' },
        { id: 4, nombre: 'Jueves' },
        { id: 5, nombre: 'Viernes' },
        { id: 6, nombre: 'Sabado' },
        { id: 7, nombre: 'Domingo' },
    ]

    constructor(private messageService: MessageService) {}

    // formGroup para el formulario
    public formNuevaCapacitacion = this._formBuilder.group({
        iTipoCapId: ['', [Validators.required]],
        cCapTitulo: ['', [Validators.required]],
        iNivelPedId: ['', [Validators.required]],
        iTipoPubId: [''],
        cCapDescripcion: [''],
        iTotalHrs: ['', [Validators.required]],
        dFechaInicio: [new Date()],
        dFechaFin: [new Date()],
        iCosto: [0],
        nCosto: [0.0],
        iInstId: ['', [Validators.required]],
        cHorario: [''],
        iCantidad: [0],
        cImagenUrl: [''],
        iImageAleatorio: [1],
        jsonHorario: [''],
    })

    responsiveOptions: any[] = [
        {
            breakpoint: '1024px',
            numVisible: 5,
        },
        {
            breakpoint: '768px',
            numVisible: 3,
        },
        {
            breakpoint: '560px',
            numVisible: 1,
        },
    ]

    ngOnInit() {
        // Obtener los select:
        this.obtnerTipoCapacitacion()
        this.obtenerNivelPedagogico()
        this.obtenerTipodePublico()

        console.log('Imgenes', this.portada)
        // Obtener las capacitaciones:
        this.obtenerCapacitaciones()
        // Obtener los instructores:
        this.obtenerInstructoresCurso()

        //
        this.responsiveOptions = [
            {
                breakpoint: '1400px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '1199px',
                numVisible: 3,
                numScroll: 1,
            },
            {
                breakpoint: '767px',
                numVisible: 2,
                numScroll: 1,
            },
            {
                breakpoint: '575px',
                numVisible: 1,
                numScroll: 1,
            },
        ]
    }
    // mostrar los headr de las tablas
    public columnasTabla: IColumn[] = [
        {
            type: 'item',
            width: '0.5rem',
            field: 'index',
            header: 'Nro',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '8rem',
            field: 'cCapTitulo',
            header: 'Título del curso',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: '2rem',
            field: 'dFechaFin',
            header: 'Fecha Fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '1rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    // mostrar los botones de la tabla
    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-succes p-button-text',
            isVisible: (row) => ['1', '2', '3'].includes(row.iEstado),
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
            isVisible: (row) => row.iEstado === '1',
        },
    ]
    //
    showHorarios() {
        this.showModalHorarios = true
    }

    // datosTemporales1: { [key: number]: any } = {}; // Almacena datos por cada botón seleccionado
    datosFinales: any[] = [] // Guarda todo al final
    // botonSeleccionado: number | null = null
    horaSeleccionadaInicio: Date | null = null
    horaSeleccionadaFin: Date | null = null

    nombredia: string
    // metodo para seleccionar día
    mostrarHorario(id: number) {
        const dia = this.dias.find((d) => d.id === id)
        this.nombredia = dia.nombre

        if (dia) {
            this.diaSeleccionado = dia.id
        }
        // this.diaSeleccionado = index
        console.log('indice', this.diaSeleccionado)
        // this.fechaSeleccionada = this.datosTemporales[index]?.horaIni || null
    }
    formatearHora(fecha: Date): string {
        const horas = fecha.getHours().toString().padStart(2, '0')
        const minutos = fecha.getMinutes().toString().padStart(2, '0')
        return `${horas}:${minutos}`
    }

    // guardar temporamente los datos del dia seleccionado
    guardarDatos() {
        if (this.diaSeleccionado) {
            const horaIni = this.formatearHora(this.horaSeleccionadaInicio)
            const horaFin = this.formatearHora(this.horaSeleccionadaFin)

            this.datosTemporales[this.diaSeleccionado] = {
                iDiaId: this.diaSeleccionado.toString(),
                iHorarioUniforme: '1', // Puedes cambiar el valor según sea necesario
                iHoraInicio: horaIni,
                iHoraFin: horaFin,
            }

            console.log('Datos temporales:', this.datosTemporales)

            // Restablecer selección
            this.diaSeleccionado = null
            this.horaSeleccionadaInicio = null
            this.horaSeleccionadaFin = null
        }
    }

    loading: boolean = false
    json
    // datos obtenidos del segundo form
    guardarTodo() {
        this.loading = true
        setTimeout(() => {
            this.loading = false
        }, 2000)

        // Convertimos los datos temporales en un array de objetos con el nombre del día
        // this.datosFinales = Object.entries(this.datosTemporales).map(
        //     ([iDiaId, iHorarioUniforme]) => ({
        //         iDiaId,
        //         iHorarioUniforme,
        //     })
        // )
        this.datosFinales = Object.values(this.datosTemporales)
        this.json = JSON.stringify(this.datosFinales)
        // this.json = JSON.stringify(Object.values(this.datosTemporales), null, 2);

        console.log('Datos guardados:', this.json)
    }

    //
    seleccionarImagen(event: any) {
        const index = event.detail.index // Acceder al índice correcto
        const imagenSeleccionada = this.portada[index] // Obtiene la imagen según el índice
        console.log('Imagen seleccionada:', imagenSeleccionada)

        // Guardar el ID en el formulario
        // this.formNuevaCapacitacion.patchValue({
        // cImagenUrl: imagenSeleccionada.id
        // });
    }

    selectImage(image: any) {
        this.selectedImageId = image.id

        const data = {
            id: image.id,
            name: image.name,
            url: image.url,
        }
        const jsonData = JSON.stringify(data)
        this.formNuevaCapacitacion.patchValue({
            cImagenUrl: jsonData,
        })
    }

    isSelected(image: Image): boolean {
        return this.selectedImageId === image.id
    }

    // asignar la accion a los botones de la tabla
    accionBnt({ accion, item }): void {
        switch (accion) {
            case 'editar':
                this.modoFormulario = 'editar'
                this.iCapacitacionId = item.iCapacitacionId
                // console.log('Editar', item)
                this.formNuevaCapacitacion.patchValue(item)
                // this.selectedItems = []
                // this.selectedItems = [item]
                break
            case 'eliminar':
                this.eliminarCapacitacion(item)
                break
        }
    }

    // metodo para guardar el curso creado
    crearCurso() {
        // if(this.formNuevaCapacitacion.invalid) return;
        if (this.modoFormulario === 'editar') {
            const id = this.iCapacitacionId

            const titulo =
                this.formNuevaCapacitacion.get('cCapTitulo')?.value || ''
            // alert antes de editar el curso creado
            this._confirmService.openConfiSave({
                message: 'Recuerde que no podra retroceder',
                header: `¿Esta seguro que desea Editar: ${titulo} ?`,
                accept: () => {
                    const iDocenteId = 1
                    const iCredId = this._ConstantesService.iCredId
                    // Agregar datos al formulario
                    const data = {
                        ...this.formNuevaCapacitacion.value,
                        iCredId: iCredId,
                        iDocenteId: iDocenteId,
                        iCapacitacionId: id,
                    }
                    this._aulaService.actualizarCapacitacion(data).subscribe({
                        next: (resp: any) => {
                            // Mensaje de guardado(opcional)
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Actualizado',
                                detail: 'Acción éxitosa',
                            })
                            // para refrescar la pagina
                            if (resp?.validated) {
                                this.obtenerCapacitaciones()
                                // this.guardarComunicado.get('cForoRptaPadre')?.reset()
                            }
                            this.formNuevaCapacitacion.reset()
                        },
                        error: (error) => {
                            console.error('Comentario:', error)
                        },
                    })
                    this.modoFormulario = 'crear'
                },
                reject: () => {
                    // Mensaje de cancelación (opcional)
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Cancelado',
                        detail: 'Capacitación no Actualizada',
                    })
                },
            })
        } else {
            // revisar si tiene datos formNuevaCapacitacion para registrar el curso
            const titulo =
                this.formNuevaCapacitacion.get('cCapTitulo')?.value || ''
            // alert en caso si no tiene datos los campos del formulario
            if (titulo == '') {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Tiene que agregar un Título al curso',
                })
            } else {
                // para validar los campos que faltas datos del formulario
                Object.keys(this.formNuevaCapacitacion.controls).forEach(
                    (field) => {
                        const control = this.formNuevaCapacitacion.get(field)
                        control?.markAsTouched() // Marca como tocado (touched)
                        control?.markAsDirty() // Marca como modificado (dirty)
                    }
                )
                // alert antes de guardar el curso creado
                this._confirmService.openConfiSave({
                    message: 'Recuerde que no podra retroceder',
                    header: `¿Esta seguro que desea guardar: ${titulo} ?`,
                    accept: () => {
                        const iDocenteId = 1
                        const iCredId = this._ConstantesService.iCredId
                        // Agregar datos al formulario
                        const data = {
                            ...this.formNuevaCapacitacion.value,
                            iCredId: iCredId,
                            iDocenteId: iDocenteId,
                            jsonHorario: this.json,
                        }
                        console.log('datos', data)

                        this._aulaService.guardarCapacitacion(data).subscribe({
                            next: (resp: any) => {
                                // Mensaje de guardado(opcional)
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Guardado',
                                    detail: 'Acción éxitosa',
                                })
                                // para refrescar la pagina
                                if (resp?.validated) {
                                    this.obtenerCapacitaciones()
                                    // this.guardarComunicado.get('cForoRptaPadre')?.reset()
                                }
                                this.formNuevaCapacitacion.reset()
                            },
                            error: (error) => {
                                console.error('Comentario:', error)
                            },
                        })
                        // ------------------------
                        // this._aulaService.guardarCapacitacion(data).subscribe((data)=>{
                        // Mensaje de guardado(opcional)
                        // this.messageService.add({
                        //     severity: 'success',
                        //     summary: 'Guardado',
                        //     detail: 'Acción éxitosa',
                        // })
                        // console.log(
                        //     'datos de curso',
                        //     this.formNuevaCapacitacion.value
                        // )
                        // this.formNuevaCapacitacion.reset()
                        // })
                    },
                    reject: () => {
                        // Mensaje de cancelación (opcional)
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Cancelado',
                            detail: 'Capacitación no Guardado',
                        })
                    },
                })
            }
        }
    }

    // eliminar capacitación
    eliminarCapacitacion(item) {
        const titulo = item.cCapTitulo
        const data = {
            iCapacitacionId: item.iCapacitacionId,
            iCredId: this._ConstantesService.iCredId,
        }
        // alert antes de guardar el curso creado
        this._confirmService.openConfiSave({
            message: 'Recuerde que no podra retroceder',
            header: `¿Esta seguro que desea Eliminar: ${titulo} ?`,
            accept: () => {
                console.log('Eliminado', data)
                this._aulaService.eliminarCapacitacion(data).subscribe({
                    next: (resp: any) => {
                        // Mensaje de guardado(opcional)
                        this.messageService.add({
                            severity: 'danger',
                            summary: 'Eliminado',
                            detail: 'Acción éxitosa',
                        })
                        // para refrescar la pagina
                        if (resp?.validated) {
                            this.obtenerCapacitaciones()
                        }
                    },
                    error: (error) => {
                        console.error('Comentario:', error)
                    },
                })
            },
            reject: () => {
                // Mensaje de cancelación (opcional)
                this.messageService.add({
                    severity: 'error',
                    summary: 'Cancelado',
                    detail: 'Capacitación no Eliminado',
                })
            },
        })
    }

    // metodo para obtener tipo capacitación:
    obtnerTipoCapacitacion() {
        const userId = 1
        this._aulaService.obtenerTipoCapacitacion(userId).subscribe((Data) => {
            this.tipoCapacitacion = Data['data']
            // console.log('Datos tipo capacitacion', this.tipoCapacitacion)
        })
    }

    // Obtener el nivel pedagógico:
    obtenerNivelPedagogico() {
        const userId = 1
        this._aulaService.obtenerNivelPedagogico(userId).subscribe((Data) => {
            this.nivelPedagogico = Data['data']
            // console.log('Datos tipo capacitacion', this.nivelPedagogico)
        })
    }

    // metodo para obtener el tipo de publico
    obtenerTipodePublico() {
        const userId = 1
        this._aulaService.obtenerTipoPublico(userId).subscribe((Data) => {
            this.publicoObjetivo = Data['data']
            // console.log('Datos tipo capacitacion', this.publicoObjetivo)
        })
    }

    // obtener las capacitaciones
    obtenerCapacitaciones() {
        const iEstado = 1
        const iCredId = this._ConstantesService.iCredId
        const data = {
            iEstado: iEstado,
            iCredId: iCredId,
        }
        this._aulaService.obtenerCapacitacion(data).subscribe((Data) => {
            this.cursos = Data['data']
            // console.log('Datos capacitacion', this.cursos)
        })
    }
    //
    obtenerInstructoresCurso() {
        const iEstado = 1
        const iCredId = Number(this._ConstantesService.iCredId)

        const data = {
            iEstado: iEstado,
            iCredId: iCredId,
        }
        console.log('data', data)
        this._capService.obtenerIntructores(data).subscribe((Data) => {
            // this.instructores = Data['data']
            // console.log('Instructores', this.instructores)
            this.instructores = Data['data'].map((instructor) => ({
                ...instructor, // Mantiene los datos existentes
                nombreLargo: `${instructor.cPersNombre} ${instructor.cPersPaterno} ${instructor.cPersMaterno}`, // Concatenar nombres
            }))
            console.log('instructor', this.instructores)
            // // Aquí actualizas el nombre en el formulario
            //   this.formNuevaCapacitacion.patchValue({
            //     nombreLargo: `${this.instructores.cPersPaterno} ${this.instructores.cPersMaterno} ${this.instructores.cPersNombre}`,});
        })
    }

    // metodo para limpiar el formulario
    limpiarFormulario() {
        this.formNuevaCapacitacion.reset()
        this.modoFormulario = 'crear'
        this.iCapacitacionId = ''
    }
}
