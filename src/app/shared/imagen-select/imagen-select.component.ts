import { PrimengModule } from '@/app/primeng.module'
import { Component, OnInit } from '@angular/core'

@Component({
    selector: 'app-imagen-select',
    standalone: true,
    templateUrl: './imagen-select.component.html',
    styleUrls: ['./imagen-select.component.scss'],
    imports: [PrimengModule],
})
export class ImagenSelectComponent implements OnInit {
    constructor() {}

    ngOnInit() {
        console.log('gg')
    }
}
