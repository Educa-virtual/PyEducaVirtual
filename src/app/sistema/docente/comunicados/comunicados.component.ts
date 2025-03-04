import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { FormsModule } from '@angular/forms'
import { GeneralService } from '@/app/servicios/general.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
interface Comunicado {
    id: number
    titulo: string
    texto: string
    estado: string
    tipo: string
    publicado: string
    prioridad: string
    caduca: string
    grupo: string
    collapsed: boolean
}

@Component({
    selector: 'app-comunicados',
    standalone: true,
    imports: [PrimengModule, FormsModule],
    templateUrl: './comunicados.component.html',
    styleUrls: ['./comunicados.component.scss'],
})
export class ComunicadosComponent implements OnInit {
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

    comunicados = [
        {
            id: 1,
            titulo: 'Matriculas 2025',
            estado: 'Activo',
            tipo: 'Anuncio',
            publicado: '12/02/2025',
            prioridad: 'Urgente',
            caduca: '12/03/2025',
            grupo: 'Apoderados,Estudiantes',
            texto: 'Estimados padres de familia y estudiantes las matriculas son hasta....',
            collapsed: true,
        },
        {
            id: 2,
            titulo: 'Publicacion de Nuevos Ponderados',
            estado: 'Activo',
            tipo: 'Circular',
            publicado: '10/02/2025',
            prioridad: 'Normal',
            caduca: '10/03/2025',
            grupo: 'Docentes,Estudiantes',
            texto: 'Se informa a la comunidad educativa que las notas ponderadas son...',
            collapsed: true,
        },
        {
            id: 3,
            titulo: 'Carga Lectiva',
            estado: 'Inactivo',
            tipo: 'Aviso',
            publicado: '01/02/2025',
            prioridad: 'Baja',
            caduca: '15/03/2025',
            grupo: 'Apoderados',
            texto: 'Se comunica a los docentes que el numero de horas lectiva son 40 por semana',
            collapsed: true,
        },
    ]
    estados = [
        { label: 'Activo', value: 1 },
        { label: 'Inactivo', value: 0 },
    ]

    prioridades = [
        // { label: 'Urgente', value: 'Urgente' },
        // { label: 'Normal', value: 'Normal' },
        // { label: 'Baja', value: 'Baja' },
    ]

    tipos = [
        // { label: 'Anuncio', value: 'Anuncio' },
        // { label: 'Aviso', value: 'Aviso' },
        // { label: 'Circular', value: 'Circular' },
    ]

    grupos = [
        // { label: 'Alumnos', value: 'Alumnos' },
        // { label: 'Docentes', value: 'Docentes' },
        // { label: 'Apoderados', value: 'Apoderados' },
    ]

    ngOnInit() {
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
    selectedComunicado: Comunicado = this.initComunicado()
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
            grupo: '',
            collapsed: true,
        }
    }

    // Cuando hacemos clic en "Editar"
    editComunicado(com: Comunicado) {
        // Creamos una copia del comunicado para no modificar el array original
        // si no deseas mutarlo directamente
        this.selectedComunicado = { ...com }
    }
    // Al hacer clic en "Publicar" o "Actualizar"
    guardarComunicado() {
        const params = {
            petition: 'post',
            group: 'com',
            prefix: 'comunicado',
            ruta: 'registrar_comunicado',
            data: {
                //    comunicados : this.comunicados -> reemplazar para guaardar datos en la DB
            },
        }
        this.getInformation(params, 'obtenerAcademicoGrado')
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
                    value: Number(p.iPrioridadId), // Convertimos a número
                }))

                this.tipos = item.tipo_comunicado.map((t: any) => ({
                    label: t.cTipoComNombre,
                    value: Number(t.iTipoComId),
                }))
                this.grupos = item.grupos.map((g: any) => ({
                    label: g.cGrupoNombre,
                    value: Number(g.iPersId),
                }))
                break

            // Agrega más casos
        }
    }
}
