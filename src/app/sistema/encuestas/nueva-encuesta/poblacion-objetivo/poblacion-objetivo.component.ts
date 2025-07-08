import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { DropdownModule } from 'primeng/dropdown'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
interface PoblacionItem {
    id: string
    nombre: string
    cantidad: number
    seleccionado: boolean
    icon: string
}

@Component({
    selector: 'app-poblacion-objetivo',
    standalone: true,
    imports: [
        CommonModule,
        AccordionModule,
        ButtonModule,
        CheckboxModule,
        FormsModule,
        InputGroupModule,
        TablePrimengComponent,
        InputGroupAddonModule,
        DropdownModule,
    ],
    templateUrl: './poblacion-objetivo.component.html',
    styleUrls: ['./poblacion-objetivo.component.scss'],
})
export class PoblacionObjetivoComponent implements OnInit {
    @Output() nextStep = new EventEmitter<void>()

    poblacionData: PoblacionItem[] = []

    ngOnInit() {
        this.poblacionData = [
            {
                id: 'especialistas-dremo',
                nombre: 'Especialistas DREMO',
                cantidad: 24,
                seleccionado: false,
                icon: 'pi-users',
            },
            {
                id: 'especialistas-ugel',
                nombre: 'Especialistas UGEL',
                cantidad: 24,
                seleccionado: false,
                icon: 'pi-users',
            },
            {
                id: 'directores',
                nombre: 'Directores',
                cantidad: 87,
                seleccionado: false,
                icon: 'pi-user-plus',
            },
            {
                id: 'docentes',
                nombre: 'Docentes',
                cantidad: 90,
                seleccionado: false,
                icon: 'pi-graduation-cap',
            },
            {
                id: 'estudiantes',
                nombre: 'Estudiantes',
                cantidad: 23000,
                seleccionado: false,
                icon: 'pi-book',
            },
            {
                id: 'apoderados',
                nombre: 'Apoderados',
                cantidad: 12,
                seleccionado: false,
                icon: 'pi-home',
            },
        ]
    }

    onSelectionChange(index: number) {
        console.log('Selección cambiada:', this.poblacionData[index])
    }

    onToggleSelection(index: number, selected: boolean) {
        this.poblacionData[index].seleccionado = selected
    }

    hasSelection(): boolean {
        return this.poblacionData.some((item) => item.seleccionado)
    }

    getSelectedPoblacion() {
        return this.poblacionData.filter((item) => item.seleccionado)
    }
}
