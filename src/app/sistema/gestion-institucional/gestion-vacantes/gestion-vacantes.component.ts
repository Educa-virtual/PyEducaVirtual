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
import {
    TablePrimengComponent,
    IColumn,
} from '@/app/shared/table-primeng/table-primeng.component'
import {
    ContainerPageComponent,
    IActionContainer,
} from '@/app/shared/container-page/container-page.component'
//Linea 18 FEB-------------------------------------
import { HttpClient } from '@angular/common/http'
import { environment } from '@/environments/environment'
//-------------------------------------------------

@Component({
    selector: 'app-gestion-vacantes',
    standalone: true,
    imports: [
        ContainerPageComponent,
        ReactiveFormsModule,
        FormsModule,
        PrimengModule,
        TablePrimengComponent,
    ],
    templateUrl: './gestion-vacantes.component.html',
    styleUrls: ['./gestion-vacantes.component.scss'],
})
export class GestionVacantesComponent implements OnInit {
    private backendApi: string = environment.backendApi
    form: FormGroup
    showModal: boolean = false
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

    //-----------------------------------------

    onDropdownChange: any

    constructor(
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private http: HttpClient // Inyectar HttpClient
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            cGrado: [0, Validators.required],
            cVacantesRegular: [0, Validators.required],
            cVacanteNEE: [0, Validators.required],
        })
    }
    //Guardar registro el GRID
    onSubmit() {
        const valoresFormulario = this.form.value
        const nuevoRegistro = {
            iNivel_grado: Number(valoresFormulario.cGrado),
            cVacantesRegular: Number(valoresFormulario.cVacantesRegular),
            cVacanteNEE: Number(valoresFormulario.cVacanteNEE),
        }
        this.guardar_vacantes.push(nuevoRegistro)
        //this.filteredData = [...this.guardar_vacantes];
        //Actualizacion de la Grilla-----------------------------
        setTimeout(() => {
            this.guardar_vacantes = [...this.guardar_vacantes]
        }, 0)
        //this.form.reset();
    }

    selectRow() {
        throw new Error('Method not implemented.')
    }
    onSearch(event: any) {
        const searchText = event.target.value.toLowerCase()
        this.filteredData = this.guardar_vacantes.filter((item) =>
            item.iNivel_grado.toString().toLowerCase().includes(searchText)
        )
    }

    //linea de codigo 18 Feb----------------------------------------------------
    // Método para enviar los datos al backend
    enviarVacantes() {
        //const url = 'http://tu-backend-laravel/api/guardar-vacantes';
        if (this.guardar_vacantes.length === 0) {
            console.warn('No hay vacantes para enviar.')
            return
        }

        const url = `${this.backendApi}/acad/vacantes/guardar`

        this.http.post(url, { vacantes: this.guardar_vacantes }).subscribe({
            next: (response) =>
                console.log('Vacantes guardadas correctamente', response),
            error: (error) =>
                console.error('Error al guardar las vacantes', error),
            complete: () => console.log('Petición finalizada'),
        })
    }

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

    // Método para eliminar una vacante--------
    eliminarVacante(index: number) {
        if (index >= 0 && index < this.guardar_vacantes.length) {
            this.guardar_vacantes.splice(index, 1)
            // Actualizar la grilla
            this.guardar_vacantes = [...this.guardar_vacantes]
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
            <h1 style="text-align: center; margin-top: 60px;">Vacantes Registradas</h1>
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
                    <td>${vacante.iNivel_grado}</td>
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
