import { PrimengModule } from '@/app/primeng.module';
import {
  Component,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  AfterViewInit,
  OnDestroy,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import Konva from 'konva';

type Tool = 'pen' | 'rect' | 'circle' | 'eraser' | 'select' | 'text';

@Component({
  selector: 'app-pizarra-digital',
  standalone: true,
  imports: [FormsModule, PrimengModule],
  templateUrl: './pizarra-digital.component.html',
  styleUrls: ['./pizarra-digital.component.scss'], // nota: styleUrls (plural)
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PizarraDigitalComponent),
      multi: true,
    },
  ],
})
export class PizarraDigitalComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('stageHost', { static: true }) stageHost!: ElementRef<HTMLDivElement>;

  private stage!: Konva.Stage;
  private layer!: Konva.Layer;
  private currentLine?: Konva.Line;
  private currentShape?: Konva.Shape;
  private isDrawing = false;
  private startPos = { x: 0, y: 0 };
  private eraserCursor?: Konva.Circle;
  private currentTextarea?: HTMLTextAreaElement;

  tool: Tool = 'pen';
  strokeColor = '#000000';
  strokeWidth = 3;
  textInput = '';
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    const container = this.stageHost.nativeElement;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.stage = new Konva.Stage({
      container: container,
      width,
      height,
      draggable: false,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.attachEvents();

    // 🔹 Dibuja fondo y cuadrícula
    this.drawBackgroundAndGrid();

    // permitir editar texto existente con doble click/double tap
    this.stage.on('dblclick dbltap', e => {
      const shape = e.target as Konva.Shape;
      if (shape && shape.getClassName && shape.getClassName() === 'Text') {
        const textNode = shape as Konva.Text;

        // 🔹 Desactivar arrastre mientras se edita
        textNode.draggable(false);

        this.openTextareaForTextNode(textNode);

        // 🔹 Cuando termine edición, devolver arrastre si la herramienta actual es select
        this.currentTextarea?.addEventListener('blur', () => {
          textNode.draggable(this.tool === 'select');
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
      document.body.removeChild(this.currentTextarea);
      this.currentTextarea = undefined;
    }
    this.stage.destroy();
  }

  writeValue(value: any): void {
    if (!value) return;

    try {
      const json = typeof value === 'string' ? JSON.parse(value) : value;

      // Limpiar layer actual
      this.layer.destroyChildren();

      // Crear nodos desde JSON
      const nodes = Konva.Node.create(json, this.stage.container() as HTMLElement);

      // Agregar nodos válidos
      if (nodes instanceof Konva.Stage || nodes instanceof Konva.Layer) {
        nodes.getChildren().forEach((child: any) => {
          if (
            child instanceof Konva.Shape ||
            child instanceof Konva.Group ||
            child instanceof Konva.Text
          ) {
            this.layer.add(child);
            this.enableEditing(child); // 🔹 aplicar edición
          }
        });
      }

      this.layer.draw();

      // 🔹 Reaplicar tool actual a todos los nodos restaurados
      this.setTool(this.tool);
    } catch (e) {
      console.error('Error restaurando dibujo:', e);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (!this.stage) return;
    this.stage.listening(!isDisabled);
  }

  private propagateChanges() {
    const json = this.layer.toJSON(); // <- Solo la layer
    this.onChange(json);
  }

  private initStage() {
    const container = this.stageHost.nativeElement;
    this.stage = new Konva.Stage({
      container,
      width: container.clientWidth || 800,
      height: container.clientHeight || 600,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  private applyToolToNode(node: any) {
    if (node instanceof Konva.Group) {
      node.getChildren().forEach((child: any) => this.applyToolToNode(child));
      node.draggable(this.tool === 'select');
    } else if (node instanceof Konva.Text) {
      node.draggable(this.tool === 'select');
    } else if (node instanceof Konva.Shape) {
      node.draggable(this.tool === 'select');
    }
  }

  setTool(t: Tool) {
    this.tool = t;
    if (t === 'select') {
      this.stage.draggable(false);
    } else {
      this.stage.draggable(false);
    }
    this.layer.getChildren().forEach(node => this.applyToolToNode(node));

    // cursor y eraser
    if (t === 'eraser') {
      this.stage.container().style.cursor = 'none';
      if (!this.eraserCursor) {
        this.eraserCursor = new Konva.Circle({
          radius: this.strokeWidth * 2,
          fill: 'rgba(200,200,200,0.3)',
          stroke: '#999',
          strokeWidth: 1,
          listening: false,
        });
        this.layer.add(this.eraserCursor);
        this.layer.draw();
      }
      this.stage.on('mousemove.eraser', () => {
        const pos = this.getPointerPos();
        if (pos && this.eraserCursor) {
          this.eraserCursor.position(pos);
          this.layer.batchDraw();
        }
      });
    } else {
      this.stage.container().style.cursor = 'default';
      if (this.eraserCursor) {
        this.eraserCursor.destroy();
        this.eraserCursor = undefined;
      }
      this.stage.off('mousemove.eraser');
    }
  }

  private attachEvents() {
    this.stage.on('mousedown touchstart', () => this.onPointerDown());
    this.stage.on('mousemove touchmove', () => this.onPointerMove());
    this.stage.on('mouseup touchend', () => {
      this.onPointerUp();
      this.propagateChanges();
    });
  }

  private getPointerPos() {
    return this.stage.getPointerPosition() || { x: 0, y: 0 };
  }

  private onPointerDown() {
    const pos = this.stage.getPointerPosition();
    if (!pos) return;
    this.isDrawing = true;
    this.startPos = pos;

    if (this.tool === 'pen' || this.tool === 'eraser') {
      const color = this.tool === 'eraser' ? '#ffffff' : this.strokeColor;
      const width = this.tool === 'eraser' ? this.strokeWidth * 4 : this.strokeWidth;

      this.currentLine = new Konva.Line({
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth: width,
        lineCap: 'round',
        lineJoin: 'round',
        globalCompositeOperation: this.tool === 'eraser' ? 'destination-out' : undefined,
      });
      this.layer.add(this.currentLine);
    } else if (this.tool === 'rect') {
      this.currentShape = new Konva.Rect({
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
      this.layer.add(this.currentShape);
    } else if (this.tool === 'circle') {
      this.currentShape = new Konva.Circle({
        x: pos.x,
        y: pos.y,
        radius: 0,
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
      });
      this.layer.add(this.currentShape);
    } else if (this.tool === 'text') {
      // CREAR texto con valor inicial (opcional) para que tenga dimensiones
      const initialText = this.textInput?.trim() ? this.textInput : '';
      const textNode = new Konva.Text({
        x: pos.x,
        y: pos.y,
        text: initialText,
        fontSize: 20,
        fill: this.strokeColor,
        draggable: true,
      });
      this.layer.add(textNode);
      this.layer.draw();

      // abrir textarea (pos = coordenadas del stage)
      this.openTextareaForTextNode(textNode, pos);

      // no dejamos isDrawing en true (no es un trazo continuo)
      this.isDrawing = false;
    }

    this.layer.draw();
  }

  private onPointerMove() {
    if (!this.isDrawing) return;
    const pos = this.getPointerPos();

    if (this.tool === 'pen' || this.tool === 'eraser') {
      if (!this.currentLine) return;
      const newPoints = this.currentLine.points().concat([pos.x, pos.y]);
      this.currentLine.points(newPoints);
    } else if (
      this.tool === 'rect' &&
      this.currentShape &&
      this.currentShape instanceof Konva.Rect
    ) {
      const x = Math.min(this.startPos.x, pos.x);
      const y = Math.min(this.startPos.y, pos.y);
      const w = Math.abs(pos.x - this.startPos.x);
      const h = Math.abs(pos.y - this.startPos.y);
      this.currentShape.position({ x, y });
      this.currentShape.width(w);
      this.currentShape.height(h);
    } else if (
      this.tool === 'circle' &&
      this.currentShape &&
      this.currentShape instanceof Konva.Circle
    ) {
      const dx = pos.x - this.startPos.x;
      const dy = pos.y - this.startPos.y;
      const r = Math.sqrt(dx * dx + dy * dy);
      this.currentShape.radius(r);
    }
    this.layer.batchDraw();
  }

  private onPointerUp() {
    this.isDrawing = false;
    this.currentLine = undefined;
    this.currentShape = undefined;
  }

  clearCanvas() {
    this.layer.destroyChildren();
    this.drawBackgroundAndGrid();
  }

  exportPNG() {
    const dataUrl = this.stage.toDataURL({ pixelRatio: 2 });
    const w = window.open('', '_blank');
    if (w) {
      const img = new Image();
      img.src = dataUrl;
      w.document.body.style.margin = '0';
      w.document.body.appendChild(img);
    } else {
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'whiteboard.png';
      a.click();
    }
  }

  // --- helpers para edición de texto in-place ---
  private openTextareaForTextNode(textNode: Konva.Text, stagePos?: { x: number; y: number }) {
    // cerrar textarea previo si existe
    if (this.currentTextarea) {
      try {
        document.body.removeChild(this.currentTextarea);
      } catch {
        /* empty */
      }
      this.currentTextarea = undefined;
    }

    const pos = stagePos ?? { x: textNode.x(), y: textNode.y() };

    // bounding rect del contenedor Konva (relativo a viewport)
    const stageBox = this.stage.container().getBoundingClientRect();
    const areaX = stageBox.left + window.scrollX + pos.x;
    const areaY = stageBox.top + window.scrollY + pos.y;

    const textarea = document.createElement('textarea');
    textarea.value = textNode.text() || '';
    textarea.style.position = 'absolute';
    textarea.style.top = areaY + 'px';
    textarea.style.left = areaX + 'px';
    textarea.style.minWidth = '120px';
    textarea.style.width = '220px';
    textarea.style.minHeight = '24px';
    textarea.style.fontSize = (textNode.fontSize() || 20) + 'px';
    textarea.style.border = '1px solid rgba(0,0,0,0.2)';
    textarea.style.padding = '4px';
    textarea.style.zIndex = '999999';
    textarea.style.background = 'white';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.color = (textNode.fill() as string) || '#000';
    textarea.style.fontFamily = (textNode.fontFamily && textNode.fontFamily()) || 'inherit';

    // Evitar que Konva capture los eventos del textarea
    textarea.addEventListener('mousedown', e => e.stopPropagation());
    textarea.addEventListener('touchstart', e => e.stopPropagation());

    document.body.appendChild(textarea);
    this.currentTextarea = textarea;

    // forzar focus en siguiente tick para evitar problemas de captura de eventos
    setTimeout(() => {
      textarea.focus();
      textarea.select();
    }, 0);

    // ajustar si sale del viewport
    setTimeout(() => {
      const rect = textarea.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        textarea.style.left = Math.max(8, areaX - rect.width) + 'px';
      }
      if (rect.bottom > window.innerHeight) {
        textarea.style.top = Math.max(8, areaY - rect.height) + 'px';
      }
    }, 0);

    const finish = () => {
      const newText = textarea.value;
      if (!newText.trim()) {
        // si está vacío, borramos el nodo para no dejar texto invisible
        textNode.destroy();
      } else {
        textNode.text(newText);
        textNode.fill(this.strokeColor); // mantener color actual
      }
      this.layer.draw();
      if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
        document.body.removeChild(this.currentTextarea);
      }
      this.currentTextarea = undefined;
    };

    const cancel = () => {
      if (this.currentTextarea && document.body.contains(this.currentTextarea)) {
        document.body.removeChild(this.currentTextarea);
      }
      this.currentTextarea = undefined;
      // si quieres borrar nodo creado cuando cancela y quedó vacío:
      if (!textNode.text()) {
        textNode.destroy();
        this.layer.draw();
      }
    };

    // Enter guarda; Esc cancela; blur guarda
    const keyHandler = (ev: KeyboardEvent) => {
      if (ev.key === 'Enter') {
        ev.preventDefault();
        finish();
      } else if (ev.key === 'Escape') {
        cancel();
      }
    };

    textarea.addEventListener('keydown', keyHandler);
    textarea.addEventListener('blur', finish);
  }

  private drawBackgroundAndGrid() {
    const width = this.stage.width();
    const height = this.stage.height();

    // fondo blanco
    const background = new Konva.Rect({
      x: 0,
      y: 0,
      width,
      height,
      fill: '#ffffff',
      listening: false,
    });
    this.layer.add(background);

    // cuadrícula ligera
    const gridSize = 20;
    for (let i = 0; i < Math.ceil(width / gridSize); i++) {
      this.layer.add(
        new Konva.Line({
          points: [i * gridSize, 0, i * gridSize, height],
          stroke: '#eee',
          strokeWidth: 1,
          listening: false,
        })
      );
    }
    for (let j = 0; j < Math.ceil(height / gridSize); j++) {
      this.layer.add(
        new Konva.Line({
          points: [0, j * gridSize, width, j * gridSize],
          stroke: '#eee',
          strokeWidth: 1,
          listening: false,
        })
      );
    }

    this.layer.draw();
  }

  private enableEditing(node: Konva.Node) {
    if (node instanceof Konva.Text) {
      node.draggable(this.tool === 'select');

      // asignar doble click para abrir textarea
      node.off('dblclick dbltap'); // quitar handlers previos si existían
      node.on('dblclick dbltap', () => {
        node.draggable(false);
        this.openTextareaForTextNode(node as Konva.Text);
        this.currentTextarea?.addEventListener('blur', () => {
          node.draggable(this.tool === 'select');
        });
      });
    } else if (node instanceof Konva.Shape) {
      node.draggable(this.tool === 'select');
    } else if (node instanceof Konva.Group) {
      node.getChildren().forEach(child => this.enableEditing(child));
      node.draggable(this.tool === 'select');
    }
  }
}
