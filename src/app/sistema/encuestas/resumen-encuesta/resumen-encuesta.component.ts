import { Component } from '@angular/core'
import { StepsModule } from 'primeng/steps'
import { ButtonModule } from 'primeng/button'
import { TimeComponent } from '@/app/shared/time/time.component'
import { IconComponent } from '@/app/shared/icon/icon.component'
import { PrimengModule } from '@/app/primeng.module'

@Component({
    selector: 'app-resumen-encuesta',
    standalone: true,
    imports: [
        StepsModule,
        ButtonModule,
        TimeComponent,
        IconComponent,
        PrimengModule,
    ],
    templateUrl: './resumen-encuesta.component.html',
    styleUrl: './resumen-encuesta.component.scss',
})
export class ResumenEncuestaComponent {}
