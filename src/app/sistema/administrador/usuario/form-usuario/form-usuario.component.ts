import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from '@/app/servicios/general.service';

import { LocalStoreService } from '@/app/servicios/local-store.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-usuario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.scss',
})
export class FormUsuarioComponent implements OnInit {
  @Output() respuesta = new EventEmitter(); // emite usuario para registar
  @Input() data; //listao de usuarios

  form_user: FormGroup;
  registro: any;
  perfil: any;

  /* Formulario estudiante */
  sexo: any = [
    {
      label: 'Masculino',
      value: 'M',
    },
    {
      label: 'Femenino',
      value: 'F',
    },
  ];
  mostrarBtn: boolean = false;

  constructor(
    private fb: FormBuilder,
    private query: GeneralService,

    private store: LocalStoreService,
    private messageService: MessageService
  ) {
    this.perfil = this.store.getItem('dremoPerfil');
  }

  ngOnInit() {
    try {
      this.form_user = this.fb.group({
        iPersId: [''],
        iTipoIdentId: [1, [Validators.required]],
        cPersDocumento: [''],
        cPersNombre: ['', [Validators.required]],
        cPersMaterno: [''],
        cPersPaterno: [''],
        cPersSexo: ['M'],
      });
    } catch (error) {
      console.log(error, 'error de variables');
    }
  }

  accionBtn(action: string) {
    if (action === 'validarDocumento') {
      this.validarDocumento();
    }
    if (action === 'generar') {
      this.generarCredenciales();
    }
  }

  generarCredenciales() {
    //console.log(this.registro);
    this.query
      .generarCredencialesIE({
        data: this.registro,
        iSedeId: 0,
        iYAcadId: 0,
        iCredId: this.perfil.iCredId,
        iPerfilId: 0,
        condicion: 'add_credencial',
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'validar persona');
          this.setFormUsuario(data.data);
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Se registro con exito',
          });
        },
        error: error => {
          console.error('Error validando persona:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        },
        complete: () => {
          const data = { visible: false };
          this.respuesta.emit(data);
        },
      });
  }

  validarDocumento() {
    // solo para DNI
    this.query
      .validarPersona({
        iTipoIdentId: this.form_user.get('iTipoIdentId')?.value,
        cPersDocumento: this.form_user.get('cPersDocumento')?.value,
      })
      .subscribe({
        next: (data: any) => {
          console.log(data, 'validar persona');
          this.setFormUsuario(data.data);
          this.registro = data.data;
        },
        error: error => {
          console.error('Error validando persona:', error);
        },
        complete: () => {
          console.log('Request completed');
        },
      });
  }
  setFormUsuario(item: any) {
    this.form_user.get('iTipoIdentId')?.setValue(item?.iTipoIdentId);
    this.form_user.get('cPersDocumento')?.setValue(item?.cPersDocumento);
    this.form_user.get('cPersNombre')?.setValue(item?.cPersNombre);
    this.form_user.get('cPersPaterno')?.setValue(item?.cPersPaterno);
    this.form_user.get('cPersMaterno')?.setValue(item?.cPersMaterno);
  }
}
