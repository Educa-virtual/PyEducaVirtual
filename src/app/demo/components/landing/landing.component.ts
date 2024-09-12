import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonDirective } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    standalone: true,
    imports: [StyleClassModule, ButtonDirective, DividerModule]
})
export class LandingComponent {

    constructor(public layoutService: LayoutService, public router: Router) { }
    
}
