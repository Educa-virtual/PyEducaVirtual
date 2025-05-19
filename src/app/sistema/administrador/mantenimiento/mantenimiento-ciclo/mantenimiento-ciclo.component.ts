import { Component, OnInit } from '@angular/core'
import { PanelModule } from 'primeng/panel'
import { PrimengModule } from '@/app/primeng.module'
import { FormBuilder, FormGroup } from '@angular/forms'
import { InputNumberModule } from 'primeng/inputnumber'
import { LocalStoreService } from '@/app/servicios/local-store.service'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { MenuItem, MessageService } from 'primeng/api'
import { StepsModule } from 'primeng/steps'
import { ToastModule } from 'primeng/toast'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
    selector: 'app-mantenimiento-ciclo',
    templateUrl: './mantenimiento-ciclo.component.html',
    styleUrl: './mantenimiento-ciclo.component.scss',
    standalone: true,
    imports: [
        PanelModule,
        PrimengModule,
        InputNumberModule,
        StepsModule,
        ToastModule,
    ],
    providers: [MessageService],
})
export class MantenimientoCicloComponent implements OnInit {
    items: MenuItem[] = []
    activeIndex: number = 0
    form!: FormGroup

    constructor(
        public messageService: MessageService,
        private fb: FormBuilder,
        private store: LocalStoreService,
        private constantesService: ConstantesService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.items = [
            { label: 'Nivel', routerLink: 'registro-niveles' },
            { label: 'Tipo nivel', routerLink: 'registro-niveles-tipos' },
            { label: 'Ciclo', routerLink: 'registro-nivel-ciclo' },
            { label: 'Grado', routerLink: 'registro-grados' },
            {
                label: 'Nivel Grado',
                command: (event: any) =>
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Last Step',
                        detail: event.item.label,
                    }),
            },
        ]

        const currentUrl = this.router.url
        const foundIndex = this.items.findIndex(
            (item) => item.routerLink && currentUrl.includes(item.routerLink)
        )

        // Si está en una ruta hija válida, sincroniza el paso
        if (foundIndex !== -1) {
            this.activeIndex = foundIndex
        } else {
            // Si no hay ruta hija activa, redirige al primer paso
            this.activeIndex = 0
            const primeraRuta = this.items[0].routerLink
            if (primeraRuta) {
                this.router.navigate([primeraRuta], { relativeTo: this.route })
            }
        }
    }

    onActiveIndexChange(index: number) {
        this.activeIndex = index

        const ruta = this.items?.[index]?.routerLink
        if (ruta) {
            this.router.navigate([ruta], { relativeTo: this.route })
        }
    }

    siguientePaso() {
        if (!this.items) return

        const siguienteIndex = this.activeIndex + 1

        if (siguienteIndex < this.items.length) {
            this.activeIndex = siguienteIndex

            const ruta = this.items[siguienteIndex]?.routerLink

            if (ruta) {
                this.router.navigate([ruta], { relativeTo: this.route })
            }
        }
    }
}
