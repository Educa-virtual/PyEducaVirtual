import { PrimengModule } from '@/app/primeng.module'
import { Component, inject, OnInit } from '@angular/core'
import { Message } from 'primeng/api'
import { ImageUploadPrimengComponent } from '../../../shared/image-upload-primeng/image-upload-primeng.component'
import { ConstantesService } from '@/app/servicios/constantes.service'
import { GeneralService } from '@/app/servicios/general.service'

@Component({
    selector: 'app-perfil',
    standalone: true,
    imports: [PrimengModule, ImageUploadPrimengComponent],
    templateUrl: './perfil.component.html',
    styleUrl: './perfil.component.scss',
})
export class PerfilComponent implements OnInit {
    private _ConstantesService = inject(ConstantesService)
    private _GeneralService = inject(GeneralService)
    mensaje: Message[] = [
        {
            severity: 'info',
            detail: 'En esta sección podrá actualizar su información básica',
        },
    ]
    date = new Date()

    ngOnInit() {
        this.getPersonasxiPersId()
    }
    accionBtnItem(elemento): void {
        const { accion } = elemento
        const { item } = elemento
        switch (accion) {
            case 'subir-archivo-users':
                console.log(item.imagen.data)
                break
        }
    }
    getPersonasxiPersId() {
        const params = {
            petition: 'post',
            group: 'grl',
            prefix: 'personas',
            ruta: 'list',
            seleccion: 1,
            data: {
                opcion: 'CONSULTARxiPersId',
                iPersId: this._ConstantesService.iPersId,
            },
            params: { skipSuccessMessage: true },
        }

        this._GeneralService.getGralPrefix(params).subscribe({
            next: (response) => {
                console.log(response)
            },
            complete: () => {},
            error: (error) => {
                console.log(error)
            },
        })
    }
}
