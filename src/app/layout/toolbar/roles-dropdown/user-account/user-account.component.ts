import { PrimengModule } from '@/app/primeng.module'
import { Component } from '@angular/core'

@Component({
    selector: 'app-user-account',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './user-account.component.html',
    styleUrl: './user-account.component.scss',
})
export class UserAccountComponent {}
