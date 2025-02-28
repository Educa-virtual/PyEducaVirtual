import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'
import { DropdownModule } from 'primeng/dropdown'
import { FormsModule } from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { CascadeSelectModule } from 'primeng/cascadeselect'
import { ApiEspecialistasService } from '../../services/api-especialistas.service'

interface primaria {
    id: number
    nombre: string
}

interface secundaria {
    id: number
    nombre: string
}

@Component({
    selector: 'app-especialista-ugel',
    standalone: true,
    imports: [
        CommonModule,
        TableModule,
        DropdownModule,
        FormsModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        CheckboxModule,
        CascadeSelectModule,
    ],
    templateUrl: './especialista-ugel.component.html',
    styleUrl: './especialista-ugel.component.scss',
})
export class EspecialistaUgelComponent implements OnInit {
    primarias: primaria[] = []
    secundarias: secundaria[] = []
    especialistas: any[] = []

    constructor(private apiEspecialistasService: ApiEspecialistasService) {}

    ngOnInit() {
        this.primarias = [
            { id: 1, nombre: ' MATEMATICA' },
            { id: 2, nombre: ' COMUNICACION' },
            { id: 3, nombre: ' CIENCIA  Y TECNOLOGIA' },
            { id: 4, nombre: ' ARTE Y CULTURA' },
            { id: 5, nombre: ' EDUCACION RELIGIOSA' },
        ]

        this.secundarias = [
            { id: 1, nombre: ' MATEMATICA' },
            { id: 2, nombre: ' COMUNICACION' },
            { id: 3, nombre: ' CIENCIA  Y TECNOLOGIA' },
            { id: 4, nombre: ' ARTE Y CULTURA' },
            { id: 5, nombre: ' EDUCACION RELIGIOSA' },
        ]

        this.apiEspecialistasService
            .listarEspecialistasUgel()
            .subscribe((data) => {
                this.especialistas = data.map((especialista: any) => ({
                    ...especialista,
                    label: `${especialista.cPersNombre} ${especialista.cPersPaterno} ${especialista.cPersMaterno} - ${especialista.cPersDocumento} (${especialista.cPerfilNombre})`,
                }))
            })
    }
}
