import { Component, Output, EventEmitter, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AccordionModule } from 'primeng/accordion'
import { ButtonModule } from 'primeng/button'
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms'
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { DropdownModule } from 'primeng/dropdown'
import { TableModule } from 'primeng/table'
import { IconFieldModule } from 'primeng/iconfield'
import { InputIconModule } from 'primeng/inputicon'

interface PoblacionItem {
    id: string
    nombre: string
    cantidad: number
    seleccionado: boolean
    icon: string
}

interface PoblacionSeleccionada {
    nombre: string
    cantidad: number
    criterio: string
    estado: string
}

interface DocenteData {
    grado: number
    seccion: string
    ie: string
    nivel: string
    ugel: string
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
        InputGroupAddonModule,
        DropdownModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
    ],
    templateUrl: './poblacion-objetivo.component.html',
    styleUrls: ['./poblacion-objetivo.component.scss'],
})
export class PoblacionObjetivoComponent implements OnInit {
    @Output() nextStep = new EventEmitter<void>()

    poblacionData: PoblacionItem[] = []
    poblacionSeleccionada: PoblacionSeleccionada[] = []
    docentesData: DocenteData[] = []

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

        // Datos simulados para la tabla
        this.poblacionSeleccionada = [
            {
                nombre: 'Especialistas DREMO',
                cantidad: 24,
                criterio: 'Área: Matemática',
                estado: 'Configurado',
            },
            {
                nombre: 'Docentes',
                cantidad: 45,
                criterio: 'Nivel: Primaria',
                estado: 'Pendiente',
            },
        ]

        // Datos simulados para docentes según Figma
        this.docentesData = [
            {
                grado: 1,
                seccion: 'A',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 1,
                seccion: 'B',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 1,
                seccion: 'C',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 2,
                seccion: 'A',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 2,
                seccion: 'B',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 2,
                seccion: 'C',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 3,
                seccion: 'A',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 3,
                seccion: 'B',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 3,
                seccion: 'C',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
            },
            {
                grado: 4,
                seccion: 'A',
                ie: 'JUAN XXIII',
                nivel: 'Primaria',
                ugel: 'Mariscal Nieto',
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

    onNext() {
        if (this.hasSelection()) {
            console.log('Población seleccionada:', this.getSelectedPoblacion())
            this.nextStep.emit()
        }
    }
}
