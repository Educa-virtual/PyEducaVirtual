import { PrimengModule } from '@/app/primeng.module'
import { Component, Input, OnInit } from '@angular/core'

@Component({
    selector: 'app-foro-comentarios',
    standalone: true,
    templateUrl: './foro-comentarios.component.html',
    styleUrls: ['./foro-comentarios.component.scss'],
    imports: [PrimengModule],
})
export class ForoComentariosComponent implements OnInit {
    @Input() id: number // id de foro se cambiara x string mas adelante

    items: { label?: string; icon?: string; separator?: boolean }[] = []

    constructor() {}

    ngOnInit() {
        this.items = [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh',
            },
            {
                label: 'Search',
                icon: 'pi pi-search',
            },
            {
                separator: true,
            },
            {
                label: 'Delete',
                icon: 'pi pi-times',
            },
        ]

        console.log('id de foro', this.id)
    }
}
