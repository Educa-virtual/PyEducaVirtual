import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'

import { EventEmitter, Output } from '@angular/core'
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api'
import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs'
import { TicketService } from './service/ticketservice'

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [ContainerPageComponent, StepsModule],
    providers: [MessageService],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit, OnDestroy {
    @Output() emitMode = new EventEmitter()
    subscription: Subscription
    items: MenuItem[]

    constructor(
        public messageService: MessageService,
        public ticketService: TicketService,
        private router: Router,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.items = [
            {
                label: 'Fechas',
                routerLink: 'fechas',
            },
            {
                label: 'Días laborales',
                routerLink: 'dias-laborales',
            },
            {
                label: 'Turnos',
                routerLink: 'turnos',
            },
            {
                label: 'Periodos académicos',
                routerLink: 'periodos-academicos',
            },
            {
                label: 'Resumen',
                routerLink: 'resumen',
            },
        ]

        this.subscription = this.ticketService.registrationComplete$.subscribe(
            (personalInformation) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Order submitted',
                    detail:
                        'Dear, ' +
                        personalInformation.firstname +
                        ' ' +
                        personalInformation.lastname +
                        ' your order completed.',
                })
            }
        )
    }
    actionsContainer = [
        {
            labelTooltip: 'Regresar',
            text: 'Regresar',
            icon: 'pi pi-arrow-left',
            accion: '',
            class: 'p-button-primary',
        },
    ]

    actionBtn(mode) {
        this.emitMode.emit(mode)
    }

    validateYear() {}

    navigateToYears() {
        this.router.navigate(['configuracion/configuracion/years']) // Navega a YearsComponent
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe()
        }
    }
}
