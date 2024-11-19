import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Router } from '@angular/router';

import { StepsModule } from 'primeng/steps'
import { Subscription } from 'rxjs';
import { MenuItem, MessageService, ConfirmationService } from 'primeng/api';
import { Output, EventEmitter } from '@angular/core';

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

    constructor(private router: Router) {

    }


    ngOnInit() {
        this.items = [
            {
                label: 'Datos personales',
                routerLink: 'datos-personales'
            },
            {
                label: 'Asignación cargo',
                routerLink: 'asignacion-cargo'
            },
            {
                label: 'Asignación áreas',
                routerLink: 'asignacion-areas'
            },
        ]

    }

    ngOnChanges(changes) {}

    handleActions(row) {
        console.log(row)

        const actions = {
            ver: () => {
                // Lógica para la acción "ver"
            },
            editar: () => {
                // Lógica para la acción "editar"

            },
            eliminar: () => {
                // Lógica para la acción "eliminar"
            },
        }

        const action = actions[row.accion]
        if (action) {
            action()
        } else {
            console.log(`Acción desconocida: ${row.action}`)
        }
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



    navigateToAdministrarPersonal() {
        
        this.router.navigate(['configuracion/personal/administrar']); 
    }


    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
