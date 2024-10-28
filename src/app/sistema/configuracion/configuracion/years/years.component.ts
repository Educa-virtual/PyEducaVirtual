import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'

import { Output, EventEmitter } from '@angular/core'

import { Router } from '@angular/router'
import { httpService } from '../http/httpService'
import { LocalStoreService } from '@/app/servicios/local-store.service'

@Component({
    selector: 'app-years',
    standalone: true,
    imports: [ContainerPageComponent, TablePrimengComponent],
    templateUrl: './years.component.html',
    styleUrl: './years.component.scss',
})
export class YearsComponent implements OnInit {
    fechasAcademicas

    @Output() emitMode = new EventEmitter()
    constructor(
        private router: Router,
        private httpService: httpService,
        private localService: LocalStoreService
    ) {}

    ngOnInit(): void {


        this.httpService
            .postData('acad/calendarioAcademico/addCalAcademico', {
                json: JSON.stringify({
                    iSedeId: this.localService.getItem('dremoPerfil').iSedeId,
                }),
                _opcion: 'getCalendarioIESede',
            })
            .subscribe({
                next: (data: any) => {
                    // console.log(data.data)
                    console.log(JSON.parse(data.data[0]["calendarioAcademico"]))


                    this.fechasAcademicas = JSON.parse(data.data[0]["calendarioAcademico"]).map((fecha) => ({
                        fechaVigente: this.formatFechas(
                            fecha.dtCalAcadInicio,
                            'YYYY'
                        ),
                        dtCalAcadInicio: this.formatFechas(
                            fecha.dtCalAcadInicio,
                            'DD/MM/YY'
                        ),
                        dtCalAcadFin: this.formatFechas(
                            fecha.dtCalAcadFin,
                            'DD/MM/YY'
                        ),
                        iSedeId: fecha.iSedeId,
                        iYAcadId: fecha.iYAcadId,
                        iCalAcadId: fecha.iCalAcadId,
                        iEstado: fecha.iEstado,
                    }))

                    // console.log(this.fechasAcademicas)
                },
                error: (error) => {
                    console.error('Error fetching turnos:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }

    actionsContainer = [
        {
            labelTooltip: 'Registrar año escolar',
            text: 'Registrar año escolar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]

    handleActions(row) {
        console.log(row)

        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
                console.log('Viendo')
            },
            editar: () => {
                // Lógica para la acción "editar"
                console.log('Editando')

                this.httpService
                    .postData('acad/calendarioAcademico/addCalAcademico', {
                        json: JSON.stringify({
                            iSedeId: row.iSedeId,
                            iYAcadId: row.iYAcadId,
                            iCalAcadId: row.iCalAcadId,
                        }),
                        _opcion: 'getCalendarioIE',
                    })
                    .subscribe({
                        next: (data: any) => {
                            console.log(data)
                        },
                        error: (error) => {
                            console.error('Error fetching turnos:', error)
                        },
                        complete: () => {
                            console.log('Request completed')
                        },
                    })
            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
                console.log('Eliminando')
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
    }

    formatFechas(fecha, typeFormat = 'DD/MM/YY hh:mm') {
        const date = new Date(fecha)

        const replacements = {
            DD: String(date.getDate()).padStart(2, '0'),
            MM: String(date.getMonth() + 1).padStart(2, '0'),
            YY: String(date.getFullYear()).slice(-2),
            YYYY: date.getFullYear(),
            hh: String(date.getHours()).padStart(2, '0'),
            mm: String(date.getMinutes()).padStart(2, '0'),
            ss: String(date.getSeconds()).padStart(2, '0'),
        }

        // Reemplaza cada formato en el string de typeFormat usando el objeto replacements
        return typeFormat.replace(
            /DD|MM|YYYY|YY|hh|mm|ss/g,
            (match) => replacements[match]
        )
    }

    actions = [
        {
            labelTooltip: 'Ver',
            icon: 'pi pi-eye',
            accion: 'ver',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
            // isVisible:(fechasAcademicas)=>{
            //     fechasAcademicas
            //     return fechasAcademicas.iEstado === 0
            // }
        },
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pencil',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-warning p-button-text',
        },
        {
            labelTooltip: 'Eliminar',
            icon: 'pi pi-trash',
            accion: 'eliminar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'text',
            width: '5rem',
            field: 'fechaVigente',
            header: 'Año vigente',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadInicio',
            header: 'Fecha inicio',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'dtCalAcadFin',
            header: 'Fecha fin',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]

    navigateToRegistro() {
        this.router.navigate(['configuracion/configuracion/registro'])
    }

    navigateToResumen() {
        this.router.navigate(['/configuracion/configuracion/registro'])
    }
}
