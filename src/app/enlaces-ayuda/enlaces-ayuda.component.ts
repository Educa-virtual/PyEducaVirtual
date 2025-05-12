import { Component, OnInit } from '@angular/core'
import { CardModule } from 'primeng/card'
import { ButtonModule } from 'primeng/button'
import { DomSanitizer } from '@angular/platform-browser'
import { Message } from 'primeng/api'
import { MessagesModule } from 'primeng/messages'
import { AccordionModule } from 'primeng/accordion'
import { ToolbarModule } from 'primeng/toolbar'

@Component({
    selector: 'app-enlaces-ayuda',
    standalone: true,
    imports: [
        CardModule,
        ButtonModule,
        MessagesModule,
        AccordionModule,
        ToolbarModule,
    ],
    templateUrl: './enlaces-ayuda.component.html',
    styleUrl: './enlaces-ayuda.component.scss',
})
export class EnlacesAyudaComponent implements OnInit {
    messages: Message[] | undefined
    sidebarVisible: boolean = false

    constructor(public sanitizer: DomSanitizer) {}

    ngOnInit() {
        this.messages = [{ severity: 'info', detail: 'Videos de Seguridad' }]
    }
}
