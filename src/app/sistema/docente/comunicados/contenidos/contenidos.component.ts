import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { TabViewModule } from 'primeng/tabview'
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
}

@Component({
    selector: 'app-contenidos',
    standalone: true,
    imports: [PrimengModule, FormsModule, TabViewModule],
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

    constructor(private ConstantesService: ConstantesService) {
        this.grado = JSON.parse(this.ConstantesService.grados)
        this.iPersId = this.ConstantesService.iPersId
        this.iYAcadId = this.ConstantesService.iYAcadId
        this.Isede = this.ConstantesService.iSedeId
        this.iDocenteId = this.ConstantesService.iDocenteId
        this.iEstudianteId = this.ConstantesService.iEstudianteId
        this.iEspecialistaId = this.ConstantesService.iEspecialistaId
    }

    comunicados = []
    prioridades = []
    tipos = []
    grupos = []
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
            collapsed: true,
        }
    }

    // Cuando hacemos clic en "Editar"
    editComunicado(com: Comunicado) {
        this.selectedComunicado = {
            ...com,
            grupo: com.grupo.map((g: any) => g.iGrupoId.toString()),
            // estado: com.estado === 1 ? 'Activo' : 'Inactivo', // Convertir a string
            prioridad:
                this.prioridades.find((p: any) => p.label === com.prioridad)
                    ?.value || com.prioridad,
            tipo:
                this.tipos.find((t: any) => t.label === com.tipo)?.value ||
                com.tipo,
        }
    }
    // Al hacer clic en "Publicar" o "Actualizar"
    guardarComunicado() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'registrar_comunicado',
            data: {
                //    comunicados enviados al backend
                iPersId: this.iPersId, //iPersId,
                iTipoComId: this.selectedComunicado.tipo, // Tipo de comunicado
                iPrioridadId: this.selectedComunicado.prioridad, // Prioridad
                cComunicadoTitulo: this.selectedComunicado.titulo, // Título
                cComunicadoDescripcion: this.selectedComunicado.texto, // Descripción
                dtComunicadoEmision: this.selectedComunicado.publicado || null, // Fecha de emisión
                dtComunicadoHasta: this.selectedComunicado.caduca || null, // Fecha de caducidad
                iEstado: this.selectedComunicado.estado, //bComunicadoArchivado,
                iYAcadId: this.iYAcadId, //iYAcadId,
                listaGrupos: this.selectedComunicado.grupo,
            },
        }
        console.table(params)
        this.getInformation(params, 'registrar')
    }
    togglePanel(event: Event, panel: any, comunicado: Comunicado) {
        // Alterna el estado local para cambiar el icono
        comunicado.collapsed = !comunicado.collapsed
        // Dispara la animación interna de PrimeNG con el evento correcto
        panel.toggle(event)
    }
    deleteComunicado(id: number) {
        this.comunicados = this.comunicados.filter((com) => com.id !== id)
        console.log('Comunicado eliminado:', id)
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
                break
            case 'obtenerComunicadosPersona':
                // item es el array devuelto por el SP
                this.comunicados = item.map((c: any) => {
                    return {
                        id: c.iComunicadoId,
                        titulo: c.cComunicadoTitulo,
                        texto: c.cComunicadoDescripcion,
                        // Si iEstado es 1 => 'Activo', 0 => 'Inactivo' (ajusta según tu lógica)
                        estado: c.iEstado === 1 ? 'Activo' : 'Inactivo',
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
            // Agrega más casos
        }
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
}
