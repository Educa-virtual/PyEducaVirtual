import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ConstantesService } from '../servicios/constantes.service';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AppMenuitemComponent } from './app.menuitem.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: true,
    imports: [NgFor, NgIf, AppMenuitemComponent]
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(private router: Router, private ConstantesService: ConstantesService) { }

    ngOnInit() {
        this.model = this.ConstantesService.nav;

        // if (!this.model.length) { this.router.navigate(['./']); }
        // else {
        //     const ruta = this.model[0]['items'][0].routerLink[0]
        //     this.router.navigate([ruta])
        // }

    }
}
