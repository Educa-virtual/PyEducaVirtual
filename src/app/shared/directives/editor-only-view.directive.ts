import { Directive, ElementRef, Host, inject } from '@angular/core'
import { Editor } from 'primeng/editor'

@Directive({
    selector: '[appEditorOnlyView]',
    standalone: true,
})
export class EditorOnlyViewDirective {
    private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef)

    editorModules = {
        toolbar: false,
    }

    constructor(@Host() private pEditor: Editor) {
        if (this.pEditor) {
            this.pEditor.readonly = true
            this.pEditor.modules = this.editorModules
        }
    }
}
