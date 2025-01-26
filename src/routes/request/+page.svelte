<script lang="ts">
	import { onMount } from 'svelte';

	interface MaintenanceRequest {
		id: string;
		description: string;
		status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
		createdAt: string;
		unit: {
			title: string;
		};
		tenant: {
			user: {
				profile: {
					firstName: string;
					lastName: string;
				};
			};
		};
	}

	let requests: MaintenanceRequest[] = [];
	let loading = true;
	let error: string | null = null;
	let selectedRequests: string[] = [];

	async function fetchMaintenanceRequests() {
		try {
			const response = await fetch('http://localhost:3000/api/maintenance/landlord', {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error('Failed to fetch maintenance requests');
			}

			requests = await response.json();
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			loading = false;
		}
	}

	async function updateRequestStatus(requestId: string, status: string) {
		try {
			const response = await fetch(`/api/maintenance/${requestId}/status`, {
				method: 'PATCH',
				headers: {
					Authorization: `Bearer ${localStorage.getItem('token')}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status })
			});

			if (!response.ok) {
				throw new Error('Failed to update request status');
			}

			await fetchMaintenanceRequests();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		}
	}

	function toggleRequest(requestId: string) {
		selectedRequests = selectedRequests.includes(requestId)
			? selectedRequests.filter((id) => id !== requestId)
			: [...selectedRequests, requestId];
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'COMPLETED':
				return '#10b981';
			case 'CANCELLED':
				return '#ef4444';
			case 'IN_PROGRESS':
				return '#6b46c1';
			case 'PENDING':
				return '#fbbf24';
			default:
				return '#6b7280';
		}
	}

	onMount(fetchMaintenanceRequests);

	// Pagination simulation
	let currentPage = 1;
	let itemsPerPage = 10;
	$: paginatedRequests = requests.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(requests.length / itemsPerPage);
</script>

<div class="transactions-content">
	<div class="controls-header">
		<div class="left-controls">
			<input type="text" placeholder="Search maintenance requests" class="search-input" />
		</div>
	</div>

	<div class="table-container">
		{#if loading}
			<div>Loading maintenance requests...</div>
		{:else if error}
			<div>{error}</div>
		{:else}
			<table class="transactions-table">
				<thead>
					<tr>
						<th><input type="checkbox" /></th>
						<th>TENANT</th>
						<th>DATE</th>
						<th>UNIT</th>
						<th>REQUEST</th>
						<th>STATUS</th>
						<th>ACTION</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedRequests as request}
						<tr>
							<td>
								<input
									type="checkbox"
									checked={selectedRequests.includes(request.id)}
									on:change={() => toggleRequest(request.id)}
								/>
							</td>
							<td>
								{request.tenant.user.profile.firstName}
								{request.tenant.user.profile.lastName}
							</td>
							<td>{new Date(request.createdAt).toLocaleDateString()}</td>
							<td>{request.unit.title}</td>
							<td>{request.description}</td>
							<td style="color: {getStatusColor(request.status)}">
								{request.status.replace('_', ' ')}
							</td>
							<td>
								<button
									class="btn btn-edit"
									on:click={() => updateRequestStatus(request.id, 'IN_PROGRESS')}
								>
									Edit
								</button>
								<button
									class="btn btn-delete"
									on:click={() => updateRequestStatus(request.id, 'COMPLETED')}
								>
									Delete
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<div class="pagination-container">
		<div class="pagination-info">
			Showing
			<span>{(currentPage - 1) * itemsPerPage + 1}</span>
			to
			<span>{Math.min(currentPage * itemsPerPage, requests.length)}</span>
			of
			<span>{requests.length}</span> entries
		</div>
		<div class="pagination-controls">
			{#each Array(totalPages) as _, i}
				<button
					class="pagination-btn {currentPage === i + 1 ? 'active' : ''}"
					on:click={() => (currentPage = i + 1)}
				>
					{i + 1}
				</button>
			{/each}
		</div>
	</div>
</div>

<style>
	/* Directly copied from transactions page styles */
	.transactions-content {
		max-width: 1280px;
		margin: 0 auto;
		width: 100%;
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 1.5rem 2rem;
	}

	.controls-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.search-input {
		width: 18rem;
		padding: 0.5rem 1rem;
		border: 1px solid #ccc;
		border-radius: 0.375rem;
	}

	.table-container {
		flex: 1;
		min-height: 0;
		overflow: auto;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
	}

	.transactions-table {
		width: 100%;
		border-collapse: collapse;
	}

	.transactions-table thead {
		position: sticky;
		top: 0;
		background-color: #f9fafb;
	}

	.transactions-table th,
	.transactions-table td {
		padding: 1rem;
		text-align: left;
		border-bottom: 1px solid #e5e7eb;
	}

	.transactions-table th {
		font-weight: 600;
		text-transform: uppercase;
		color: #6b7280;
	}

	.btn {
		padding: 0.5rem 1rem;
		border-radius: 0.375rem;
		border: none;
		cursor: pointer;
	}

	.btn-edit {
		background-color: #10b981;
		color: white;
		margin-right: 0.5rem;
	}

	.btn-delete {
		background-color: #ef4444;
		color: white;
	}

	.pagination-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 0;
	}

	.pagination-info {
		color: #6b7280;
	}

	.pagination-info span {
		font-weight: 600;
		color: #111827;
		margin: 0 0.25rem;
	}

	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.pagination-btn {
		padding: 0.5rem 1rem;
		border: 1px solid #e5e7eb;
		background-color: white;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	.pagination-btn.active {
		background-color: #fbbf24;
		color: white;
	}

	.pagination-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
