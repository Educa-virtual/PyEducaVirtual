import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { TabViewModule } from 'primeng/tabview'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { MessageService } from 'primeng/api'
import { EditorComponent } from '@tinymce/tinymce-angular'
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
    destinatario?: string
    curso?: number
    seccion?: number
    grado?: number
}

@Component({
    selector: 'app-contenidos',
    standalone: true,
    imports: [
        PrimengModule,
        FormsModule,
        TabViewModule,
        EditorComponent,
        TablePrimengComponent,
    ],
    templateUrl: './contenidos.component.html',
    styleUrls: ['./contenidos.component.scss'],
    providers: [MessageService],
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
    iPerfilId: any
    data = []
    miembros = []
    advancedOptions: boolean = false // Controla el switch

    destinatarioNombre: string = ''
    destinatarioId: number | null = null
    visibleDialog: boolean = false
    tiposPersona: any[] = [
        { grupo: 'Estudiantes', codigo: 1 },
        { grupo: 'Docentes', codigo: 2 },
    ]

    // Propiedades para el dialog de Instituciones y Docentes
    instituciones: any[] = []
    docentes: any[] = []

    columnaInstituciones = [
        {
            type: 'actions',
            width: '2rem',
            field: 'iIieeId',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: 'auto',
            field: 'cIieeNombre',
            header: 'Institución Educativa',
            text_header: 'left',
            text: 'left',
        },
    ]

    accionInstitucion = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-user-plus',
            accion: 'seleccionarInstitucion',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    columnaDocentes = [
        {
            type: 'actions',
            width: '2rem',
            field: 'iDocenteId',
            header: '#',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: 'auto',
            field: 'cDocenteNombres',
            header: 'Nombres',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: 'auto',
            field: 'cDocentePaterno',
            header: 'Apellido Paterno',
            text_header: 'left',
            text: 'left',
        },
        {
            type: 'text',
            width: 'auto',
            field: 'cDocenteMaterno',
            header: 'Apellido Materno',
            text_header: 'left',
            text: 'left',
        },
    ]

    accionDocente = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-check',
            accion: 'seleccionarDocente',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    // Variables de control para la visibilidad de los dialogs
    visibleInstitucionDialog: boolean = false
    visibleDocenteDialog: boolean = false

    // Variables para almacenar las selecciones
    institucionNombre: string = ''
    institucionId: number | null = null
    docenteNombre: string = ''
    docenteId: number | null = null

    tipoPersona: any
    destinatarios: any[] = []

    columnaModal = [
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
        {
            type: 'text',
            width: '1rem',
            field: 'contacto',
            header: 'Numero Telf. del Contacto',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '1rem',
            field: 'domicilio',
            header: 'Direccion Domiciliaria',
            text_header: 'center',
            text: 'center',
        },
    ]

    accionModal = [
        {
            labelTooltip: 'Seleccionar',
            icon: 'pi pi-user-plus',
            accion: 'seleccionarDestinatario',
            type: 'item',
            class: 'p-button-rounded p-button-success p-button-text',
        },
    ]

    constructor(
        private messageService: MessageService,
        private ConstantesService: ConstantesService
    ) {
        this.grado = JSON.parse(this.ConstantesService.grados)
        this.iPersId = this.ConstantesService.iPersId
        this.iYAcadId = this.ConstantesService.iYAcadId
        this.Isede = this.ConstantesService.iSedeId
        this.iDocenteId = this.ConstantesService.iDocenteId
        this.iEstudianteId = this.ConstantesService.iEstudianteId
        this.iEspecialistaId = this.ConstantesService.iEspecialistaId
        this.iIieeId = this.ConstantesService.iIieeId
        this.iPerfilId = this.ConstantesService.iPerfilId
    }

    mensajes: EditorComponent['init'] = {
        base_url: '/tinymce', // Root for resources
        suffix: '.min', // Suffix to use when loading resources
        menubar: false,
        selector: 'textarea',
        // setup: (editor) => {
        //     editor.on('blur', (e) =>
        //         this.actualizar(e, 'cSilaboDescripcionCurso')
        //     )
        // },
        placeholder: 'Escribe aqui...',
        height: 250,
        plugins: 'lists image table',
        toolbar: 'bold italic underline strikethrough',
        editable_root: true,
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
        this.selectedComunicado = this.initComunicado()
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
                iPerfilId: this.iPerfilId,
                iSedeId: this.Isede,
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
        tipo: null,
        publicado: '',
        prioridad: null,
        caduca: '',
        grupo: [], // array vacío

        curso: null,
        seccion: null,
        grado: null,

        collapsed: true,
    }

    // Inicializa un comunicado vacío (para crear uno nuevo)
    initComunicado(): Comunicado {
        const hoy = new Date()
        const manana = new Date(hoy)
        manana.setDate(hoy.getDate() + 1)

        return {
            id: 0,
            titulo: '',
            texto: '',
            estado: '',
            tipo: null,
            publicado: this.formatDate(hoy),
            prioridad: null,
            caduca: this.formatDate(manana),
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

    // "Editar"
    editComunicado(com: Comunicado) {
        this.selectedComunicado = {
            ...com,
            grupo: com.grupo.map((g: any) => g.iGrupoId.toString()),
            // estado: com.estado === 'Activo' ? 1 : 0,
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
        this.destinatarioNombre = com.destinatario || ''

        if (com.destinatario || com.curso || com.seccion || com.grado) {
            this.advancedOptions = true
        } else {
            this.advancedOptions = false
        }
    }
    // Al hacer clic en "Publicar" o "Actualizar"
    guardarComunicado() {
        // 1) Validar Título, Prioridad, Tipo
        if (!this.selectedComunicado.titulo?.trim()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un Título',
            })
            return
        }
        if (!this.selectedComunicado.prioridad) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar Prioridad',
            })
            return
        }
        if (!this.selectedComunicado.tipo) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar Tipo',
            })
            return
        }
        // Validar que se ingresen ambas fechas
        if (
            !this.selectedComunicado.publicado ||
            !this.selectedComunicado.caduca
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar la fecha de Inicio y Fin.',
            })
            return
        }
        // Validar Fechas inicio no puede ser menor a final y viceversa
        const hoy = new Date() // hoy
        hoy.setHours(0, 0, 0, 0) // quitar hora
        const inicio = this.parseFecha(this.selectedComunicado.publicado)
        const fin = this.parseFecha(this.selectedComunicado.caduca)

        if (inicio && inicio < hoy) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Fechas inválidas',
                detail: 'La fecha de Inicio no puede ser anterior a hoy.',
            })
            return
        }
        if (inicio && fin && fin < inicio) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Fechas inválidas',
                detail: 'La fecha de Fin no puede ser menor a la fecha de Inicio.',
            })
            return
        }
        if (this.advancedOptions && !this.destinatarioId) {
            const { curso, seccion, grado } = this.selectedComunicado
            const algunoSeleccionado = curso || seccion || grado
            if (algunoSeleccionado && !(curso && seccion && grado)) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Si selecciona Curso, Sección o Grado, debe ingresar los tres campos.',
                })
                return
            }
        }
        // Validar que se haya ingresado contenido
        if (
            !this.selectedComunicado.texto ||
            !this.selectedComunicado.texto.trim()
        ) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'El contenido del comunicado no puede estar vacío.',
            })
            return
        }
        this.aplicarLogicaEnvio()
        // objeto con el cual evaluamos si se actualiza o se ingresa un nuevo registro
        let dataObj: any = {
            iPersId: this.iPersId,
            iTipoComId: this.selectedComunicado.tipo, // Tipo de comunicado
            iPrioridadId: this.selectedComunicado.prioridad, // Prioridad
            cComunicadoTitulo: this.selectedComunicado.titulo, // Título
            cComunicadoDescripcion: this.selectedComunicado.texto, // Descripción
            dtComunicadoEmision: this.selectedComunicado.publicado || null, // Fecha de emisión
            dtComunicadoHasta: this.selectedComunicado.caduca || null, // Fecha de caducidad
            iEstado: 1,
            iSemAcadId: this.iSemAcadId,
            iYAcadId: this.iYAcadId,
            listaGrupos: this.selectedComunicado.grupo,
            iSedeId: this.Isede,
            curso: this.selectedComunicado.curso,
            seccion: this.selectedComunicado.seccion,
            grado: this.selectedComunicado.grado,

            iDestinatarioId: this.destinatarioId,
            InstitucionId: this.institucionId,
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

        this.getInformation(params, ruta)
        this.cargarComunicadosUsuario()
    }
    togglePanel(event: Event, panel: any, comunicado: Comunicado) {
        comunicado.collapsed = !comunicado.collapsed
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
                this.prioridades = [
                    { label: 'Seleccione Prioridad', value: null },
                    ...item.tipo_prioridad.map((p: any) => ({
                        label: p.cPrioridadNombre,
                        value: p.iPrioridadId,
                    })),
                ]
                this.tipos = [
                    { label: 'Seleccione Tipo', value: null },
                    ...item.tipo_comunicado.map((t: any) => ({
                        label: t.cTipoComNombre,
                        value: t.iTipoComId,
                    })),
                ]
                this.grupos = item.grupos.map((g: any) => ({
                    label: g.cGrupoNombre,
                    value: g.iGrupoId,
                }))
                //  curso, seccion y grado
                this.cursos = [
                    { label: 'Curso', value: null },
                    ...item.cursos.map((c: any) => ({
                        label: c.cCursoNombre,
                        value: c.iCursoId,
                    })),
                ]
                this.secciones = [
                    { label: 'Seccion', value: null },
                    ...item.secciones.map((s: any) => ({
                        label: s.cSeccionNombre,
                        value: s.iSeccionId,
                    })),
                ]
                this.grados = [
                    { label: 'Grado', value: null },
                    ...item.grados.map((g: any) => ({
                        label: g.cGradoNombre,
                        value: g.iGradoId,
                    })),
                ]
                this.iSemAcadId = item.semestre_acad_id

                // Si el perfil es docente, filtrar para dejar solo la opción ACADEMICO (id=2)
                if (Number(this.iPerfilId) === 7) {
                    this.tipos = this.tipos.filter(
                        (t) => t.value === null || Number(t.value) === 2
                    )
                }
                break
            case 'obtenerComunicadosPersona':
                // item es el array devuelto por el SP
                this.comunicados = item.map((c: any) => {
                    const foundCurso = this.cursos.find(
                        (cs: any) => cs.value == c.iCursoId
                    )
                    const foundSeccion = this.secciones.find(
                        (ss: any) => ss.value == c.iSeccionId
                    )
                    const foundGrado = this.grados.find(
                        (gg: any) => gg.value == c.iGradoId
                    )

                    return {
                        id: c.iComunicadoId,
                        titulo: c.cComunicadoTitulo,
                        texto: c.cComunicadoDescripcion,
                        // Si iEstado es 1 => 'Activo', 0 => 'Inactivo'
                        estado:
                            Number(c.bComunicadoArchivado) === 1
                                ? 'Activo'
                                : 'Inactivo',
                        // Nombres
                        tipo: c.cTipoComNombre,
                        prioridad: c.cPrioridadNombre,
                        // Formato fechas  dd/mm/aaaa
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
                        // curso, sección y grado:
                        curso: c.iCursoId,
                        seccion: c.iSeccionId,
                        grado: c.iGradoId,
                        // nombre del destinatario
                        cursoName:
                            c.iCursoId !== null && foundCurso
                                ? foundCurso.label
                                : null,
                        seccionName:
                            c.iSeccionId !== null && foundSeccion
                                ? foundSeccion.label
                                : null,
                        gradoName:
                            c.iGradoId !== null && foundGrado
                                ? foundGrado.label
                                : null,
                        destinatario: c.NombreUsuario || '',
                        collapsed: true,
                    }
                })
                break
            case 'obtenerMiembros':
                // Para el p-diálog de destinatario
                this.destinatarios = JSON.parse(item[0]['miembroGrupo'])
                break
            case 'eliminar':
                // Tras la eliminación refrescamos la lista
                this.cargarComunicadosUsuario()
                // aqui toast de éxito
                break
            case 'obtenerInstituciones':
                this.instituciones = item
                break
            case 'obtenerDocentes':
                this.docentes = item
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
        this.destinatarioNombre = ''
        this.destinatarioId = null
        this.tipoPersona = null
        this.advancedOptions = false
        setTimeout(() => {
            this.destinatarioNombre = ''
        })
    }
    aplicarLogicaEnvio() {
        if (!this.advancedOptions) {
            // advanced OFF => se envía por grupos
            // Revisar si hay grupos
            if (
                !this.selectedComunicado.grupo ||
                this.selectedComunicado.grupo.length === 0
            ) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Debe seleccionar al menos un Grupo (o activar Opciones Avanzadas).',
                })
                throw new Error('validación')
            }
            // forzar null
            this.selectedComunicado.curso = null
            this.selectedComunicado.seccion = null
            this.selectedComunicado.grado = null
            this.destinatarioId = null
            return
        }

        // advanced ON
        // Caso 1: Destinatario
        if (this.destinatarioId) {
            // se envía a un usuario => forzar null en grupo y c/s/g
            this.selectedComunicado.grupo = []
            this.selectedComunicado.curso = null
            this.selectedComunicado.seccion = null
            this.selectedComunicado.grado = null
        } else {
            // Caso 2: c/s/g
            if (
                this.selectedComunicado.curso ||
                this.selectedComunicado.seccion ||
                this.selectedComunicado.grado
            ) {
                // se envía a un (curso,seccion,grado) => forzar null en grupo y destinatario
                this.selectedComunicado.grupo = []
                this.destinatarioId = null
            } else {
                // Caso 3: si no hay destinatario NI c/s/g => error
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'Debe seleccionar un Destinatario único o Curso/Sección/Grado.',
                })
                throw new Error('validación')
            }
        }
    }
    parseFecha(fechaStr: string): Date | null {
        if (!fechaStr) return null
        const [dd, mm, yyyy] = fechaStr.split('/')
        if (!dd || !mm || !yyyy) return null
        return new Date(+yyyy, +mm - 1, +dd)
    }
    clearDestinatario() {
        this.destinatarioNombre = ''
        this.destinatarioId = null
    }
    onAdvancedOptionsChange() {
        if (this.advancedOptions) {
            // Cuando se activa avanzado, el grupo se deshabilita, por lo que se resetea
            this.selectedComunicado.grupo = []
        } else {
            // Cuando se desactiva avanzado, se deshabilitan los campos de curso, sección y grado
            this.selectedComunicado.curso = null
            this.selectedComunicado.seccion = null
            this.selectedComunicado.grado = null
        }
    }
    onTipoChange(event: any) {
        // Supongamos que el valor "2" representa "Académico"
        if (Number(event.value) !== 2) {
            this.advancedOptions = false
            // Limpia los campos avanzados si fuera necesario:
            this.selectedComunicado.grupo = []
            this.selectedComunicado.curso = null
            this.selectedComunicado.seccion = null
            this.selectedComunicado.grado = null
        }
    }
    // Abre el modal para seleccionar Institución Educativa
    abrirDialogInstitucion() {
        this.visibleInstitucionDialog = true
        // Llama al SP para cargar las instituciones (ya implementado en cargarInstitucionesEspecialista)
        this.cargarInstitucionesEspecialista()
    }

    // Método para cargar las instituciones (llama al SP Sp_SEL_institucionesEspecialista)
    cargarInstitucionesEspecialista() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_institucionesEspecialista',
            data: {
                iPersId: this.iPersId, // Se utiliza el iPersId del especialista
            },
        }
        this.getInformation(params, 'obtenerInstituciones')
    }

    // Método para limpiar la selección de institución
    clearInstitucion() {
        this.institucionNombre = ''
        this.institucionId = null
        // Además, si se había seleccionado docente, limpiarlo también
        this.clearDocente()
    }

    // Abre el modal para seleccionar Docente en la institución seleccionada
    abrirDialogDocente() {
        if (!this.institucionId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe seleccionar una Institución Educativa primero',
            })
            return
        }
        // Configura y abre el modal para docentes
        this.visibleDocenteDialog = true
        // Llama al método para cargar docentes filtrados por la institución seleccionada
        this.cargarDocentesPorInstitucion()
    }

    // Método para limpiar la selección de docente
    clearDocente() {
        this.docenteNombre = ''
        this.destinatarioId = null
    }
    // Método para procesar la selección de un docente
    seleccionarDocente(event: any) {
        const docente = event.item
        this.docenteNombre =
            docente.cDocenteNombres +
            ' ' +
            docente.cDocentePaterno +
            ' ' +
            docente.cDocenteMaterno
        this.destinatarioId = docente.iPersId
        this.visibleDocenteDialog = false
    }
    // Método para cargar docentes según la institución seleccionada (a implementar)
    cargarDocentesPorInstitucion() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'obtener_docentes_por_institucion', // Debes crear o definir este endpoint en el backend
            data: { iIieeId: this.institucionId },
        }
        this.getInformation(params, 'obtenerDocentes')
    }
    seleccionarInstitucion(event: any) {
        const institucion = event.item
        this.institucionNombre = institucion.cIieeNombre
        this.institucionId = institucion.iIieeId
        this.visibleInstitucionDialog = false
    }
}
