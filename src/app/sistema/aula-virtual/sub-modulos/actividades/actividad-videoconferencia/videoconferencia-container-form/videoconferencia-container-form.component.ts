import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { DialogModule } from 'primeng/dialog'
import { ButtonModule } from 'primeng/button'

import { EditorModule } from 'primeng/editor'
import { FormsModule } from '@angular/forms'
import { TooltipModule } from 'primeng/tooltip'

@Component({
    selector: 'app-videoconferencia-container-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DialogModule,
        ButtonModule,
        EditorModule,
        FormsModule,
        TooltipModule,
    ],
    templateUrl: './videoconferencia-container-form.component.html',
    styleUrl: './videoconferencia-container-form.component.scss',
})
export class VideoconferenciaContainerFormComponent {
    meetingInput: string = '' // Variable para capturar el valor del campo de texto
    typesFiles: any

    joinMeeting() {
        if (!this.meetingInput.trim()) {
            alert('Por favor, introduce un código o enlace válido.')
            return
        }

        // Comprobar si es un enlace completo o un código
        const input = this.meetingInput.trim()
        const isLink =
            input.startsWith('http://') || input.startsWith('https://')

        // Construir el enlace de la reunión
        const meetingUrl = isLink ? input : `https://meet.google.com/${input}`

        // Redirigir al enlace
        window.open(meetingUrl, '_blank') // Abre en una nueva pestaña
    }

    imports: [
        TooltipModule,
        // otros módulos necesarios
    ]
}
