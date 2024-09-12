import { Component } from '@angular/core'
import { ContainerPageComponent } from '../../../shared/container-page/container-page.component'
import { SharedAnimations } from '@/app/shared/animations/shared-animations'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { FormPersonasComponent } from '../componentes/form-personas/form-personas.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-personas',
    standalone: true,
    imports: [
        ContainerPageComponent,
        TablePrimengComponent,
        FormPersonasComponent,
        PrimengModule,
    ],
    templateUrl: './personas.component.html',
    styleUrl: './personas.component.scss',
    animations: [SharedAnimations],
})
export class PersonasComponent {
    showForm: boolean = false

    actions = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
    ]
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        console.log(item)
        switch (accion) {
            case 'actualizar':
            case 'agregar':
                this.showForm = true
                break
            default:
                break
        }
    }
}
