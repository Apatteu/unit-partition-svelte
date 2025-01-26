import { browser } from '$app/environment';

interface Payment {
	id: string;
	amount: number;
	dueDate: string;
	status: 'PENDING' | 'PAID' | 'OVERDUE';
	bookingId?: string;
}

interface DuePaymentsResponse {
	payments: Payment[];
	totalDue: number;
	message?: string;
}

interface PaymentSummaryResponse {
	totalProperties: number;
	totalPayments: number;
	pendingPayments: number;
	overduePayments: number;
	paidPayments: number;
	totalAmountDue: number;
}

class PaymentService {
	private baseUrl = 'http://localhost:3000/api/payments';
	private token: string | null = null;

	constructor() {
		if (browser) {
			this.token = localStorage.getItem('token');
		}
	}

	private async fetchWithAuth(url: string, options: RequestInit = {}) {
		if (!this.token) {
			throw new Error('No authentication token found');
		}

		const headers = new Headers({
			...options.headers,
			Authorization: `Bearer ${this.token}`,
			'Content-Type': 'application/json'
		});

		try {
			const response = await fetch(url, {
				...options,
				headers
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
			}

			return response.json();
		} catch (error) {
			console.error('API Error:', error);
			throw error;
		}
	}

	async getDuePayments(): Promise<DuePaymentsResponse> {
		return this.fetchWithAuth(`${this.baseUrl}/due`);
	}

	async markPaymentAsPaid(paymentId: string): Promise<Payment> {
		return this.fetchWithAuth(`${this.baseUrl}/${paymentId}/pay`, {
			method: 'PATCH'
		});
	}

	async getDuePaymentsThisMonth(): Promise<{
		totalDuePayments: number;
		payments: Payment[];
		totalAmountDue: number;
	}> {
		return this.fetchWithAuth(`${this.baseUrl}/due-this-month`);
	}

	async getPaymentSummary(): Promise<PaymentSummaryResponse> {
		return this.fetchWithAuth(`${this.baseUrl}/payment-summary`);
	}
}

export const paymentService = new PaymentService();
