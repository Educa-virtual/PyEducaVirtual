import { PrimengModule } from '@/app/primeng.module';
import { ModalPrimengComponent } from '@/app/shared/modal-primeng/modal-primeng.component';
import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  storeMaterialEducativoDocentes,
  updateMaterialEducativoDocentes,
} from '../../../formGroup/form-material-educativo-docentes';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-form-material-educativo',
  standalone: true,
  imports: [PrimengModule, ModalPrimengComponent, NgIf],
  templateUrl: './form-material-educativo.component.html',
  styleUrl: './form-material-educativo.component.scss',
})
export class FormMaterialEducativoComponent implements OnChanges {
  @Output() accionBtnItem = new EventEmitter();

  @Input() showModal: boolean = true;
  @Input() data;
  @Input() titulo: string = '';
  @Input() opcion: string = '';

  archivos: any[] = [];

  date = new Date();
  formMaterialEducativoDocentes: FormGroup;
  selectedFiles = [];
  filesUrl = [];

  ngOnChanges(changes) {
    if (changes['showModal']) {
      this.showModal = changes.showModal.currentValue;
    }
    if (changes['titulo']) {
      this.titulo = changes.titulo.currentValue;
    }
    if (changes['opcion']) {
      this.opcion = changes.opcion.currentValue;
      this.formMaterialEducativoDocentes =
        this.opcion === 'GUARDAR'
          ? storeMaterialEducativoDocentes()
          : updateMaterialEducativoDocentes();
    }
    if (changes['data'] && this.formMaterialEducativoDocentes) {
      this.data = changes.data.currentValue;

      if (this.formMaterialEducativoDocentes) {
        this.opcion === 'ACTUALIZAR'
          ? this.formMaterialEducativoDocentes.patchValue(this.data)
          : this.formMaterialEducativoDocentes.reset();
        this.formMaterialEducativoDocentes.controls['opcion'].setValue(this.opcion);
        const files = this.formMaterialEducativoDocentes.value.cMatEducativoUrl || [];
        this.archivos = files;
      }
    }
  }
  accionBtn(elemento): void {
    const { accion } = elemento;
    const { item } = elemento;

    switch (accion) {
      case 'close-modal':
        this.accionBtnItem.emit({ accion, item });
        this.archivos = [];
        break;
      case this.opcion:
        this.formMaterialEducativoDocentes.controls['cMatEducativoUrl'].setValue(
          this.archivos.length ? this.archivos : null
        );
        this.accionBtnItem.emit({ accion, item: this.formMaterialEducativoDocentes.value });
        break;
    }
  }

  seleccionarArchivo(event: any, subir: any) {
    const documento = event.files[0];

    if (documento.type === 'application/pdf') {
      this.archivos.push({
        type: 1,
        name: documento.name,
        peso: (documento.size / 1024).toFixed(2) + ' KB',
        exportar: documento,
      });
    }
    subir.clear();
  }

  adjuntarEnlace(enlace: any) {
    if (!/^https?:\/\//i.test(enlace.value)) {
      return;
    }

    const url = enlace.value.trim();

    this.archivos.push({
      type: 2, //2->enlace
      name: url,
      ruta: url,
      peso: '-',
      exportar: null,
    });
  }

  eliminarArchivo(lista: any) {
    this.archivos.splice(lista.index, 1);
  }
}
