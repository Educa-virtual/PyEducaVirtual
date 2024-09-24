import { Component } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-access',
    templateUrl: './access.component.html',
    standalone: true,
    imports: [ButtonDirective, RouterLink],
})
export class AccessComponent { }
