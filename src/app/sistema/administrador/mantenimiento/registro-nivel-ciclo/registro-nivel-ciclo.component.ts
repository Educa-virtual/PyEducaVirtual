import { Component } from '@angular/core'
import { PanelModule } from 'primeng/panel'
import { InputTextModule } from 'primeng/inputtext'
import { FormsModule } from '@angular/forms'
import { FormGroup } from '@angular/forms'
import {
    IActionTable,
    TablePrimengComponent,
} from '@/app/shared/table-primeng/table-primeng.component'
import { ReactiveFormsModule } from '@angular/forms'
import { DropdownModule } from 'primeng/dropdown'

@Component({
    selector: 'app-registro-nivel-ciclo',
    standalone: true,
    imports: [
        PanelModule,
        InputTextModule,
        TablePrimengComponent,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
    ],
    templateUrl: './registro-nivel-ciclo.component.html',
    styleUrl: './registro-nivel-ciclo.component.scss',
})
export class RegistroNivelCicloComponent {
    formGroup: FormGroup | undefined
    // this.formGroup = new FormGroup({
    //       selectedCity: new FormControl<Niveles_tipos | null>(null)
    //   });

    selectedItems = []
    datos = [
        {
            item: 1,
            nombciclo: 'EBR-CICLO I',
            cicloromanos: 'I',
            cicloabrev: 'C - I',
            estado: '1',
            acciones: 'Editar',
        },
        {
            item: 1,
            nombciclo: 'EBR-CICLO III',
            cicloromanos: 'III',
            cicloabrev: 'C - III',
            estado: '1',
            acciones: 'Editar',
        },
    ]

    actions: IActionTable[] = [
        {
            labelTooltip: 'Editar',
            icon: 'pi pi-pen-to-square',
            accion: 'editar',
            type: 'item',
            class: 'p-button-rounded p-button-danger p-button-text',
        },
    ]

    columns = [
        {
            type: 'item',
            width: '2rem',
            field: '',
            header: 'Item',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '10rem',
            field: 'nombciclo',
            header: 'Nombre del Ciclo',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '5rem',
            field: 'cicloabrev',
            header: 'Abreviacion del Ciclo',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'text',
            width: '3rem',
            field: 'estado',
            header: 'Estado',
            text_header: 'center',
            text: 'center',
        },

        {
            type: 'actions',
            width: '3rem',
            field: '',
            header: 'Acciones',
            text_header: 'center',
            text: 'center',
        },
    ]
}
