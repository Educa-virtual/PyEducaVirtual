import { Component, Input } from '@angular/core'
import { ICurso } from '../../../interfaces/curso.interface'
import { TableModule } from 'primeng/table'
import { PrimengModule } from '@/app/primeng.module'
@Component({
    selector: 'app-tab-inicio',
    standalone: true,
    imports: [TableModule, PrimengModule],
    templateUrl: './tab-inicio.component.html',
    styleUrl: './tab-inicio.component.scss',
})
export class TabInicioComponent {
    @Input() curso: ICurso
    @Input() anuncios = []

    data = [
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
        {
            cEstPaterno: 'Paterno',
            cEstMaterno: 'Materno',
            cEstNombres: 'Nombres',
            cCorreo: 'correo@gmail.com',
        },
    ]
}
