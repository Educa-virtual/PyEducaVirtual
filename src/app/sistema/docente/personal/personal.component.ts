import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { BtnLoadingComponent } from '../../../shared/btn-loading/btn-loading.component'
import { TablePrimengComponent } from '../../../shared/table-primeng/table-primeng.component'

@Component({
    selector: 'app-personal',
    standalone: true,
    imports: [PrimengModule, BtnLoadingComponent, TablePrimengComponent],
    templateUrl: './personal.component.html',
    styleUrl: './personal.component.scss',
})
export class PersonalComponent {
    activeIndex: number = 0
    items = [
        {
            label: 'Datos Personales',
        },
        {
            label: 'Asignación de Área',
        },
        {
            label: 'Asignación de Cargo',
        },
    ]
    columnsCursos = [
        {
            type: 'item',
            width: '1rem',
            field: 'iId',
            header: 'N°',
            text_header: 'center',
            text: 'center',
        },
        {
            type: 'text',
            width: '10rem',
            field: 'cCurso',
            header: 'Curso',
            text_header: 'center',
            text: 'justify',
        },
        {
            type: 'actions',
            width: '3rem',
            field: 'actions',
            header: 'Seleccionar Área',
            text_header: 'center',
            text: 'center',
        },
    ]
    data = [
        {
            cCurso: 'Matemáticas',
        },
    ]
    actions = [
        {
            labelTooltip: 'Cambiar',
            icon: 'pi pi-arrow-right-arrow-left',
            accion: 'cambiar',
            type: 'item',
            class: 'p-button-rounded p-button-primary p-button-text',
        },
    ]
    onActiveIndexChange(event: number) {
        this.activeIndex = event
    }
    goStep(opcion: string) {
        switch (opcion) {
            case 'next':
                if (this.activeIndex !== 2) {
                    this.activeIndex++
                }
                break
            case 'back':
                if (this.activeIndex !== 0) {
                    this.activeIndex--
                }
                break
        }
    }
}
