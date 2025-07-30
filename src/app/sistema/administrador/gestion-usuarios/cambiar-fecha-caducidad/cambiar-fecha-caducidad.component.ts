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
  formCambiarFecha: FormGroup;
  fechaActual: any = null;
  nuevaFecha: any = null;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private usuariosService: GestionUsuariosService
  ) {}

  cerrarDialog() {
    this.visibleChange.emit(false);
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
      const fechaActual = this.usuario?.dtCredCaduca
        ? new Date(this.usuario.dtCredCaduca)
        : new Date();
      const fechaMasAnio = new Date(fechaActual);
      fechaMasAnio.setFullYear(fechaMasAnio.getFullYear() + 1);
      this.formCambiarFecha.get('fechaActual')?.setValue(fechaActual);
      this.formCambiarFecha.get('nuevaFecha')?.setValue(fechaMasAnio);
    }
  }

  actualizarFecha() {
    this.usuariosService
      .actualizarFechaVigencia(
        this.usuario?.iCredId,
        this.formCambiarFecha.get('nuevaFecha')?.value
      )
      .subscribe({
        next: (data: any) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: data.message,
          });
          this.usuario.dtCredCaduca = this.formCambiarFecha.get('nuevaFecha')?.value;
          this.cerrarDialog();
          //this.obtenerPerfilesUsuario()
        },
        error: error => {
          console.error('Error al agregar perfil:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Mensaje',
            detail: error.error.message,
          });
        },
      });
  }
}
