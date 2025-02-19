import { PrimengModule } from '@/app/primeng.module'
import { GeneralService } from '@/app/servicios/general.service'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-discapacidad',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './discapacidad.component.html',
    styleUrl: './discapacidad.component.scss',
})
export class DiscapacidadComponent implements OnInit {
    tiene_discapacidad: Array<object>
    tiene_condicion: Array<object>
    discapacidades: Array<object>

    constructor(private query: GeneralService) {}

    ngOnInit(): void {
        this.getTieneDiscapacidad()
        this.getTieneCondicion()
        this.getDiscapacidades()
    }

    getTieneDiscapacidad() {
        this.tiene_discapacidad = [
            { nombre: 'SI', id: '1' },
            { nombre: 'NO', id: '2' },
        ]
    }

    getTieneCondicion() {
        this.tiene_condicion = [
            { nombre: 'SI', id: '1' },
            { nombre: 'NO', id: '2' },
        ]
    }

    getDiscapacidades() {
        this.query
            .searchTablaXwhere({
                esquema: 'obe',
                tabla: 'discapacidades',
                campos: '*',
                condicion: '1 = 1',
            })
            .subscribe({
                next: (data: any) => {
                    this.discapacidades = data.data
                    console.log(this.discapacidades, 'discapacidades')
                },
                error: (error) => {
                    console.error('Error consultando discapacidades:', error)
                },
                complete: () => {
                    console.log('Request completed')
                },
            })
    }
}
