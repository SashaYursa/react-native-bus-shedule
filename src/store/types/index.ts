export interface IBusStations {
  id: number;
  linkToSheduleBoard: string;
  stationName: string;
  stationLink: string;
  stationPhoneNumber: string;
  stationAddress: string;
  stationLastUpdate: string;
  last_updated_at: string;
}
export interface ISheduleItem {
  arrival: string;
  busInfo: string;
  busOwner: string;
  busRoute: string;
  cost: string;
  departure: string;
  emptyPlaces: number;
  id: number;
  routeLink: string;
  ticketsStatus: string;
  updated_At: string;
}
export interface IBusRoute {
  bus: ISheduleItem;
  route: {
    dates: [[string | null]];
    points: [
      {
        arrivalTime: number;
        departureTime: number | null;
        pointName: string;
        isStation: boolean;
        kilometresFromStation: number | null;
        cost: number | null;
      },
    ];
  } | null;
}
