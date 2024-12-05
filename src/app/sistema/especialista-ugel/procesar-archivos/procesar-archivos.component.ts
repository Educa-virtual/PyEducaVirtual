import { Component } from '@angular/core'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'

@Component({
    selector: 'app-procesar-archivos',
    standalone: true,
    imports: [],
    templateUrl: './procesar-archivos.component.html',
    styleUrl: './procesar-archivos.component.scss',
})
export class ProcesarArchivosComponent {
    // Definimos la variable `url` como un SafeResourceUrl
    url: SafeResourceUrl

    constructor(private sanitizer: DomSanitizer) {
        // Aquí le decimos a Angular que la URL es segura para usarla dentro de un iframe
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
            'http://umc.minedu.gob.pe/evaluaciones-censales/' // URL externa
        )
    }
}
