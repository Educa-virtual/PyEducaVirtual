import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'
import { Message } from 'primeng/api'

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
})
export class PerfilComponent {
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá actualizar su información básica',
        },
    ]
    date = new Date()
}
