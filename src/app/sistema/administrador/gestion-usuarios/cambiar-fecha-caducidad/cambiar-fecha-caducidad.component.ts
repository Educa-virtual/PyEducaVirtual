import { PrimengModule } from '@/app/primeng.module';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Usuario } from '../interfaces/usuario.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { GestionUsuariosService } from '../services/gestion-usuarios.service';

@Component({
  selector: 'app-cambiar-fecha-caducidad',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './cambiar-fecha-caducidad.component.html',
  styleUrl: './cambiar-fecha-caducidad.component.scss',
})
export class CambiarFechaCaducidadComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() usuario: Usuario = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() refrescarLista = new EventEmitter<boolean>();

  formCambiarFecha: FormGroup;
  fechaActual: any = null;
  nuevaFecha: any = null;
  vigenciaActualizada: boolean = false;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private usuariosService: GestionUsuariosService
  ) {}

  cerrarDialog() {
    this.visibleChange.emit(false);
    if (this.vigenciaActualizada) {
      this.vigenciaActualizada = false;
      this.refrescarLista.emit(true);
    }
  }

  ngOnInit() {
    this.inicializarDatos();
  }

  inicializarDatos() {
    this.formCambiarFecha = this.fb.group({
      fechaActual: [{ value: '', disabled: true }],
      nuevaFecha: ['', [Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['visible'] && changes['visible'].currentValue === true) {
      this.vigenciaActualizada = false;
      const fechaActual = this.usuario?.dtCredCaduca ? new Date(this.usuario.dtCredCaduca) : null;
      const anioActual = new Date().getFullYear();
      const fechaFebSgte = new Date(anioActual + 1, 2, 0, 23, 59);
      this.formCambiarFecha.get('fechaActual')?.setValue(fechaActual);
      this.formCambiarFecha.get('nuevaFecha')?.setValue(fechaFebSgte);
    }
  }

  formatearFecha(fecha: Date) {
    const fechaSQL = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(fecha.getDate()).padStart(2, '0')}T${String(fecha.getHours()).padStart(
      2,
      '0'
    )}:${String(fecha.getMinutes()).padStart(2, '0')}:${String(fecha.getSeconds()).padStart(
      2,
      '0'
    )}`;
    return fechaSQL;
  }

  actualizarFecha() {
    this.usuariosService
      .actualizarVigenciaUsuario(this.usuario?.iCredId, {
        // dtCredCaduca: this.formCambiarFecha.value.nuevaFecha,
        dtCredCaduca: this.formatearFecha(this.formCambiarFecha.value.nuevaFecha),
      })
      .subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: data.message,
          });
          this.vigenciaActualizada = true;
          this.cerrarDialog();
        },
        error: error => {
          console.error(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: error.error.message,
          });
        },
      });
  }
}
