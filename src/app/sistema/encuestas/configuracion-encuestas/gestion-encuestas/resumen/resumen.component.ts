import { Component } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { ButtonModule } from 'primeng/button'
import { TimeComponent } from '@/app/shared/time/time.component'
import { IconComponent } from '@/app/shared/icon/icon.component'

@Component({
    selector: 'app-resumen',
    standalone: true,
    imports: [StepsModule, ButtonModule, TimeComponent, IconComponent],
    templateUrl: './resumen.component.html',
    styleUrl: './resumen.component.scss',
})
export class ResumenComponent {}
