export interface Unit {
	id?: string;
	title: string;
	description: string;
	location: Location;
	rentAmount: number;
	rooms: number;
	status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
	photos?: string[];
	amenities?: string[];
}

export interface Location {
	address: string;
	city: string;
	province: string;
	zipCode: string;
	country: string;
}
