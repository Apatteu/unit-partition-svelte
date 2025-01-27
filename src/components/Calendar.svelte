<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	interface Payment {
		id: string;
		tenantName: string;
		unitTitle: string;
		amount: number;
		dueDate: Date;
		status: 'PENDING' | 'PAID' | 'OVERDUE';
	}

	class CalendarDate {
		date: Date;
		payments: Payment[];
		isCurrentMonth: boolean;
		isToday: boolean;

		constructor(date: Date, payments: Payment[], isCurrentMonth: boolean) {
			this.date = date;
			this.payments = payments.filter((p) => this.isSameDay(p.dueDate, date));
			this.isCurrentMonth = isCurrentMonth;
			this.isToday = this.isSameDay(date, new Date());
		}

		isSameDay(date1: Date, date2: Date): boolean {
			return (
				date1.getFullYear() === date2.getFullYear() &&
				date1.getMonth() === date2.getMonth() &&
				date1.getDate() === date2.getDate()
			);
		}
	}

	let payments: Payment[] = [];
	let selectedDatePayments: Payment[] = [];
	let showModal = false;
	let selectedDate: Date | null = null;
	let currentMonth: Date = new Date();

	let calendarDays: CalendarDate[] = [];

	async function fetchRentPayments() {
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				goto('/signin');
				return;
			}

			const response = await fetch('http://localhost:3000/api/payments/due-this-month', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

			if (response.status === 401) {
				goto('/signin');
				return;
			}

			const data = await response.json();
			if (data.payments.length === 0) {
				console.log('No payments due this month.');
				payments = [];
				return;
			}

			payments = data.payments.map((payment: any) => ({
				id: payment.id,
				tenantName: `${payment.booking.tenant.profile.firstName} ${payment.booking.tenant.profile.lastName}`,
				unitTitle: payment.booking.unit.title,
				amount: payment.amount,
				dueDate: new Date(payment.dueDate),
				status: payment.status
			}));

			generateCalendar();
		} catch (error) {
			console.error('Failed to fetch rent payments:', error);
			payments = [];
			generateCalendar();
			goto('/signin');
		}
	}

	function generateCalendar() {
		const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
		const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

		calendarDays = [];

		const startingDay = firstDayOfMonth.getDay();

		for (let i = 0; i < startingDay; i++) {
			const prevMonthDate = new Date(
				currentMonth.getFullYear(),
				currentMonth.getMonth(),
				-startingDay + i + 1
			);
			calendarDays.push(new CalendarDate(prevMonthDate, payments, false));
		}

		for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
			const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
			calendarDays.push(new CalendarDate(date, payments, true));
		}

		const totalDays = calendarDays.length;
		const remainingDays = 42 - totalDays;
		for (let i = 1; i <= remainingDays; i++) {
			const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i);
			calendarDays.push(new CalendarDate(nextMonthDate, payments, false));
		}
	}

	function handleDateClick(date: Date) {
		selectedDate = date;
		selectedDatePayments = payments.filter((payment) => isSameDay(payment.dueDate, date));
		showModal = selectedDatePayments.length > 0;
	}

	function isSameDay(date1: Date, date2: Date): boolean {
		return (
			date1.getFullYear() === date2.getFullYear() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getDate() === date2.getDate()
		);
	}

	function closeModal() {
		showModal = false;
		selectedDatePayments = [];
		selectedDate = null;
	}

	function changeMonth(direction: 'prev' | 'next') {
		currentMonth = new Date(
			currentMonth.getFullYear(),
			direction === 'prev' ? currentMonth.getMonth() - 1 : currentMonth.getMonth() + 1,
			1
		);
		generateCalendar();
	}

	onMount(() => {
		generateCalendar();

		fetchRentPayments();
	});
</script>

<div class="rent-payment-calendar">
	<div class="calendar-header">
		<button on:click={() => changeMonth('prev')}>←</button>
		<h2>
			{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
		</h2>
		<button on:click={() => changeMonth('next')}>→</button>
	</div>

	<div class="calendar-weekdays">
		{#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as day}
			<div class="weekday">{day}</div>
		{/each}
	</div>

	<div class="calendar-grid">
		{#each calendarDays as calDay}
			<button
				type="button"
				class="calendar-day"
				class:other-month={!calDay.isCurrentMonth}
				class:today={calDay.isToday}
				class:has-payment={calDay.payments.length > 0}
				aria-label={`Day ${calDay.date.getDate()}${calDay.payments.length > 0 ? ', with payments' : ''}`}
				on:click={() => handleDateClick(calDay.date)}
			>
				<span class="day-number">{calDay.date.getDate()}</span>
				{#if calDay.payments.length > 0}
					<span class="payment-dot" aria-hidden="true"></span>
				{/if}
			</button>
		{/each}
	</div>

	{#if showModal}
		<dialog open class="modal-overlay" on:close={closeModal}>
			<div class="modal-content">
				<h2>Rent Payments on {selectedDate?.toLocaleDateString()}</h2>
				<div class="payment-list">
					{#each selectedDatePayments as payment}
						<div class="payment-item">
							<div class="payment-header">
								<h3>{payment.tenantName}</h3>
								<span class={`status ${payment.status.toLowerCase()}`}>
									{payment.status}
								</span>
							</div>
							<div class="payment-details">
								<p>Unit: {payment.unitTitle}</p>
								<p>Amount Due: ${payment.amount.toFixed(2)}</p>
							</div>
						</div>
					{/each}
				</div>
				<button class="close-btn" on:click={closeModal} type="button">Close</button>
			</div>
		</dialog>
	{/if}
</div>

<style>
	.rent-payment-calendar {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		grid-row: span 2;
		height: 100%;
		width: 100%;
		padding: 20px;
	}

	.calendar-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.calendar-header button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
	}

	.calendar-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		text-align: center;
		font-weight: bold;
		margin-bottom: 10px;
	}

	.calendar-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 5px;
	}

	.calendar-day {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		padding: 10px;
		text-align: center;
		position: relative;
		cursor: pointer;
		transition: background-color 0.3s ease;
		height: 100px;
	}

	.calendar-day:hover {
		background-color: #f0f0f0;
	}

	.calendar-day.other-month {
		color: #c0c0c0;
	}

	.calendar-day.today {
		border: 2px solid #4caf50;
	}

	.calendar-day.has-payment {
		background-color: rgba(76, 175, 80, 0.1);
	}

	.payment-dot {
		position: absolute;
		bottom: 5px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 6px;
		background-color: #4caf50;
		border-radius: 50%;
	}

	/* Modal styles from previous component remain the same */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: white;
		border-radius: 12px;
		padding: 20px;
		width: 400px;
		max-height: 500px;
		overflow-y: auto;
	}

	.payment-item {
		background-color: #f4f4f4;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 10px;
	}

	.payment-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
	}

	.status {
		padding: 5px 10px;
		border-radius: 4px;
		font-size: 0.8rem;
		text-transform: uppercase;
	}

	.status.pending {
		background-color: #ffc107;
		color: white;
	}

	.status.paid {
		background-color: #4caf50;
		color: white;
	}

	.status.overdue {
		background-color: #f44336;
		color: white;
	}

	.close-btn {
		width: 100%;
		padding: 10px;
		background-color: #f0f0f0;
		border: none;
		border-radius: 8px;
		margin-top: 15px;
		cursor: pointer;
	}
</style>
