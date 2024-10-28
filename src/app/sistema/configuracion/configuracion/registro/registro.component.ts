import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Router } from '@angular/router';


import { StepsModule } from 'primeng/steps'
import { CalendarModule } from 'primeng/calendar'
import { Subscription } from 'rxjs';
import { MenuItem, MessageService } from 'primeng/api';
import { TicketService } from './service/ticketservice';
import { Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [
        ContainerPageComponent,
        StepsModule,
    ],
    providers: [MessageService, TicketService],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit, OnChanges {
    @Output() emitMode = new EventEmitter();
    subscription: Subscription;
    items: MenuItem[];

    constructor(public messageService: MessageService, public ticketService: TicketService, private router: Router) {}


    ngOnInit() {
        this.items = [
            {
                label: 'Año',
                routerLink: 'year'
            },
            {
                label: 'Días laborales',
                routerLink: 'diasLaborales'
            },
            {
                label: 'Turnos',
                routerLink: 'turnos'
            },
            {
                label: 'Periodos académicos',
                routerLink: 'periodosAcademicos'
            },
            {
                label: 'Resumen',
                routerLink: 'resumen'
            },
        ]

        this.subscription = this.ticketService.registrationComplete$.subscribe((personalInformation) => {
            this.messageService.add({ severity: 'success', summary: 'Order submitted', detail: 'Dear, ' + personalInformation.firstname + ' ' + personalInformation.lastname + ' your order completed.' });
        });

    }
    ngOnChanges(changes) {}

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

    navigateToYears() {
        this.router.navigate(['configuracion/configuracion/years']); // Navega a YearsComponent
    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
