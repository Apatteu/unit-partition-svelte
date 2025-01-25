import type { Unit } from '../types/Unit';

class UnitService {
	private baseUrl = 'http://localhost:3000/api/units';

	async getUnits(filters?: {
		minPrice?: number;
		maxPrice?: number;
		rooms?: number;
		location?: string;
		amenities?: string[];
	}): Promise<Unit[]> {
		const queryParams = new URLSearchParams();
		if (filters) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== undefined) {
					queryParams.append(key, Array.isArray(value) ? value.join(',') : value.toString());
				}
			});
		}

		const response = await fetch(`${this.baseUrl}/me`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		if (!response.ok) {
			throw new Error('Failed to fetch units');
		}
		return response.json();
	}

	async createUnit(unit: Unit, images?: File[]): Promise<Unit> {
		const formData = new FormData();

		// Append unit data
		Object.entries(unit).forEach(([key, value]) => {
			if (value !== undefined) {
				formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
			}
		});

		// Append images
		if (images) {
			images.forEach((image) => {
				formData.append('images', image);
			});
		}

		const response = await fetch(this.baseUrl, {
			method: 'POST',
			body: formData,
			// Include authentication headers if required
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});
		console.log(response);
		if (!response.ok) {
			throw new Error('Failed to create unit');
		}
		return response.json();
	}

	async updateUnit(id: string, unit: Partial<Unit>, images?: File[]): Promise<Unit> {
		const formData = new FormData();

		Object.entries(unit).forEach(([key, value]) => {
			if (value !== undefined) {
				formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
			}
		});

		if (images) {
			images.forEach((image) => {
				formData.append('images', image);
			});
		}

		const response = await fetch(`${this.baseUrl}/${id}`, {
			method: 'PUT',
			body: formData,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`
			}
		});

		if (!response.ok) {
			throw new Error('Failed to update unit');
		}
		return response.json();
	}
}

export default new UnitService();
