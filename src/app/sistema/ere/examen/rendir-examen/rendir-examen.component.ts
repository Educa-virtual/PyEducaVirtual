import { PrimengModule } from '@/app/primeng.module'
import { ContainerPageComponent } from '@/app/shared/container-page/container-page.component'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-rendir-examen',
    standalone: true,
    templateUrl: './rendir-examen.component.html',
    styleUrls: ['./rendir-examen.component.scss'],
    imports: [PrimengModule, ContainerPageComponent],
})
export class RendirExamenComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('hola')
    }
}
