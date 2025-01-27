<script lang="ts">
	import type { PageData } from './$types';
	import { paymentService } from '../../services/payment.services';

	interface Transaction {
		id?: string;
		paymentFrom: string;
		amount: string;
		unit: string;
		dueDate: string;
		status: 'pending' | 'paid' | 'not_paid';
	}

	interface Payment {
		id: string;
		amount: number;
		dueDate: string;
		status: 'PENDING' | 'PAID' | 'OVERDUE';
		bookingId?: string;
	}

	function mapPaymentToTransaction(payment: Payment): Transaction {
		return {
			id: payment.id,
			paymentFrom: payment.bookingId || '',
			amount: payment.amount.toString(),
			unit: '',
			dueDate: new Date(payment.dueDate).toISOString().split('T')[0],
			status: mapStatusToFrontend(payment.status)
		};
	}

	function mapStatusToFrontend(status: string): Transaction['status'] {
		switch (status) {
			case 'PAID':
				return 'paid';
			case 'PENDING':
				return 'pending';
			default:
				return 'not_paid';
		}
	}

	let transactions: Transaction[] = [];
	let loading = true;
	let error: string | null = null;
	let selectedTransactions: string[] = [];

	let currentPage = 1;
	let itemsPerPage = 10;
	$: paginatedTransactions = transactions.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(transactions.length / itemsPerPage);

	async function fetchTransactions() {
		try {
			const response = await paymentService.getDuePaymentsThisMonth();
			transactions = response.payments.map(mapPaymentToTransaction);
			loading = false;
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
			loading = false;
		}
	}

	function toggleTransaction(transactionId: string) {
		selectedTransactions = selectedTransactions.includes(transactionId)
			? selectedTransactions.filter((id) => id !== transactionId)
			: [...selectedTransactions, transactionId];
	}

	function getStatusColor(status: string): string {
		switch (status) {
			case 'paid':
				return '#10b981';
			case 'not_paid':
				return '#ef4444';
			case 'pending':
				return '#fbbf24';
			default:
				return '#6b7280';
		}
	}

	async function updateTransactionStatus(transactionId: string) {
		try {
			await paymentService.markPaymentAsPaid(transactionId);
			await fetchTransactions();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An unknown error occurred';
		}
	}

	// Initial fetch
	fetchTransactions();
</script>

<div class="transactions-content">
	<div class="controls-header">
		<div class="left-controls">
			<input type="text" placeholder="Search transactions" class="search-input" />
		</div>
	</div>

	<div class="table-container">
		{#if loading}
			<div>Loading transactions...</div>
		{:else if error}
			<div>{error}</div>
		{:else}
			<table class="transactions-table">
				<thead>
					<tr>
						<th><input type="checkbox" /></th>
						<th>TRANSACTION</th>
						<th>DATE</th>
						<th>UNIT</th>
						<th>AMOUNT</th>
						<th>STATUS</th>
						<th>ACTION</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedTransactions as transaction}
						<tr>
							<td>
								<input
									type="checkbox"
									checked={selectedTransactions.includes(transaction.id || '')}
									on:change={() => transaction.id && toggleTransaction(transaction.id)}
								/>
							</td>
							<td>{transaction.paymentFrom}</td>
							<td>{transaction.dueDate}</td>
							<td>{transaction.unit}</td>
							<td>${transaction.amount}</td>
							<td style="color: {getStatusColor(transaction.status)}">
								{transaction.status}
							</td>
							<td>
								<button
									class="btn btn-edit"
									on:click={() => transaction.id && updateTransactionStatus(transaction.id)}
								>
									Edit
								</button>
								<button
									class="btn btn-delete"
									on:click={() => transaction.id && updateTransactionStatus(transaction.id)}
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
			<span>{Math.min(currentPage * itemsPerPage, transactions.length)}</span>
			of
			<span>{transactions.length}</span> entries
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
