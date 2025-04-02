import { 
  Component, 
  OnInit, 
  ViewChild,
  ElementRef,
  Injector
} from '@angular/core';

import { FiscalBaseComponent } from '../fiscal-base/fiscal-base.component';
import { AnimationOptions } from 'ngx-lottie';

@Component({
    selector: 'app-fiscal-document-card',
    templateUrl: './fiscal-document-card.component.html',
    styleUrls: ['./fiscal-document-card.component.scss'],
    standalone: false
})
export class FiscalDocumentCardComponent extends FiscalBaseComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('fiscalDocument') fiscalDocument!: ElementRef;


  fileSize = '0KB';
  draggingToCard: boolean = false;
  dropLottie: AnimationOptions = {
    path:'/assets/images/fiscal-documents/folder.json',
  }

  showMenu: boolean = false;
  showCheckmarkComponent: boolean = false;

  addFileEventListeners =  {
    dragOver: ( event: DragEvent ) => {
      this.draggingToCard = true;
      event.preventDefault();
      this.fiscalDocument.nativeElement.classList.add('dragging-file');
    },

    dragLeave: ( event: DragEvent ) => {
      event.preventDefault();
      this.draggingToCard = false;
      this.fiscalDocument.nativeElement.classList.remove('dragging-file');

    },

    drop: ( event: any ) => {
      event.preventDefault();
      this.removeDragFileEventListener();
      const { files } = event.dataTransfer;
      this.draggingToCard = false;
      this.fiscalDocument.nativeElement.classList.remove('dragging-file');
      this.uploadFile(files[0]);

    }
  }

  fileUploadedEventListeners = {
    dragOver: ( event: any ) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'none';

    }
  }

  constructor(
    injector: Injector
) { 
  super(injector)
}






  ngOnInit(): void {
  }

  addDragFileEventListener():void{

    this.removeFileUploadedEventListeners();

    const card = this.fiscalDocument.nativeElement;

    card.addEventListener("dragover", this.addFileEventListeners.dragOver);
    card.addEventListener('dragleave', this.addFileEventListeners.dragLeave);
    card.addEventListener('drop', this.addFileEventListeners.drop);

  }

  removeDragFileEventListener():void{

    this.addFileUploadedEventListeners();

    const card = this.fiscalDocument.nativeElement;

    card.removeEventListener("dragover", this.addFileEventListeners.dragOver);
    card.removeEventListener('dragleave', this.addFileEventListeners.dragLeave);
    card.removeEventListener('drop', this.addFileEventListeners.drop);

  }

  addFileUploadedEventListeners():void{

    const card = this.fiscalDocument.nativeElement;

    card.addEventListener('dragover', this.fileUploadedEventListeners.dragOver);


  }

  removeFileUploadedEventListeners():void{

    const card = this.fiscalDocument.nativeElement;

    card.removeEventListener('dragover', this.fileUploadedEventListeners.dragOver);

  }

  onCardClicked(){
    if(!this.fileInfo.fileIsSelected){
      this.fileInput.nativeElement.click();
    }
    else if(!this.fileInfo.uploadFileStatus?.documentIsBeingUploaded){
      this.openFile();
    }
  } 


  afterFileUploaded = ():Promise<void> => {
    this.showCheckmarkComponent = true;
    return new Promise( ( resolve ) => {
      setTimeout(() => {
        console.log(' afterFileUploadedwaited 2 secs b4 moving on');
        this.showCheckmarkComponent = false;
        resolve();
      },2000);
    });
  }

  ngAfterViewInit():void{

    if(!this.fileInfo.fileIsSelected){
      this.addDragFileEventListener();
    }else{
      this.addFileUploadedEventListeners();
    }

    this.onFileDeleted.subscribe(() => {
      this.addDragFileEventListener();
    });
    
  }


  showOptionsMenu(event: MouseEvent ):void{
    event.stopPropagation();
    this.showMenu = true;

    document.addEventListener('click', () => {
      this.showMenu = false;
    },{
      capture : true,
      once: true,
    });

  }

  fileInputChanged(){
    const { files }   = this.fileInput.nativeElement;
    this.uploadFile(files[0]);
  }

  showFileUploadedAnimation(){
    this.showCheckmarkComponent = true;
  }

}
