import { Component } from '@angular/core'
import { ConfirmDialogModule } from 'primeng/confirmdialog'
import { StepsModule } from 'primeng/steps'
import { ConfirmationService, MessageService } from 'primeng/api'
import { StepConfirmationService } from './service/confirmService'
import { ToastModule } from 'primeng/toast'

@Component({
    selector: 'app-estudiante',
    standalone: true,
    imports: [ConfirmDialogModule, StepsModule, ToastModule],
    templateUrl: './estudiante.component.html',
    styleUrl: './estudiante.component.scss',
    providers: [StepConfirmationService, ConfirmationService, MessageService],
})
export class EstudianteComponent {}
