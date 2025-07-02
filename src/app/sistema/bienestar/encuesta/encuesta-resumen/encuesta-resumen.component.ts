import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { DatosEncuestaService } from '../../services/datos-encuesta.service'
import { FuncionesBienestarService } from '../../services/funciones-bienestar.service'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ActivatedRoute, Router } from '@angular/router'
import { MenuItem } from 'primeng/api'

@Component({
    selector: 'app-encuesta-resumen',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './encuesta-resumen.component.html',
    styleUrl: './../../gestionar-encuestas/gestionar-encuestas.component.scss',
})
export class EncuestaResumenComponent {
    perfil: any
    iEncuId: number
    cEncuNombre: string

    breadCrumbItems: MenuItem[]
    breadCrumbHome: MenuItem

    constructor(
        private datosEncuestas: DatosEncuestaService,
        private funcionesBienestar: FuncionesBienestarService,
        private store: LocalStoreService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.perfil = this.store.getItem('dremoPerfil')
        this.route.paramMap.subscribe((params: any) => {
            this.iEncuId = params.params.id || 0
        })
        this.breadCrumbItems = [
            {
                label: 'Gestionar encuestas',
                routerLink: '/bienestar/gestionar-encuestas',
            },
            {
                label: 'Encuesta',
                routerLink: `/bienestar/encuesta/${this.iEncuId}`,
            },
            {
                label: 'Resumen',
            },
        ]
        this.breadCrumbHome = {
            icon: 'pi pi-home',
            routerLink: '/',
        }
    }

    ngOnInit(): void {
        if (this.iEncuId) {
            this.verEncuesta()
        }
    }

    verEncuesta() {
        this.datosEncuestas
            .verEncuesta({
                iCredEntPerfId: this.perfil.iCredEntPerfId,
                iEncuId: this.iEncuId,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.data.length) {
                        this.cEncuNombre = data.data[0].cEncuNombre
                    }
                },
                error: (error) => {
                    console.error('Error obteniendo encuesta:', error)
                },
            })
    }
}
