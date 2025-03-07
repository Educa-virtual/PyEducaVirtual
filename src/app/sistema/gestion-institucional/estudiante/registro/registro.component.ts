import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { EventEmitter, Output } from '@angular/core'
import { MenuItem, MessageService } from 'primeng/api'
import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs'
import { CompartirEstudianteService } from '../../services/compartir-estudiante.service'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [PrimengModule, StepsModule],
    providers: [MessageService],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit, OnDestroy {
    @Output() emitMode = new EventEmitter()
    estudiante_registrado: boolean = false
    subscription: Subscription
    items: MenuItem[]
    paises: Array<object>
    departamentos: Array<object>
    iEstudianteId: string
    iPersId: string

    routeLink = 0

    constructor(
        private router: Router,
        private compartirEstudianteService: CompartirEstudianteService
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Datos del estudiante',
                routerLink: 'datos',
            },
            {
                label: 'Apoderado',
                routerLink: 'representante',
            },
        ]
        this.setActiveIndexSteps()
    }

    inicio() {
        this.router.navigate(['/']) // Navega a inicio
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
        this.compartirEstudianteService.clearData()
    }

    setActiveIndexSteps(index: string = '0') {
        return index ?? this.compartirEstudianteService.getActiveIndex()
    }
}
