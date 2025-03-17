import { Component, OnInit } from '@angular/core'
import { EstudiantesService } from '@/app/servicios/estudiantes.service'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { ButtonModule } from 'primeng/button'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import { InputGroupModule } from 'primeng/inputgroup'
import { PrimengModule } from '@/app/primeng.module'
import { Router } from '@angular/router'
import {
    TablePrimengComponent,
    IColumn,
    IActionTable,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
interface Estudiante {
    id: number
    apellidos: string
    nombres: string
    grado: string
    seccion: string
    dni: string
    fecha: string
}

@Component({
    selector: 'app-ficha-socioeconomica',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
    ],
    templateUrl: './ficha-socioeconomica.component.html',
    styleUrls: ['./ficha-socioeconomica.component.scss'],
})
export class FichaSocioeconomicaComponent implements OnInit {
    estudiantes: Estudiante[] = []
    searchForm: FormGroup
    //captar el valor iSedeId:
    iIieeId: number
    public datos: any[] = []

    public columnasTabla: IColumn[] = [
        {
            field: 'index',
            header: 'N°',
            type: 'text',
            width: '80px',
            text_header: 'N°',
            text: 'N°',
        },
        {
            field: 'apellidos',
            header: 'Apellidos',
            type: 'text',
            width: '200px',
            text_header: 'Apellidos',
            text: 'Apellidos',
        },
        {
            field: 'nombres',
            header: 'Nombres',
            type: 'text',
            width: '200px',
            text_header: 'Nombres',
            text: 'Nombres',
        },
        {
            field: 'grado',
            header: 'Grado',
            type: 'text',
            width: '150px',
            text_header: 'Grado',
            text: 'Grado',
        },
        {
            field: 'seccion',
            header: 'Sección',
            type: 'text',
            width: '150px',
            text_header: 'Sección',
            text: 'Sección',
        },
        {
            field: 'dni',
            header: 'DNI',
            type: 'text',
            width: '150px',
            text_header: 'DNI',
            text: 'DNI',
        },
        {
            field: 'fecha',
            header: 'Fecha',
            type: 'text',
            width: '180px',
            text_header: 'Fecha',
            text: 'Fecha',
        },
        {
            type: 'actions',
            width: '10rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    public accionesTabla: IActionTable[] = [
        {
            labelTooltip: 'Imprimir',
            icon: 'pi pi-print',
            accion: 'imprimir',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-file-edit',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
        {
            labelTooltip: 'Deshacer',
            icon: 'pi pi-undo',
            accion: 'deshacer',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private estudiantesService: EstudiantesService,
        private constantesService: ConstantesService,
        private store: LocalStoreService
    ) {
        this.searchForm = this.fb.group({
            nombre: [''],
            apellidos: [''],
            dni: [''],
        })

        {
            //aqui se llama el objeto que trae los datos del perfil
            const perfil = this.store.getItem('dremoPerfil')
            console.log(perfil, 'perfil dremo', this.store)
            this.iIieeId = perfil.iIieeId
        }
    }

    ngOnInit(): void {
        this.cargarEstudiantes(this.iIieeId) //
    }

    cargarEstudiantes(iIieeId: number) {
        this.estudiantesService.getEstudiantes(iIieeId).subscribe({
            next: (data) => {
                this.estudiantes = data.map((est, index) => ({
                    index: index + 1, // Se calcula el índice aquí
                    id: est.iPersId,
                    apellidos: `${est.cEstPaterno} ${est.cEstMaterno}`,
                    nombres: est.cEstNombres,
                    grado: est.cGradoAbreviacion,
                    seccion: est.cSeccionNombre,
                    dni: est.cPersDocumento,
                    fecha: est.dtFichaDG,
                }))
            },
            error: (error) => {
                console.error('Error al obtener los estudiantes', error)
            },
        })
    }

    //---Filtrado de estudiantes--------------
    filtrarEstudiantes() {
        const apellidosYNombres =
            this.searchForm.get('nombre')?.value?.trim().toLowerCase() || ''
        const dni =
            this.searchForm.get('dni')?.value?.trim().toLowerCase() || ''

        if (!apellidosYNombres && !dni) {
            // Si no hay búsqueda, se muestran todos los estudiantes nuevamente
            this.cargarEstudiantes(this.iIieeId)
            return
        }

        this.estudiantes = this.estudiantes.filter((estudiante) => {
            // Limpieza de espacios extra en los datos
            const apellidos = estudiante.apellidos
                .trim()
                .replace(/\s+/g, ' ')
                .toLowerCase()
            const nombres = estudiante.nombres
                .trim()
                .replace(/\s+/g, ' ')
                .toLowerCase()
            const dniEstudiante = estudiante.dni.trim().toLowerCase()

            // Convertir la búsqueda en un array de palabras clave (para buscar palabras separadas)
            const keywords = apellidosYNombres
                .split(' ')
                .filter((k) => k.length > 0)

            // Verificar si alguna palabra clave está en los apellidos o nombres
            const coincideNombreApellido = keywords.every(
                (kw) => apellidos.includes(kw) || nombres.includes(kw)
            )

            return (
                (apellidosYNombres && coincideNombreApellido) ||
                (dni && dniEstudiante.includes(dni))
            )
        })
    }

    nuevoIngreso(): void {
        this.router.navigate(['/bienestar/ficha/general'])
    }

    accionBnt(event: { accion: string }): void {
        switch (event.accion) {
            case 'imprimir':
                console.log('Imprimir seleccionado')
                break
            case 'editar':
                console.log('Editar seleccionado')
                break
            case 'eliminar':
                console.log('Eliminar seleccionado')
                break
            case 'deshacer':
                console.log('Deshacer seleccionado')
                break
            default:
                console.warn('Acción no reconocida:', event.accion)
        }
    }
}
