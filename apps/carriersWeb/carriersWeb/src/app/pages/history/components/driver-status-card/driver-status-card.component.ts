import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
@Component({
    selector: 'app-driver-status-card',
    templateUrl: './driver-status-card.component.html',
    styleUrls: ['./driver-status-card.component.scss'],
    standalone: false
})
export class DriverStatusCardComponent implements OnInit {

  @Input() orderData: any = {};
  @Input() title: string = '';

  @Output() editOrder = new EventEmitter<void>();
  
  public orderCreated: boolean = false;
  public orderAccepted: boolean = false;
  public pickupStarted: boolean = false;
  public eta: number = 0;
  public calculateETA: Date;

  constructor(
    private router: Router,
    private webService: AuthService

  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {

  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if(changes.orderData){
      if(this.orderData) {
        const {pickup, dropoff} = this.orderData;
        if(pickup && dropoff){

          const payload = {
            pickup: {
              lat: pickup.lat,
              lng: pickup.lng
            },
            dropoff:{
              lat: dropoff.lat,
              lng: dropoff.lng
            }
          };


        (await this.webService.apiRest(JSON.stringify(payload), 'orders/calculate_ETA')).subscribe(({result})=>{
          this.calculateETA= pickup.startDate + result.ETA;

        });
        }


      }    
    }
  }

  public sendIdForTrackingOrder(): void {
    this.router.navigate(['/tracking'], {
      state: {
        order_id: this.orderData._id
      }
    })
  }

  public canTrack(isPickup?: boolean): boolean {
    const { version, status } = this.orderData;

    if (version === 'v2.0.0') {
      return status < 3;
    }

    return this.title === 'pickup'
      ? status >= 2 && status < 3
      : status >= 4 && status < 5;
  }
}
