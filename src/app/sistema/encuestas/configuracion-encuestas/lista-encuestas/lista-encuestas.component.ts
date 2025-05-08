import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import {
    listaEncuestaColumns,
    listaEncuestaContainerActions,
} from '../config/tables/lista-encuestas'

@Component({
    selector: 'app-lista-encuestas',
    standalone: true,
    imports: [StepsModule, ContainerPageComponent, TablePrimengComponent],
    templateUrl: './lista-encuestas.component.html',
    styleUrl: './lista-encuestas.component.scss',
})
export class ListaEncuestasComponent implements OnInit {
    title = 'Lista de Encuestas'

    listaEncuestaColumns = listaEncuestaColumns
    listaEncuestasContainerActions = listaEncuestaContainerActions

    ngOnInit(): void {
        console.log()
    }

    handleActions(e) {
        console.log(e)
    }
}
