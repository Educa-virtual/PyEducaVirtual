import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-recover-password',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './recover-password.component.html',
    styleUrl: './recover-password.component.scss',
})
export class RecoverPasswordComponent {}
