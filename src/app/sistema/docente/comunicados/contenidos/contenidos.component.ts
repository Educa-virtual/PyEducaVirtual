import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { TabViewModule } from 'primeng/tabview'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
interface Comunicado {
    id: number
    titulo: string
    texto: string
    estado: string
    tipo: string
    publicado: string
    prioridad: string
    caduca: string
    grupo: { iGrupoId: string; cGrupoNombre: string }[]
    collapsed: boolean

    curso?: number
    seccion?: number
    grado?: number
}

@Component({
    selector: 'app-contenidos',
    standalone: true,
    imports: [PrimengModule, FormsModule, TabViewModule, TablePrimengComponent],
    templateUrl: './contenidos.component.html',
    styleUrls: ['./contenidos.component.scss'],
})
export class ContenidosComponent implements OnInit {
    private GeneralService = inject(GeneralService)
    iPersId: any
    Isede: any
    iYAcadId: any
    iDocenteId: any
    iEstudianteId: any
    iEspecialistaId: any
    grado: any
    iSemAcadId: any
    year: any
    selectedEstado: number
    iIieeId: any
    data = []
    miembros = []

    // Propiedades para el destinatario
    destinatarioNombre: string = ''
    destinatarioId: number | null = null
    visibleDialog: boolean = false
    tiposPersona: any[] = [
        { grupo: 'Estudiantes', codigo: 1 },
        { grupo: 'Docentes', codigo: 2 },
    ]
    tipoPersona: any
    destinatarios: any[] = []

    columnasDestinatarios: any[] = [
        {
            type: 'actions',
            width: '1rem',
            field: 'iSeleccionado',
            header: 'Elegir',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'item',
            width: '1rem',
            field: 'cItem',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'documento',
            header: 'Documento',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'completos',
            header: 'Apellidos y Nombres',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionDestinatarios = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-user-plus',
            accion: 'seleccionarDestinatario',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    constructor(private ConstantesService: ConstantesService) {
        this.grado = JSON.parse(this.ConstantesService.grados)
        this.iPersId = this.ConstantesService.iPersId
        this.iYAcadId = this.ConstantesService.iYAcadId
        this.Isede = this.ConstantesService.iSedeId
        this.iDocenteId = this.ConstantesService.iDocenteId
        this.iEstudianteId = this.ConstantesService.iEstudianteId
        this.iEspecialistaId = this.ConstantesService.iEspecialistaId
        this.iIieeId = this.ConstantesService.iIieeId
    }

    comunicados = []
    prioridades = []
    tipos = []
    grupos = []

    cursos: any[] = []
    secciones: any[] = []
    grados: any[] = []

    estados = [
        { label: 'ACTIVO', value: 1 },
        { label: 'INACTIVO', value: 0 },
    ]

    ngOnInit() {
        this.cargaDatos()
        this.cargarComunicadosUsuario()
    }
    cargaDatos() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_datos',
            data: {
                year: this.iYAcadId,
                iPersId: this.iPersId,
                iIieeId: this.iIieeId,
            },
        }
        this.getInformation(params, 'obtenerDatos')
    }
    // Variable para el comunicado seleccionado (para editar)
    selectedComunicado: Comunicado = {
        id: 0,
        titulo: '',
        texto: '',
        estado: '',
        tipo: '',
        publicado: '',
        prioridad: '',
        caduca: '',
        grupo: [], // array vacío

        curso: null,
        seccion: null,
        grado: null,

        collapsed: true,
    }

    // Inicializa un comunicado vacío (para crear uno nuevo)
    initComunicado(): Comunicado {
        return {
            id: 0,
            titulo: '',
            texto: '',
            estado: '',
            tipo: '',
            publicado: '',
            prioridad: '',
            caduca: '',
            grupo: [],
            curso: null,
            seccion: null,
            grado: null,
            collapsed: true,
        }
    }

    abrirDialogBuscarDestinatario() {
        this.visibleDialog = true
    }

    cargarDestinatarios() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'miembros',
            ruta: 'obtener_miembros',
            data: {
                opcion: this.tipoPersona,
                iIieeId: this.iIieeId,
                iYAcadId: this.iYAcadId,
                iSedeId: this.Isede,
                iPersId: this.iPersId,
            },
        }
        console.table(params)
        this.getInformation(params, 'obtenerMiembros')
    }

    seleccionarDestinatario(event: any) {
        const miembro = event.item
        this.destinatarioNombre = miembro.completos || ''

        this.destinatarioId = miembro.id
        this.visibleDialog = false
    }

    // Cuando hacemos clic en "Editar"
    editComunicado(com: Comunicado) {
        this.selectedComunicado = {
            ...com,
            grupo: com.grupo.map((g: any) => g.iGrupoId.toString()),
            // estado: com.estado === 'Activo' ? 1 : 0, // Convierte el string a número
            prioridad:
                this.prioridades.find((p: any) => p.label === com.prioridad)
                    ?.value || com.prioridad,
            tipo:
                this.tipos.find((t: any) => t.label === com.tipo)?.value ||
                com.tipo,
            // Si se dispone de valores para curso, seccion y grado, se asignan
            curso: com.curso,
            seccion: com.seccion,
            grado: com.grado,
        }
        this.selectedEstado = com.estado === 'Activo' ? 1 : 0
    }
    // Al hacer clic en "Publicar" o "Actualizar"
    guardarComunicado() {
        // objeto con el cual evaluamos si se actualiza o se ingresa un nuevo registro
        let dataObj: any = {
            iPersId: this.iPersId,
            iTipoComId: this.selectedComunicado.tipo, // Tipo de comunicado
            iPrioridadId: this.selectedComunicado.prioridad, // Prioridad
            cComunicadoTitulo: this.selectedComunicado.titulo, // Título
            cComunicadoDescripcion: this.selectedComunicado.texto, // Descripción
            dtComunicadoEmision: this.selectedComunicado.publicado || null, // Fecha de emisión
            dtComunicadoHasta: this.selectedComunicado.caduca || null, // Fecha de caducidad
            iEstado: this.selectedEstado, // Estado (1 o 0)
            iYAcadId: this.iYAcadId,
            listaGrupos: this.selectedComunicado.grupo,

            curso: this.selectedComunicado.curso,
            seccion: this.selectedComunicado.seccion,
            grado: this.selectedComunicado.grado,

            iDestinatarioId: this.destinatarioId,
            iTipoPersona: this.tipoPersona,
        }

        // Si el comunicado ya existe, se añade el id para la actualización
        let ruta = 'registrar_comunicado'
        if (this.selectedComunicado.id !== 0) {
            ruta = 'actualizar_comunicado'
            dataObj = { ...dataObj, iComunicadoId: this.selectedComunicado.id }
        }

        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: ruta,
            data: dataObj,
        }

        console.table(params)
        this.getInformation(params, ruta)
        this.cargarComunicadosUsuario()
    }
    togglePanel(event: Event, panel: any, comunicado: Comunicado) {
        // Alterna el estado local para cambiar el icono
        comunicado.collapsed = !comunicado.collapsed
        // Dispara la animación interna de PrimeNG con el evento correcto
        panel.toggle(event)
    }
    deleteComunicado(id: number) {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'eliminar',
            data: { iComunicadoId: id },
        }
        this.getInformation(params, 'eliminar')
    }

    formatDate(date: Date): string {
        if (!date) return '' // Manejo de valores nulos
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Los meses van de 0 a 11
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    getInformation(params, accion) {
        this.GeneralService.getGralPrefix(params).subscribe({
            next: (response: any) => {
                this.accionBtnItem({ accion, item: response?.data })
            },
            complete: () => {},
        })
    }

    accionBtnItem(event): void {
        const { accion, item } = event

        switch (accion) {
            case 'obtenerDatos':
                this.prioridades = item.tipo_prioridad.map((p: any) => ({
                    label: p.cPrioridadNombre,
                    value: p.iPrioridadId, // Convertimos a número
                }))

                this.tipos = item.tipo_comunicado.map((t: any) => ({
                    label: t.cTipoComNombre,
                    value: t.iTipoComId,
                }))
                this.grupos = item.grupos.map((g: any) => ({
                    label: g.cGrupoNombre,
                    value: g.iGrupoId,
                }))
                //  curso, seccion y grado
                this.cursos = item.cursos.map((c: any) => ({
                    label: c.cCursoNombre,
                    value: c.iCursoId,
                }))
                this.secciones = item.secciones.map((s: any) => ({
                    label: s.cSeccionNombre,
                    value: s.iSeccionId,
                }))
                this.grados = item.grados.map((g: any) => ({
                    label: g.cGradoNombre,
                    value: g.iGradoId,
                }))
                break
            case 'obtenerComunicadosPersona':
                // item es el array devuelto por el SP
                this.comunicados = item.map((c: any) => {
                    return {
                        id: c.iComunicadoId,
                        titulo: c.cComunicadoTitulo,
                        texto: c.cComunicadoDescripcion,
                        // Si iEstado es 1 => 'Activo', 0 => 'Inactivo' (ajusta según tu lógica)
                        estado:
                            Number(c.bComunicadoArchivado) === 1
                                ? 'Activo'
                                : 'Inactivo',
                        // Nombres leídos del SP
                        tipo: c.cTipoComNombre,
                        prioridad: c.cPrioridadNombre,
                        // Formatear fechas si quieres mostrar dd/mm/aaaa
                        publicado: c.dtComunicadoEmision
                            ? this.formatDate(new Date(c.dtComunicadoEmision))
                            : '',
                        caduca: c.dtComunicadoHasta
                            ? this.formatDate(new Date(c.dtComunicadoHasta))
                            : '',
                        // Convertir la lista de grupos (STRING_AGG) a un array
                        grupo:
                            c.iGrupoIds && c.cGrupos
                                ? (() => {
                                      // Separamos los arreglos de IDs y nombres
                                      const ids = c.iGrupoIds.split(',')
                                      const names = c.cGrupos.split(',')

                                      // Mapeamos
                                      return ids.map(
                                          (id: string, index: number) => ({
                                              iGrupoId: parseInt(id.trim(), 10),
                                              cGrupoNombre: names[index].trim(),
                                          })
                                      )
                                  })()
                                : [],
                        collapsed: true,
                    }
                })
                break
            case 'obtenerMiembros':
                // Para el diálogo de destinatario
                this.destinatarios = JSON.parse(item[0]['miembroGrupo'])
                // console.table(item)
                // this.data = []
                // const json_datos = item
                // this.data = JSON.parse(json_datos[0]['miembroGrupo'])
                // this.filtrarGrupo()
                // this.destinatarios = item;
                break
            case 'eliminar':
                // Tras la eliminación refrescamos la lista
                this.cargarComunicadosUsuario()
                // aqui toast de éxito
                break
        }
    }
    filtrarGrupo() {
        const capturarId = this.miembros.map((item) => item.id)
        const buscarMiembros = new Set(capturarId)
        this.data = this.data.filter((items) => !buscarMiembros.has(items.id))
    }
    cargarComunicadosUsuario() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_comunicados_persona',
            data: {
                iPersId: this.iPersId,
            },
        }
        this.getInformation(params, 'obtenerComunicadosPersona')
    }
    limpiarFormulario(): void {
        // Reinicia el comunicado
        this.selectedComunicado = this.initComunicado()
        this.selectedEstado = null
    }
}
