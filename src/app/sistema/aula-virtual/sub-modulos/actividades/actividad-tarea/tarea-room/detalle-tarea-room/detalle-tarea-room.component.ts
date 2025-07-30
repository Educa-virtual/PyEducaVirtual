import { PrimengModule } from '@/app/primeng.module';
import { EmptySectionComponent } from '@/app/shared/components/empty-section/empty-section.component';
import { IconComponent } from '@/app/shared/icon/icon.component';
import { ToolbarPrimengComponent } from '@/app/shared/toolbar-primeng/toolbar-primeng.component';
import { Component, Input, OnChanges } from '@angular/core';
import { RecursosListaComponent } from '@/app/shared/components/recursos-lista/recursos-lista.component';

@Component({
  selector: 'app-detalle-tarea-room',
  standalone: true,
  imports: [
    ToolbarPrimengComponent,
    PrimengModule,
    IconComponent,
    EmptySectionComponent,
    RecursosListaComponent,
  ],
  templateUrl: './detalle-tarea-room.component.html',
  styleUrl: './detalle-tarea-room.component.scss',
})
export class DetalleTareaRoomComponent implements OnChanges {
  @Input() data: any = {};
  @Input() isDocente: boolean = false;

  ngOnChanges(changes) {
    if (changes.data?.currentValue) {
      this.data = changes.data.currentValue;
    }
    if (changes.isDocente?.currentValue) {
      this.isDocente = changes.isDocente.currentValue;
    }
  }

  getListFiles(files) {
    if (files === null || files === undefined || files === '') {
      return [];
    }

    if (typeof files === 'string') {
      return JSON.parse(files);
    }

    if (typeof files === 'object') {
      return files;
    }
    return [];
  }
}
