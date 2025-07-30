import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-responder-sugerencia',
  standalone: true,
  imports: [PrimengModule, ReactiveFormsModule, CommonModule],
  templateUrl: './responder-sugerencia.component.html',
  styleUrls: ['./responder-sugerencia.component.scss'],
})
export class ResponderSugerenciaComponent implements OnInit {
  form: FormGroup;
  private _selectedItem: any;
  @Output() eventSugerenciaRespondida = new EventEmitter<boolean>();
  //subir archivos propiedad
  archivos: any;

  @Input()
  set selectedItem(value: any) {
    this._selectedItem = value;
    if (this.form && value) {
      this.form.patchValue({
        cNombreEstudiante: this._selectedItem?.cNombreEstudiante,
        dtFechaCreacion: this._selectedItem?.dtFechaCreacion,
        cAsunto: this._selectedItem?.cAsunto,
        cPrioridadNombre: this._selectedItem?.cPrioridadNombre,
        cSugerencia: this._selectedItem?.cSugerencia,
        cRespuesta: '',
      });
    }
  }
  get selectedItem(): any {
    return this._selectedItem;
  }

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      cNombreEstudiante: [null],
      dtFechaCreacion: [null],
      cAsunto: [null],
      cPrioridadNombre: [null],
      cSugerencia: [null],
      cRespuesta: [null, Validators.required],
    });
  }

  cerrarDialog() {
    this.form.reset();
    this.eventSugerenciaRespondida.emit(false);
  }

  enviarRespuesta() {
    if (this.form.valid) {
      // Como estás usando datos hardcoded:
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Respuesta enviada correctamente',
      });

      this.eventSugerenciaRespondida.emit(true);
    }
  }
}
