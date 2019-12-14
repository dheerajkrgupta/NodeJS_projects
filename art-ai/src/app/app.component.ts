import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { AutoDrawService } from './services';
import 'rxjs/add/observable/fromEvent';
declare var fabric: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    private isShowDIve:Boolean = true;

    constructor(
        private autoDrawService: AutoDrawService, private jqueryD: AutoDrawService
    ) { }

    @ViewChild('canvas') canvas;

    fCanvas: any = new fabric.Canvas('c');

    drawSuggestions: Array<object>;
    
    drawObject: Array<object> = [];

    imageAddedToCanvas: Array<object> = [];
	imageLink: String; 

    canvasMouseEventSubscriptions: Subscription[];
    canvasPathEventSubscriptions: Subscription[];

    previousXAxis: number = 0;
    previousYAxis: number = 0;
    currentXAxis: number = 0;
    currentYAxis: number = 0;
    btnText: string = "Resize"

    context;
    pressedAt: number;
    pressing: boolean = false;
    currentShape: Array<number[]>;
    shapes: Array<Array<number[]>> = [];
    intervalLastPosition: number[] = [-1, -1];
    dtop: any = 0;
    dleft: any = 0;
    dwidth: any = 0;
    dheight: any = 0;


    ngOnInit() {
        let drawStroke = 5, drawColor = 'black';
        this.autoDrawService.loadStencils();
        //this.context = this.canvas.nativeElement.getContext('2d');
        this.context = new fabric.Canvas('c');
        this.context.isDrawingMode = true;
        this.context.freeDrawingBrush.color = drawColor;
        this.context.freeDrawingBrush.width = drawStroke;
        //this.context.setDimensions({width: '100%', height: '100%', minHeight: '550px', boxShadow: '0px 4px 8px #000000'}, {cssOnly: true});
        this.context.setDimensions({boxShadow: '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)', borderRadius: '10px'}, {cssOnly: true});
        let mouseEvents = ['mouse:move', 'mouse:down', 'mouse:up', 'mouse:out'];
        let pathEvents = ['path:created'];

        this.canvasMouseEventSubscriptions = mouseEvents.map(
            (mouseEvent: string) => Observable
                .fromEvent(this.context, mouseEvent)
                .subscribe((event: MouseEvent) => this.draw(event, mouseEvent))
        );

        this.canvasPathEventSubscriptions = pathEvents.map(
            (pathEvent: string) => Observable
                .fromEvent(this.context, pathEvent)
                .subscribe((event: any) => this.canvasCreatedPath(event))
        );

        setTimeout(()=>{   
            this.isShowDIve = false;
        }, 1000);

    }

    ngOnDestroy() {
        for (let mouseEventSubscription of this.canvasMouseEventSubscriptions) {
            mouseEventSubscription.unsubscribe();
        }
    }
    canvasCreatedPath(event: any) {
        this.drawObject.push(event.path);
    }
    eraseCanvas() {
        this.shapes = [];
        for (let obj of this.drawObject) {
            this.context.remove(obj);
        }
        this.context.renderAll();
        this.drawObject = [];
    }

    prepareNewShape() {
        this.currentShape = [
            [], // X coordinates
            [], // Y coordinates
            []  // Times
        ];
    }

    storeCoordinates() {
        if (this.intervalLastPosition[0] !== this.previousXAxis && this.intervalLastPosition[1] !== this.previousYAxis) {
            this.intervalLastPosition = [this.previousXAxis, this.previousYAxis];
            this.currentShape = [
                [...this.currentShape[0], this.previousXAxis],
                [...this.currentShape[1], this.previousYAxis],
                [...this.currentShape[2], Date.now() - this.pressedAt]
            ];
        }
    }

    onDrawingMouseDown(mouseEvent: MouseEvent) {
        let highlightStartPoint, drawColorStartingPoint = 'black';
        let mEvent: any;
        mEvent = mouseEvent;
        if (this.btnText == "Resize") {
            this.dheight = 0;
            this.dwidth = 0;
            this.dtop = 0;
            this.dleft = 0;
            this.imageAddedToCanvas = [];
        }
        this.previousXAxis = this.currentXAxis;
        this.previousYAxis = this.currentYAxis;
        this.currentXAxis = mEvent.e.clientX - this.canvas.nativeElement.offsetLeft;
        this.currentYAxis = mEvent.e.clientY - this.canvas.nativeElement.offsetTop;

        this.pressing = true;
        this.pressedAt = Date.now();
        highlightStartPoint = true;
        this.prepareNewShape();
        return window.setInterval(() => this.storeCoordinates(), 9);
    }

    onDrawingMouseMove(mouseEvent: MouseEvent) {
        let drawStroke = 8, drawColor = 'black';
        let mEvent: any;
		
        mEvent = mouseEvent;
        this.previousXAxis = this.currentXAxis;
        this.previousYAxis = this.currentYAxis;
        this.currentXAxis = mEvent.e.clientX - this.canvas.nativeElement.offsetLeft;
        this.currentYAxis = mEvent.e.clientY - this.canvas.nativeElement.offsetTop;
    }

    draw(mouseEvent: MouseEvent, eventType: string) {
        let storeCoordinateInterval;

        if (eventType === 'mouse:down') {
            storeCoordinateInterval = this.onDrawingMouseDown(mouseEvent);
			console.log("mouse:down");
        }

        if (eventType === 'mouse:up' || this.pressing && eventType === 'mouse:out') {
            this.pressing = false;
			
			console.log("mouse:out");
            clearInterval(storeCoordinateInterval);
			this.commitCurrentShape();
        }

        if (eventType === 'mouse:move' && this.pressing) {
			console.log("mouse:move");
            this.onDrawingMouseMove(mouseEvent);
        }
    }

    commitCurrentShape() {
        this.shapes.push(this.currentShape);
        let drawOptions = {
            canvasWidth: this.canvas.nativeElement.width,
            canvasHeight: this.canvas.nativeElement.height
        };

        this.autoDrawService.drawSuggestions(this.shapes, drawOptions)
            .subscribe(suggestions => this.drawSuggestions = suggestions);
    }

    pickSuggestion(source: string) {
        let shape: any

        for (let obj of this.drawObject) {
            shape = obj;
            if (shape.top > this.dtop) {

                this.dtop = shape.top;
            }
            if (shape.left > this.dleft) {

                this.dleft = shape.left;
            }
            if (shape.width > this.dwidth) {

                this.dwidth = shape.width;
            }
            if (shape.height > this.dheight) {

                this.dheight = shape.height;
            }
        }
        this.eraseCanvas();

        let top = this.dtop;
        let left = this.dleft;
        let width = this.dwidth;
        let height = this.dheight;
        let that = this

        for (let img of that.imageAddedToCanvas) {
            that.context.remove(img);
        }  
        that.imageAddedToCanvas = [];
		
		
        fabric.Image.fromURL(source, function (oImg) {
		
			let scale = 300 / oImg.width;
			
			oImg.set({
			left:100,
			top:100,
            scaleX :scale,
			scaleY :scale
            });
			
			
			
          that.context.add(oImg);
          that.imageAddedToCanvas.push(oImg);
      });
	 
       
   }


    toggleDrawing() {
        if (this.btnText == "Resize") {
            this.btnText = "Draw";  
            this.context.isDrawingMode = false;
            for (let mouseEventSubscription of this.canvasMouseEventSubscriptions) {
                mouseEventSubscription.unsubscribe();
            }
        }
        else {
            this.btnText = "Resize";
            this.context.isDrawingMode = true;
            let mouseEvents = ['mouse:move', 'mouse:down', 'mouse:up', 'mouse:out'];
            this.canvasMouseEventSubscriptions = mouseEvents.map(
                (mouseEvent: string) => Observable
                    .fromEvent(this.context, mouseEvent)
                    .subscribe((event: MouseEvent) => this.draw(event, mouseEvent))
            );

        }
    }

    deleteSelectedObject() {

        this.context.remove(this.context.getActiveObject());
    }
	
	    downloadmyImage(e) {
         this.imageLink = this.context.toDataURL('image/png');
    }
	
    RemoveAllObjectCanvas() {
        this.context.clear()
        this.shapes = [];
        this.drawObject = [];
        this.context.renderAll();
    }

}