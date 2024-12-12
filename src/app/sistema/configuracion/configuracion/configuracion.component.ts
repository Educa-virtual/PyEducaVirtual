import {
    Component,
    OnInit,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from '@angular/core'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { StepsModule } from 'primeng/steps'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from '@/app/servicios/confirm.service'
//import { Router } from '@angular/router'
import { ToastModule } from 'primeng/toast'
import { TicketService } from './registro/service/ticketservice'

@Component({
    selector: 'app-configuracion',
    standalone: true,
    imports: [ConfirmDialogModule, StepsModule, ToastModule],
    templateUrl: './configuracion.component.html',
    styleUrl: './configuracion.component.scss',
    providers: [
        TicketService,
        StepConfirmationService,
        ConfirmationService,
        MessageService,
    ],
})
export class ConfiguracionComponent implements OnInit, OnChanges, OnDestroy {
    ngOnDestroy(): void {
        throw new Error('Method not implemented.')
    }
    ngOnChanges(changes: SimpleChanges): void {
        throw new Error('Method not implemented.', changes)
    }
    ngOnInit(): void {
        throw new Error('Method not implemented.')
    }
    //constructor(private router: Router) {}
}
