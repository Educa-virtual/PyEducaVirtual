import { IActividad } from '@/app/sistema/aula-virtual/interfaces/actividad.interface'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ActividadRowComponent } from '../actividad-row/actividad-row.component'
import { MenuModule } from 'primeng/menu'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-actividad-lista',
    standalone: true,
    imports: [ActividadRowComponent, MenuModule, PrimengModule],
    templateUrl: './actividad-lista.component.html',
    styleUrl: './actividad-lista.component.scss',
})
export class ActividadListaComponent implements OnInit {
    @Input({ required: true }) actividades: IActividad[] | any

    @Output() actionSelected = new EventEmitter<{
        actividad: IActividad
        action: string
    }>()

    ngOnInit(): void {
        console.log('this.actividades')
        console.log(this.actividades)
    }
}
