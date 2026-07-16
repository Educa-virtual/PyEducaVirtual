import { Component } from '@angular/core';
import { PrimengModule } from '@/app/primeng.module';
import { MenuItem } from 'primeng/api';
import { YearService } from '../year.service';

@Component({
  selector: 'app-year-dias',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './year-dias.component.html',
  styleUrl: './year-dias.component.scss',
})
export class YearDiasComponent {
  breadCrumbHome: MenuItem = { label: '', icon: 'pi pi-home' };
  breadCrumbItems: MenuItem[] = [];

  constructor(private yearsService: YearService) {
    this.yearsService.setActiveIndex(2);
  }
}
