import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import {
    listaEncuestaColumns,
    listaEncuestaContainerActions,
} from '../config/tables/lista-encuestas'
import { Router } from '@angular/router'

@Component({
    selector: 'app-lista-encuestas',
    standalone: true,
    imports: [StepsModule, ContainerPageComponent, TablePrimengComponent],
    templateUrl: './lista-encuestas.component.html',
    styleUrl: './lista-encuestas.component.scss',
})
export class ListaEncuestasComponent implements OnInit {
    title = 'CENSO DRE/UGEL'

    listaEncuestaColumns = listaEncuestaColumns
    listaEncuestasContainerActions = listaEncuestaContainerActions

    constructor(private router: Router) {}

    ngOnInit(): void {
        console.log()
    }

    handleActions({ accion, item }) {
        switch (accion) {
            case 'agregar':
                console.log(item)

                this.router.navigate([
                    '/encuestas/configuracion-encuesta/informacion-general',
                ])

                break

            default:
                break
        }

        console.log(accion)
    }
}
