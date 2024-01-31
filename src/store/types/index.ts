export interface IBusStations {
	id: number;
	linkToSheduleBoard: string | null;
	stationName: string;
	stationLink: string | null;
	stationPhoneNumber: null;
	stationAddress: string | null;
	latitude: number | null;
	longitude: number | null;
	stationLastUpdate: string | null;
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
export interface IBusStationShedule {
	buses: ISheduleItem[];
	station: IBusStations;
}
export interface IBusRoute {
	bus: ISheduleItem;
	route: {
		dates: {
			id: number;
			dates: [[string | null]];
			last_updated_at: string | null;
		};
		points: point[];
	} | null;
}

export type point = {
	id: number;
	departureTime: string | null;
	arrivalTime: string | null;
	kilometresFromStation: number | null;
	cost: number | null;
	fullAddress: string | null;
	latitude: number | null;
	longitude: number | null;
	last_updated_at: string;
	station: IBusStations;
};
