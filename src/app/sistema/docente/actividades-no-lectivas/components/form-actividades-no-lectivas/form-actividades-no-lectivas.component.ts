import { PrimengModule } from '@/app/primeng.module'
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component'
import {
    Component,
    EventEmitter,
    Input,
    Output,
    OnChanges,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import {
    storeDetalleCargaNoLectivas,
    updateDetalleCargaNoLectivas,
} from '../../../formGroup/form-detalle-carga-no-lectivas'
import { TypesFilesUploadPrimengComponent } from '@/app/shared/types-files-upload-primeng/types-files-upload-primeng.component'
import { NgIf } from '@angular/common'

@Component({
    selector: 'app-form-actividades-no-lectivas',
    standalone: true,
    imports: [
        ModalPrimengComponent,
        PrimengModule,
        TypesFilesUploadPrimengComponent,
        NgIf,
    ],
    templateUrl: './form-actividades-no-lectivas.component.html',
    styleUrl: './form-actividades-no-lectivas.component.scss',
})
export class FormActividadesNoLectivasComponent implements OnChanges {
    @Output() accionBtnItem = new EventEmitter()

    @Input() showModal: boolean = true
    @Input() tiposCargaNoLectivas = []
    @Input() data
    @Input() titulo: string = ''
    @Input() opcion: string = ''
    @Input() iFalta

    typesFiles = {
        file: true,
        url: true,
        youtube: true,
        repository: false,
        image: true,
    }

    formDetalleCargaNoLectivas: FormGroup = storeDetalleCargaNoLectivas
    filesUrl = []

    ngOnChanges(changes) {
        if (changes.showModal?.currentValue) {
            this.showModal = changes.showModal.currentValue
        }
        if (changes.tiposCargaNoLectivas?.currentValue) {
            this.tiposCargaNoLectivas =
                changes.tiposCargaNoLectivas.currentValue
        }
        if (changes.titulo?.currentValue) {
            this.titulo = changes.titulo.currentValue
        }
        if (changes.opcion?.currentValue) {
            this.opcion = changes.opcion.currentValue
            this.formDetalleCargaNoLectivas =
                this.opcion === 'GUARDAR'
                    ? storeDetalleCargaNoLectivas
                    : updateDetalleCargaNoLectivas
        }
        if (changes.data?.currentValue) {
            this.data = changes.data.currentValue
            if (this.formDetalleCargaNoLectivas) {
                this.opcion === 'ACTUALIZAR'
                    ? this.formDetalleCargaNoLectivas.patchValue(this.data)
                    : this.formDetalleCargaNoLectivas.reset()
                this.formDetalleCargaNoLectivas.controls['opcion'].setValue(
                    this.opcion
                )
                const files =
                    this.formDetalleCargaNoLectivas.value
                        .cDetCargaNoLectEvidencias
                this.filesUrl = files ? files : []
                this.formDetalleCargaNoLectivas.controls[
                    'nDetCargaNoLectHoras'
                ].setValue(this.iFalta)
            }
        }
        // if (changes.iFalta?.currentValue) {
        //     this.iFalta = changes.iFalta.currentValue

        //     this.formDetalleCargaNoLectivas.controls['nDetCargaNoLectHoras'].setValue(parseFloat(this.iFalta).toFixed(2))
        //     console.log(this.formDetalleCargaNoLectivas.value)

        // }
    }
    accionBtn(elemento): void {
        const { accion } = elemento
        const { item } = elemento

        switch (accion) {
            case 'close-modal':
                // Emitir evento para cerrar el modal
                this.accionBtnItem.emit({ accion, item })
                break
            case this.opcion:
                // Convertir la lista de archivos a JSON si existen, de lo contrario, asignar null
                this.formDetalleCargaNoLectivas.controls[
                    'cDetCargaNoLectEvidencias'
                ].setValue(
                    this.filesUrl.length ? JSON.stringify(this.filesUrl) : null
                )
                // Emitir evento con los datos actualizados del formulario
                this.accionBtnItem.emit({
                    accion,
                    item: this.formDetalleCargaNoLectivas.value,
                })
                break
            case 'subir-file-detalle-carga-no-lectivas':
                // Agregar un archivo a la lista de archivos
                this.filesUrl.push({
                    type: 1, //1->file
                    nameType: 'file',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
            case 'url-detalle-carga-no-lectivas':
                // Agregar una URL a la lista de archivos
                this.filesUrl.push({
                    type: 2, //2->url
                    nameType: 'url',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'youtube-detalle-carga-no-lectivas':
                // Agregar un enlace de YouTube a la lista de archivos
                this.filesUrl.push({
                    type: 3, //3->youtube
                    nameType: 'youtube',
                    name: item.name,
                    size: '',
                    ruta: item.ruta,
                })
                break
            case 'subir-image-detalle-carga-no-lectivas':
                // Agregar una imagen a la lista de archivos
                this.filesUrl.push({
                    type: 5, //5->image
                    nameType: 'image',
                    name: item.file.name,
                    size: item.file.size,
                    ruta: item.name,
                })
                break
        }
    }
}
