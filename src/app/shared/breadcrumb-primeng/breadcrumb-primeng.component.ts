import { Router, RouterLink } from '@angular/router'
import { Component, OnInit } from '@angular/core'
import { CommonModule, NgFor } from '@angular/common'
import { MenuService } from '@/app/layout/app.menu.service'
import { ConstantesService } from '@/app/servicios/constantes.service'

@Component({
    selector: 'app-breadcrumb-primeng',
    standalone: true,
    imports: [NgFor, CommonModule, RouterLink],
    templateUrl: './breadcrumb-primeng.component.html',
    styleUrl: './breadcrumb-primeng.component.scss',
})
export class BreadcrumbPrimengComponent implements OnInit {
    name: string
    menu: Array<any> = []
    breadcrumbList: Array<any> = []

    constructor(
        private _router: Router,
        private menuService: MenuService,
        private ConstantesService: ConstantesService
    ) {}

    ngOnInit() {
        this.menu = this.ConstantesService.getMenu()
        // this.listenRouting();
    }

    // listenRouting() {
    //   let routerUrl: string, routerList: Array<any>, target: any;
    //   this._router.events.subscribe((router: any) => {

    //     routerUrl = router.urlAfterRedirects;

    //     if (routerUrl && typeof routerUrl === 'string') {
    //       target = this.menu;

    //       target.filter((i) => {
    //         i.items.filter((j) => {
    //           this.breadcrumbList.push({
    //             name: j.label,

    //             path: i.routerLink
    //           });
    //         })
    //       })

    //       // this.breadcrumbList.length = 0;
    //       // routerList = routerUrl.slice(1).split('/');
    //       // console.log(routerList)
    //       // routerList.forEach((router,index)=>{
    //       //   console.log(router,index)
    //       // })
    //       // routerList.forEach((router, index) => {

    //       //   target = target.find(page => page.path.slice(2) === router);

    //       //   this.breadcrumbList.push({
    //       //     name: target.name,

    //       //     path: (index === 0) ? target.path : `${this.breadcrumbList[index-1].path}/${target.path.slice(2)}`
    //       //   });

    //       //   if (index+1 !== routerList.length) {
    //       //     target = target.children;
    //       //   }
    //       // });

    //       console.log(this.breadcrumbList);
    //     }
    //   });
    // }
}
