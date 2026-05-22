import { MessageService } from 'primeng/api';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrimengModule } from '@/app/primeng.module';
import { GestionUsuariosService } from '../services/gestion-usuarios.service';

@Component({
  selector: 'app-agregar-usuario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './agregar-usuario.component.html',
  styleUrl: './agregar-usuario.component.scss',
})
export class AgregarUsuarioComponent implements OnInit {
  formUsuario!: FormGroup;
  sexos: Array<object> = [
    { label: 'MASCULINO', value: 'M' },
    { label: 'FEMENINO', value: 'F' },
  ];
  tipos_documentos: Array<object>;
  botonRegistrarDesactivado: boolean = true;

  longitud_documento: number = 8;
  formato_documento: string = '99999999';

  constructor(
    private fb: FormBuilder,
    private usuariosService: GestionUsuariosService,
    private messageService: MessageService
  ) {}

  // Propiedades para el diálogo
  @Input() visible: boolean = false;
  @Input() dataUsuarios: any[] = [];
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() usuarioRegistradoEvent = new EventEmitter<any>();

  ngOnInit() {
    this.formUsuario = this.fb.group({
      iPersId: [null],
      iTipoIdentId: [1, [Validators.required]],
      cPersDocumento: ['', [Validators.required]],
      cPersNombre: ['', [Validators.required]],
      cPersMaterno: [''],
      cPersPaterno: ['', [Validators.required]],
      cPersSexo: ['M', [Validators.required]],
      cPersCorreo: [''],
      cPersTelefono: [''],
      dPersNacimiento: [null],
    });

    this.usuariosService.crearUsuario().subscribe((data: any) => {
      this.tipos_documentos = this.usuariosService.getTiposDocumentos(data?.tipos_documentos);
    });
  }

  closeDialog() {
    this.visible = false;
    this.reiniciarFormulario();
    this.formUsuario.get('cPersDocumento')?.setValue('');
    this.visibleChange.emit(false);
  }

  reiniciarFormulario() {
    this.formUsuario.get('iPersId')?.setValue('');
    this.formUsuario.get('cPersNombre')?.setValue('');
    this.formUsuario.get('cPersPaterno')?.setValue('');
    this.formUsuario.get('cPersMaterno')?.setValue('');
  }

  buscarPersonaPorDocumento() {
    this.reiniciarFormulario();
    this.usuariosService
      .buscarPersona({
        iTipoIdentId: this.formUsuario.get('iTipoIdentId')?.value,
        cPersDocumento: this.formUsuario.get('cPersDocumento')?.value,
      })
      .subscribe({
        next: (data: any) => {
          this.setFormUsuario(data.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Datos encontrados',
            detail: 'Se obtuvo la información de la persona',
          });
        },
        error: error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Problema al obtener datos',
            detail:
              'No se pudo obtener la información de la persona. Por favor ingrese los datos manualmente.',
          });
          this.formUsuario.reset({
            iTipoIdentId: 1,
            cPersSexo: 'M',
          });
          console.error('Error obteniendo datos:', error);
        },
      });
  }

  setFormUsuario(item: any) {
    this.formUsuario.get('iPersId')?.setValue(item?.iPersId);
    this.formUsuario.get('cPersDocumento')?.setValue(item?.cPersDocumento);
    this.formUsuario.get('cPersNombre')?.setValue(item?.cPersNombre);
    this.formUsuario.get('cPersPaterno')?.setValue(item?.cPersPaterno);
    this.formUsuario.get('cPersMaterno')?.setValue(item?.cPersMaterno);
    this.formUsuario.get('cPersSexo')?.setValue(item?.cPersSexo);
    this.formUsuario.get('dPersNacimiento')?.setValue(item?.dPersNacimiento);
    this.formUsuario.get('cPersTelefono')?.setValue(item?.cPersTelefono);
    this.formUsuario.get('cPersCorreo')?.setValue(item?.cPersCorreo);
  }

  registrarUsuario() {
    this.usuariosService.registrarUsuario(this.formUsuario.value).subscribe({
      next: (data: any) => {
        this.usuarioRegistradoEvent.emit(data.data);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: data.message,
        });
      },
      error: error => {
        console.error('Error validando persona:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message,
        });
      },
    });
  }
}
