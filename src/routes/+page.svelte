<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import BookingRequests from '../components/BookingRequest.svelte';

	import { page } from '$app/stores';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		Datepicker
	} from 'flowbite-svelte';
	import Calendar from '../components/Calendar.svelte';

	interface UnitStatus {
		AVAILABLE: number;
		OCCUPIED: number;
		MAINTENANCE: number;
	}

	let unitSummary: UnitStatus = {
		AVAILABLE: 0,
		OCCUPIED: 0,
		MAINTENANCE: 0
	};

	async function fetchUnitStatus() {
		try {
			const token = localStorage.getItem('token');

			if (!token) {
				goto('/signin');
				return;
			}

			const response = await fetch('http://localhost:3000/api/units/status', {
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
			unitSummary = data.summary;
		} catch (error) {
			console.error('Failed to fetch unit status:', error);
			goto('/signin');
		}
	}

	onMount(() => {
		fetchUnitStatus();
	});
</script>

<div class="dashboard">
	<div class="left-section">
		<div class="box summary">
			<div class="title">Summary</div>

			<div class="container">
				<div class="card">
					<div class="number-section" style="background-color: #DF6630;">
						{unitSummary.AVAILABLE}
					</div>
					<div class="status-section">
						<i class="fa-solid fa-house-circle-check icon" style="color: #DF6630;"></i>
						<span class="status-text">Available</span>
					</div>
				</div>
				<div class="card">
					<div class="number-section" style="background-color: #C6B796;">
						{unitSummary.OCCUPIED}
					</div>
					<div class="status-section">
						<i class="fa-solid fa-house-circle-xmark icon" style="color: #C6B796;"></i>
						<span class="status-text">Occupied</span>
					</div>
				</div>
				<div class="card">
					<div class="number-section" style="background-color: #AC1F16;">
						{unitSummary.MAINTENANCE}
					</div>
					<div class="status-section">
						<i class="fa-solid fa-house-chimney-user icon" style="color: #AC1F16;"></i>
						<span class="status-text">Maintenance</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="right-section">
		<Calendar />
	</div>
</div>

<style>
	:global(html, body) {
		margin: 0;
		padding: 0;
		height: 100vh;
		overflow: hidden;
	}

	.dashboard {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		height: 100vh;
		padding: 1rem;
		justify-content: center;
	}
	.left-section {
		display: flex;
		gap: 1rem;
		width: 40rem;
		flex-direction: column;
	}
	.right-section {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		width: 100%;
	}
	.box {
		background-color: #ecebeb;
		border-radius: 0.5rem;
		padding: 1rem;
	}

	.title {
		font-size: 1.5rem;
		font-weight: bold;
		color: #333;
		padding-bottom: 1rem;
		text-align: left;
	}

	.summary {
		background-color: white;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.container {
		display: flex;
		gap: 1rem;
	}

	.card {
		display: flex;
		align-items: center;
		background-color: #fafafa;
		border-radius: 8px;
		overflow: hidden;
		width: 16rem;
		height: 5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: 1px solid #ddd;
	}

	.number-section {
		color: white;
		font-size: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 5rem;
		height: 100%;
	}

	.status-section {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0 1rem;
	}

	.icon {
		font-size: 1.5rem;
	}

	.status-text {
		color: #333;
		font-size: 1rem;
		font-weight: 500;
	}

	.booking {
		grid-area: booking;
		padding: 2rem;
	}

	.calendar {
		grid-area: calendar;
		padding: 2rem;
	}
</style>
