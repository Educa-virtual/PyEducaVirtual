import { Component, OnInit } from '@angular/core'
import { ChangeDetectorRef } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { PrimengModule } from '@/app/primeng.module'
import { IColumn } from '@/app/shared/table-primeng/table-primeng.component'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'

import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
    selector: 'app-gestion-vacantes',
    standalone: true,
    imports: [
        ContainerPageComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
        // TablePrimengComponent,
    ],
    templateUrl: './gestion-vacantes.component.html',
    styleUrls: ['./gestion-vacantes.component.scss'],
})
export class GestionVacantesComponent implements OnInit {
    private backendApi: string = environment.backendApi
    form: FormGroup
    showModal: boolean = false
    anio_actual: number = new Date().getFullYear()
    guardar_vacantes: any[] = []
    nivel_grado: any[] = [
        { iNivel_grado: 1, cNivel_grado: 'PRIMERO' },
        { iNivel_grado: 2, cNivel_grado: 'SEGUNDO' },
        { iNivel_grado: 3, cNivel_grado: 'TERCERO' },
        { iNivel_grado: 4, cNivel_grado: 'CUARTO' },
        { iNivel_grado: 5, cNivel_grado: 'QUINTO' },
    ]

    // Nivel_: string = 'SECUNDARIA'
    useFilteredData: boolean = false
    filteredData: any[] = []

    accionesPrincipal: IActionContainer[] = [
        {
            labelTooltip: 'Guardar Vacantes',
            text: 'Guardar vacantes',
            icon: 'pi pi-save',
            accion: 'guardar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Imprimir Vacantes',
            text: 'Imprimir vacantes',
            icon: 'pi pi-print',
            accion: 'imprimir',
            class: 'p-button-danger',
        },
    ]

    //----------------------------------------
    columns: IColumn[] = [
        {
            type: 'item',
            width: '5rem',
            field: 'item',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'iNivel_grado',
            header: 'Grado',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cVacantesRegular',
            header: 'No Vacantes Regulares',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cVacanteNEE',
            header: 'No Vacantes estudiantes NEE',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'action',
            width: '5rem',
            field: 'acciones',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    //onDropdownChange: any;
    //vacante: any;

    constructor(
        private snackBar: MatSnackBar,
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private http: HttpClient // Inyectar HttpClient,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            cGrado: [0, Validators.required],
            cVacantesRegular: [0, Validators.required],
            cVacanteNEE: [0, Validators.required],
        })
    }

    //----Guardar registro el GRID--------------------------
    onSubmit() {
        const valoresFormulario = this.form.value
        const nuevoRegistro = {
            iNivel_grado: Number(valoresFormulario.cGrado),
            cVacantesRegular: Number(valoresFormulario.cVacantesRegular),
            cVacanteNEE: Number(valoresFormulario.cVacanteNEE),
        }

        // Validacion si el grado ya existe en el array
        const gradoExistente = this.guardar_vacantes.some(
            (registro) => registro.iNivel_grado === nuevoRegistro.iNivel_grado
        )

        if (!gradoExistente) {
            this.guardar_vacantes.push(nuevoRegistro)
            setTimeout(() => {
                this.guardar_vacantes = [...this.guardar_vacantes]
            }, 0)

            // **LIMPIAR FORMULARIO Y DROPDOWN**
            this.form.reset({
                cGrado: null, // Limpiar el dropdown
                cVacantesRegular: 0, // Reiniciar valor numérico
                cVacanteNEE: 0, // Reiniciar valor numérico
            })
        } else {
            console.warn('El grado ya existe en la lista.')
        }
    }

    selectRow(event: any) {
        // Implementa la lógica para manejar la selección de una fila
        console.log('Fila seleccionada:', event)
    }
    onSearch(event: any) {
        const searchText = event.target.value.toLowerCase()
        this.filteredData = this.guardar_vacantes.filter((item) =>
            item.iNivel_grado.toString().toLowerCase().includes(searchText)
        )
    }

    // Método para enviar los datos al backend
    enviarVacantes() {
        if (this.guardar_vacantes.length === 0) {
            // Mostrar mensaje de advertencia al usuario
            this.snackBar.open('No hay vacantes para enviar.', 'Cerrar', {
                duration: 3000,
                panelClass: ['warning-snackbar'],
            })
            return
        }

        const url = `${this.backendApi}/acad/vacantes/guardar`

        this.http.post(url, { vacantes: this.guardar_vacantes }).subscribe({
            error: () => {
                // Mostrar mensaje de error al usuario
                this.snackBar.open('Error al guardar las vacantes', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['error-snackbar'],
                })
            },
            complete: () => {
                // Mostrar mensaje de finalización al usuario
                this.snackBar.open(
                    'Vacantes guardadas correctamente',
                    'Cerrar',
                    {
                        duration: 3000,
                        panelClass: ['info-snackbar'],
                    }
                )
            },
        })
    }

    //----------------------------------------------
    accionBtnItem(elemento: IActionContainer): void {
        switch (elemento.accion) {
            case 'guardar':
                this.enviarVacantes()
                break
            case 'imprimir':
                this.imprimirVacantes()
                break
            case 'Cerrar':
                this.showModal = true
                break
            default:
                break
        }
    }
    //----------------------------------------------------

    // Función para convertir el número del grado en texto
    obtenerNombreGrado(numeroGrado: number): string {
        switch (numeroGrado) {
            case 1:
                return 'PRIMERO'
            case 2:
                return 'SEGUNDO'
            case 3:
                return 'TERCERO'
            case 4:
                return 'CUARTO'
            case 5:
                return 'QUINTO'
            case 6:
                return 'SEXTO'
            default:
                return 'DESCONOCIDO'
        }
    }

    // Método para eliminar una vacante--------
    eliminarVacante(index: number) {
        if (index >= 0 && index < this.guardar_vacantes.length) {
            this.guardar_vacantes.splice(index, 1)

            // Actualizar la grilla
            this.guardar_vacantes = [...this.guardar_vacantes]

            // Mostrar mensaje de confirmación
            this.snackBar.open('✅ La vacante fue eliminada.', 'Cerrar', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'center',
            })
        }
    }

    //----------------------------------
    imprimirVacantes() {
        const printContent = this.generatePrintContent()
        const printWindow = window.open('', '_blank', 'width=800,height=600') // Definir tamaño de la ventana

        printWindow.document.write(`
        <html>
        <head>
        <title>Vacantes Registradas</title>
        <style>
            @page {
                size: A4 portrait; /* Formato A4 en orientación vertical */
                margin: 2cm; /* Márgenes adecuados para impresión */
            }
            body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                width: 21cm;
                height: 29.7cm;
                margin: 0 auto;
                padding: 1cm;
            }
            h1 {
                text-align: center;
                margin-bottom: 20px;
                margin-top: 20px; /* Ajuste del margen superior sin el logo */
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }
            th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: center;
            }
            th {
                background-color: #f2f2f2;
            }
            .icon { 
                width: 70px; 
                height: 50px; 
                vertical-align: middle; 
                margin-right: 10px; 
            }
        </style>
        </head>
        <body>
            ${printContent}
        </body>
        </html>
        `)

        // Cerrar el documento y preparar la impresión
        printWindow.document.close()

        // Asegurar que la imagen se cargue antes de imprimir
        const img = printWindow.document.querySelector('img')
        if (img) {
            img.onload = () => {
                printWindow.print()
            }
            img.onerror = () => {
                console.error('Error: No se pudo cargar el logo.')
                printWindow.print() // Imprimir incluso si el logo no se carga
            }
        } else {
            printWindow.print() // Imprimir si no hay imagen
        }
    }

    generatePrintContent(): string {
        let content = `
        <div style="position: relative;">
            <img src="/assets/images/logo.png" alt="Logo" style="position: absolute; top: 0; left: 0; width: 100px; height: auto;">
            <h1 style="text-align: center; margin-top: 60px;">Registro de vacantes para el año ${this.anio_actual}</h1>
        </div>
        <table>
            <thead>
                <tr>
                    <th>Nro.</th> 
                    <th>Grado</th>
                    <th>Vacantes Regulares</th>
                    <th>Vacantes NEE</th>
                </tr>
            </thead>
            <tbody>
        `

        let contador = 1
        this.guardar_vacantes.forEach((vacante) => {
            content += `
                <tr>
                    <td>${contador}</td>
                    <td>${this.obtenerNombreGrado(vacante.iNivel_grado)}</td>                     
                    <td>${vacante.cVacantesRegular}</td>
                    <td>${vacante.cVacanteNEE}</td>
                </tr>
            `
            contador++
        })

        content += `
                </tbody>
            </table>
        `

        return content
    }
}
