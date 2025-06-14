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

import { FichaService } from '@/app/servicios/fichaService'
import { RouterModule } from '@angular/router'
import { DatosFichaBienestarService } from '../services/datos-ficha-bienestar.service'

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
    selector: 'app-gestion-fichas-apoderado',
    standalone: true,
    imports: [
        TablePrimengComponent,
        ReactiveFormsModule,
        ButtonModule,
        PanelModule,
        InputTextModule,
        InputGroupModule,
        PrimengModule,
        RouterModule,
    ],
    templateUrl: './gestion-fichas-apoderado.component.html',
    styleUrl: './gestion-fichas-apoderado.component.scss',
})
export class GestionFichasApoderadoComponent implements OnInit {
    estudiantes: Estudiante[] = []
    searchForm: FormGroup
    //captar el valor iSedeId:
    iIieeId: number
    iPersApodrId: number
    iStdId: number
    //iYAcadId: number;
    public datos: any[] = []
    public iYAcadId: number = 0 // Variable para almacenar el año

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
        // {
        //     labelTooltip: 'Deshacer',
        //     icon: 'pi pi-undo',
        //     accion: 'deshacer',
        //     type: 'item',
        //     class: 'p-button-rounded p-button-danger p-button-text',
        // },
    ]

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private estudiantesService: EstudiantesService,
        private constantesService: ConstantesService,
        private datosFichaBienestar: DatosFichaBienestarService,
        private store: LocalStoreService,
        private fichaService: FichaService
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
            this.iPersApodrId = perfil.iPersId
            console.log('Id_Apoderado:', this.iPersApodrId)
            this.iPersApodrId = perfil.iPersId
            console.log('Id_Apoderado:', this.iPersApodrId)
            this.iIieeId = perfil.iIieeId
            console.log('Id_Institucion Educativa:', this.iIieeId)
            console.log('Id_Institucion Educativa:', this.iIieeId)
        }
    }

    ngOnInit(): void {
        this.iYAcadId = this.getYear() // Asignar el valor al cargar el componente
        this.obtenerEstudiantesPorAnio(
            this.iPersApodrId,
            this.iIieeId,
            this.iYAcadId
        )
        this.obtenerEstudiantesPorAnio(
            this.iPersApodrId,
            this.iIieeId,
            this.iYAcadId
        )
    }

    private getYear(): number {
        const storedYear = localStorage.getItem('dremoYear')
        const year = storedYear ? JSON.parse(storedYear) : 'No hay año'
        console.log('Año obtenido:', year) // Mostrar en consola
        console.log('Año obtenido:', year) // Mostrar en consola
        return year
    }
    //Consumo del servicio: estudiantes.servcices.ts
    obtenerEstudiantesPorAnio(
        iPerApodr: number,
        iIieeId: number,
        anio: number
    ): void {
        console.log(iPerApodr, iIieeId, anio, 'Datos Obtenidos para filtro:')
        //llamado de Servicio estudiante.service.ts
        this.datosFichaBienestar
            .getEstudiantesPorAnio(iPerApodr, iIieeId, anio)
            .subscribe({
                next: (data: any) => {
                    console.log('Datos recibidos del backend:', data)
                    // Transformar los datos en la estructura esperada por la tabla
                    this.estudiantes = data.map(
                        (estudiante: any, index: number) => ({
                            index: index + 1,
                            id: estudiante.iPersId, // Asigna el ID real del estudiante
                            apellidos: `${estudiante.cEstPaterno} ${estudiante.cEstMaterno}`, // Combina apellidos
                            nombres: estudiante.cEstNombres,
                            grado: estudiante.cGradoNombre,
                            seccion: estudiante.cSeccionNombre,
                            dni: estudiante.cPersDocumento,
                            //    fecha: estudiante.dtFichaDG,
                            fecha: new Date(
                                estudiante.dtFichaDG
                            ).toLocaleDateString('es-PE', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            }),
                        })
                    )
                    console.log(
                        'Datos transformados para la tabla:',
                        this.estudiantes
                    )
                },
                error: (error) => {
                    console.error('Error al obtener estudiantes:', error)
                },
                complete: () => {
                    console.log('Consulta de estudiantes completada')
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
            this.obtenerEstudiantesPorAnio(
                this.iPersApodrId,
                this.iIieeId,
                this.iYAcadId
            )
            this.obtenerEstudiantesPorAnio(
                this.iPersApodrId,
                this.iIieeId,
                this.iYAcadId
            )
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

    descargarFicha(id: number, anio: number): void {
        this.fichaService.downloadFicha(id, anio).subscribe({
            next: (response) => {
                // const url = window.URL.createObjectURL(blob)
                // window.open(url, '_blank')
                const blob = new Blob([response], {
                    type: 'application/pdf',
                })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.target = '_blank'
                link.click()
                // window.URL.revokeObjectURL(url)
            },
            error: (err) => {
                console.error('Error al descargar el PDF:', err)
                alert('No se pudo generar el PDF')
            },
        })
    }

    accionBnt(event: { accion: string }): void {
        switch (event.accion) {
            case 'imprimir':
                console.log('Imprimir seleccionado')
                this.descargarFicha(474, 2025)
                break
            case 'editar':
                // console.log('Editar seleccionado')
                this.router.navigate(['/ficha/general'])
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
