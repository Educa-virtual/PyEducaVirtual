import { PrimengModule } from '@/app/primeng.module';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar-primeng',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './toolbar-primeng.component.html',
  styleUrl: './toolbar-primeng.component.scss',
})
export class ToolbarPrimengComponent {
  @Input() title: string = '';
  @Input() className: string = 'text-2xl';
  @Input() butons: { label: string; icon?: string; class?: string; action: () => void }[] = [];
}
