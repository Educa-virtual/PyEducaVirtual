import { Component, OnInit } from '@angular/core';
import { Horario } from './interfaces/horario.interface';
import { HorarioService } from './services/horario.service';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem, MessageService } from 'primeng/api';
import { Dia } from './interfaces/dia.interface';
import { LocalStoreService } from '@/app/servicios/local-store.service';

@Component({
  selector: 'app-horario',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './horario.component.html',
  styleUrl: './horario.component.scss',
})
export class HorarioComponent implements OnInit {
  breadCrumbItems: MenuItem[];
  breadCrumbHome: MenuItem;
  raw: Horario[] = [];
  bloques: number[] = [];
  detalleMatricula: string = '';
  iYAcadId = '';
  franjas: { bloque: number; horario: string }[] = [];
  dias: Dia[] = [
    { id: 1, nombre: 'Lunes' },
    { id: 2, nombre: 'Martes' },
    { id: 3, nombre: 'Miércoles' },
    { id: 4, nombre: 'Jueves' },
    { id: 5, nombre: 'Viernes' },
  ];

  constructor(
    private horarioService: HorarioService,
    private messageService: MessageService,
    private store: LocalStoreService
  ) {}

  ngOnInit() {
    this.iYAcadId = this.store.getItem('dremoiYAcadId');
    this.breadCrumbHome = {
      icon: 'pi pi-home',
      routerLink: '/',
    };
    this.breadCrumbItems = [
      {
        label: 'Estudiante',
      },
      {
        label: 'Horario',
      },
    ];
    this.obtenerHorarios();
  }

  obtenerHorarios() {
    this.horarioService.obtenerHorario(this.iYAcadId).subscribe({
      next: (data: any) => {
        this.raw = data.data.horario;
        this.detalleMatricula = `${data.data.matricula.cGradoAbreviacion} ${data.data.matricula.cSeccionNombre} - ${data.data.matricula.cNivelTipoNombre}`;
        this.bloques = Array.from(new Set(this.raw.map(h => h.iBloque))).sort((a, b) => a - b);
        this.franjas = this.bloques.map(b => {
          const h = this.raw.find(x => x.iBloque === b)!;
          const hi = h.tHoraInicio.slice(0, 5);
          const hf = h.tHoraFin.slice(0, 5);
          return { bloque: b, horario: `${hi} - ${hf}` };
        });
      },
      error: error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Problema al obtener horarios',
          detail: error.error.message,
        });
      },
    });
  }

  clase(diaId: number, bloque: number): Horario | null {
    return this.raw.find(h => h.iDiaId == diaId && h.iBloque == bloque) || null;
  }
}
