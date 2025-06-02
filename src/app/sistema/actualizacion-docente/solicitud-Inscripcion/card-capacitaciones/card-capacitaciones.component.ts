import { PrimengModule } from '@/app/primeng.module'
import { environment } from '@/environments/environment'
import { Component, Input } from '@angular/core'

@Component({
    selector: 'app-card-capacitaciones',
    standalone: true,
    imports: [PrimengModule],
    templateUrl: './card-capacitaciones.component.html',
    styleUrl: './card-capacitaciones.component.scss',
})
export class CardCapacitacionesComponent {
    backend = environment.backend
    @Input() capacitacion

    updateUrl(item) {
        item.cImagenUrl = 'cursos/images/no-image.jpg'
    }
    getUrlImg(cImagenUrl: string) {
        cImagenUrl = cImagenUrl ? JSON.parse(cImagenUrl) : []
        return cImagenUrl.length
            ? cImagenUrl[0]['url']
            : '/cursos/images/no-image.jpg'
    }

    // getUrlImg(cImagenUrl: string) {
    //     cImagenUrl = cImagenUrl ? JSON.parse(cImagenUrl) : cImagenUrl
    //     if (cImagenUrl.length) {
    //         return cImagenUrl[0]['url']
    //     }
    //     return '/cursos/images/no-image.jpg'
    // }
}
