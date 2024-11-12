import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { TablePrimengComponent } from '@/app/shared/table-primeng/table-primeng.component'
import { Router } from '@angular/router';


import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Output, EventEmitter } from '@angular/core';
import { TicketService } from './service/ticketservice';

@Component({
    selector: 'app-registro',
    standalone: true,
    imports: [
        ContainerPageComponent,
        StepsModule,
    ],
    providers: [MessageService],
    templateUrl: './registro.component.html',
    styleUrl: './registro.component.scss',
})
export class RegistroComponent implements OnInit, OnChanges {
    @Output() emitMode = new EventEmitter();
    subscription: Subscription;
    items: MenuItem[];

    constructor(public messageService: MessageService, public ticketService: TicketService, private router: Router, private confirmationService: ConfirmationService) {

    }


    ngOnInit() {
        this.items = [
            {
                label: 'Fechas',
                routerLink: this.ticketService.registroInformation?.calendar?.iCalAcadId ? 'fechas' : ''
            },
            {
                label: 'Días laborales',
                routerLink: this.ticketService.registroInformation?.calendar?.iCalAcadId ? 'dias-laborales' : ''
            },
            {
                label: 'Turnos',
                routerLink: this.ticketService.registroInformation?.calendar?.iCalAcadId ? 'turnos' : ''
            },
            {
                label: 'Periodos académicos',
                routerLink: this.ticketService.registroInformation?.calendar?.iCalAcadId ? 'periodos-academicos' : ''
            },
            {
                label: 'Resumen',
                routerLink: this.ticketService.registroInformation?.calendar?.iCalAcadId ? 'resumen' : ''
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

    validateYear(){

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
