import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDashboardService {
  public centerMap = new Subject();
  public clearMap = new Subject<void>();
  public getFleetDetails = new Subject<boolean>();
  public toggleTraffic = new Subject();

  // polygons
  public getCoordinates = new Subject<void>();
  public reloadPolygons = new Subject<void>();
  public clearedFilter = new Subject<void>();
  public clearFilter = new Subject<void>();

  public userRole: number | null = null;
  public showFleetMap = true;
  public showPolygons = true;
  public activeFilter: boolean = false;
  public openOrderMenu: boolean = false;

  public haveNotFleetMembers = false;
  public haveFleetMembersErrors: string[] = [];
  public centerRouteMap = new Subject<void>();

  constructor() {}
}
