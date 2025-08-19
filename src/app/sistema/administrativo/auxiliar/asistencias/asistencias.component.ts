import { Component, OnInit, inject } from '@angular/core'
import { PrimengModule } from '@/app/primeng.module'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { GeneralService } from '@/app/servicios/general.service'
@Component({
    selector: 'app-asistencias',
    standalone: true,
    imports: [PrimengModule, TablePrimengComponent],
    templateUrl: './asistencias.component.html',
    styleUrl: './asistencias.component.scss',
})
export class AsistenciasComponent implements OnInit {
    private servicioGeneral = inject(GeneralService)

    finalizar: boolean = false
    datos: any = {}
    cities: any[]
    ngOnInit() {
        this.cities = [
            { name: 'New York', code: 'NY' },
            { name: 'Rome', code: 'RM' },
            { name: 'London', code: 'LDN' },
            { name: 'Istanbul', code: 'IST' },
            { name: 'Paris', code: 'PRS' },
        ]
    }

    // bucamos el aula a registrar
    buscarGrupo() {
        this.finalizar = true
        console.table(this.servicioGeneral)
        this.finalizar = false
    }
}
