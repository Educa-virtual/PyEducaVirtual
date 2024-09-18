import { Component } from '@angular/core'
import { AvatarModule } from 'primeng/avatar'

@Component({
    selector: 'app-profesor-avatar',
    standalone: true,
    imports: [AvatarModule],
    templateUrl: './profesor-avatar.component.html',
    styleUrl: './profesor-avatar.component.scss',
})
export class ProfesorAvatarComponent {}
