import { Component, Input } from '@angular/core'
import { PrimengModule } from 'src/app/primeng.module'

@Component({
    selector: 'app-container-page',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './container-page.component.html',
    styleUrl: './container-page.component.scss',
})
export class ContainerPageComponent {
    @Input() title: string = 'Titulo'
    @Input() actions = [
        {
            labelTooltip: 'Agregar',
            text: 'Agregar',
            icon: 'pi pi-plus',
            accion: 'agregar',
            class: 'p-button-primary',
        },
        {
            labelTooltip: 'Descargar Pdf',
            text: 'Descargar Pdf',
            icon: 'pi pi-file-pdf',
            accion: 'descargar_pdf',
            class: 'p-button-danger',
        },
        {
            labelTooltip: 'Descargar Excel',
            text: 'Descargar Excel',
            icon: 'pi pi-download',
            accion: 'Descargar Excel',
            class: 'p-button-success',
        },
    ]
}
