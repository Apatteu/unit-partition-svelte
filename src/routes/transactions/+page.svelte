<script lang="ts">
    import type { PageData } from './$types';
    import { page } from '$app/stores';
    import { Table, TableBody, TableBodyCell, GradientButton, TableBodyRow, TableHead, TableHeadCell, Checkbox, Pagination, Button, Dropdown, DropdownItem, Search, Label, Select, Modal, Input } from 'flowbite-svelte';

    let { data }: { data: PageData } = $props();
    let searchTerm = $state('');
    let showModal = $state(false);
    let showEditModal = $state(false);
    let editingTransaction = $state({
    paymentFrom: '',
    amount: '',
    unit: '',
    dueDate: '',
    status: 'pending'
});

interface transaction {
    paymentFrom: string;
    amount: string;
    unit: string;
    dueDate: string;
    status: string;
}

    // New transaction form data
    let newTransaction = $state({
        paymentFrom: '',
        amount: '',
        unit: '',
        dueDate: '',
        status: 'pending'
    });

    const timeFrames = [
        { value: '30', label: 'Last 30 days' },
        { value: '60', label: 'Last 60 days' },
        { value: '90', label: 'Last 90 days' },
        { value: 'all', label: 'All time' }
    ];

    let selectedTimeFrame = $state(timeFrames[0]);

    $effect(() => {
        if (searchTerm) {
            console.log('Searching for: ', searchTerm);
        }
    })

    // Status options for the form
    const statusOptions = [
        { value: 'pending', name: 'Pending' },
        { value: 'paid', name: 'Paid' },
        { value: 'not_paid', name: 'Not Yet Paid' },
    ];

    // Handle form submission
    function handleSubmit() {
        // Add your logic to save the transaction
        console.log('New transaction:', newTransaction);
        showModal = false;
        // Reset form
        newTransaction = {
            paymentFrom: '',
            amount: '',
            unit: '',
            dueDate: '',
            status: 'pending'
        };
    }

    function handleEdit(transaction) {
    editingTransaction = {
        paymentFrom: transaction.paymentFrom,
        amount: transaction.amount,
        unit: transaction.unit,
        dueDate: transaction.dueDate,
        status: transaction.status
    };
    showEditModal = true;
}

    function handleEditSubmit(){
        console.log('Updating transaction:', editingTransaction);
        showEditModal = false;
    }

    type PageItem = {
        name: number | string;
        href: string;
        active?: boolean;
        disabled?: boolean;
    }
    const activeUrl = $derived($page?.url?.searchParams?.get('page') ?? '1');
    let pages = [
        { name: 1, href: '/transactions?page=1', active: false },
        { name: 2, href: '/transactions?page=2' },
        { name: 3, href: '/transactions?page=3' },
        { name: '...', href: '/transactions?page=...', disabled: true },
        { name: 100, href: '/transactions?page=100' }
    ];

    $effect(() => {
        pages.forEach((page) => {
            let splitUrl = page.href.split('?');
            let queryString = splitUrl.slice(1).join('?');
            const hrefParams = new URLSearchParams(queryString);
            let hrefValue = hrefParams.get('page');
            if (hrefValue === activeUrl) {
                page.active = true;
            } else {
                page.active = false;
            }
        });
    });

    const helper = $state({
        start: 1,
        end: 10,
        total: 1000
    })
</script>

<div class="h-screen flex flex-col">
<div class="max-w-7xl mx-auto w-full flex flex-col flex-1 px-8 py-6">
<!-- Search, Filter, and New Transaction Controls -->
<div class="flex justify-between items-center mb-4">
    <div class="flex items-center gap-4">
        <div class="">
            <Button id="timeFrameDropdown" outline color="dark" >
                {selectedTimeFrame.label}
                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </Button>
            <Dropdown triggeredBy="#timeFrameDropdown">
                {#each timeFrames as timeFrame}
                    <DropdownItem on:click={() => selectedTimeFrame = timeFrame}>
                        {timeFrame.label}
                    </DropdownItem>
                {/each}
            </Dropdown>
        </div>
        <Button color="yellow" on:click={() => showModal = true}>
            New Transaction
        </Button>
    </div>
    
    <div class="w-72">
        <Search 
            bind:value={searchTerm} 
            placeholder="Search transactions..."
            size="md"
        />
    </div>
</div>

<!-- New Transaction Modal -->
<Modal bind:open={showModal} size="md" autoclose={false}>
    <div class="text-center">
        <h3 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">New Transaction</h3>
    </div>
    <form on:submit={handleSubmit} class="space-y-6">
        <div>
            <Label for="paymentFrom" class="mb-2">Payment From</Label>
            <Input
                id="paymentFrom"
                placeholder="Enter name or reference number"
                bind:value={newTransaction.paymentFrom}
                required
            />
        </div>
        
        <div>
            <Label for="amount" class="mb-2">Amount</Label>
            <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                bind:value={newTransaction.amount}
                required
            />
        </div>
        
        <div>
            <Label for="unit" class="mb-2">Unit</Label>
            <Input
                id="unit"
                type="number"
                placeholder="Enter unit number"
                bind:value={newTransaction.unit}
                required
            />
        </div>
        
        <div>
            <Label for="dueDate" class="mb-2">Due Date</Label>
            <Input
                id="dueDate"
                type="date"
                bind:value={newTransaction.dueDate}
                required
            />
        </div>
        
        <div>
            <Label for="status" class="mb-2">Status</Label>
            <Select
                id="status"
                bind:value={newTransaction.status}
                items={statusOptions}
                required
            />
        </div>

        <div class="flex justify-end gap-4">
            <Button color="alternative" on:click={() => showModal = false}>
                Cancel
            </Button>
            <Button type="submit" color="yellow">
                Save Transaction
            </Button>
        </div>
    </form>
</Modal>

<div class="flex-1 min-h-0 overflow-auto shadow-sm">

<Table hoverable={true}>
    <TableHead>
        <TableHeadCell class="!p-4">
            <Checkbox />
        </TableHeadCell>
        <TableHeadCell>TRANSACTION</TableHeadCell>
        <TableHeadCell>DATE & TIME</TableHeadCell>
        <TableHeadCell>AMOUNT</TableHeadCell>
        <TableHeadCell>UNIT</TableHeadCell>
        <TableHeadCell>DUE DATE</TableHeadCell>
        <TableHeadCell>STATUS</TableHeadCell>
        <TableHeadCell>ACTION</TableHeadCell>
    </TableHead>
    <TableBody tableBodyClass="divide-y">
        <TableBodyRow>
            <TableBodyCell class="!p-4">
                <Checkbox />
            </TableBodyCell>
            <TableBodyCell>Payment from Bonnie Green</TableBodyCell>
            <TableBodyCell>Apr 23, 2021</TableBodyCell>
            <TableBodyCell>$2300</TableBodyCell>
            <TableBodyCell>1</TableBodyCell>
            <TableBodyCell>Apr 23, 2021</TableBodyCell>
            <TableBodyCell>
                <span class="text-green-600">Paid</span>
            </TableBodyCell>
            <TableBodyCell>
                <Button color="green" on:click={() => handleEdit({
                    paymentFrom: 'Bonnie Green',
                    amount: '2300',
                    unit: '1',
                    dueDate: '2021-04-23',
                    status: 'paid'
                })}>Edit</Button>
                <Button color="red">Delete</Button>
            </TableBodyCell>
        </TableBodyRow>
        <!-- Add more rows as needed -->
    </TableBody>
</Table>

<Modal bind:open={showEditModal} size="md" autoclose={false}>
    <div class="text-center">
        <h3 class="mb-6 text-lg font-medium text-gray-900 dark:text-white">Edit Transaction</h3>
    </div>
    <form on:submit|preventDefault={handleEditSubmit} class="space-y-6">
        <div>
            <Label for="editPaymentFrom" class="mb-2">Payment From</Label>
            <Input
                id="editPaymentFrom"
                placeholder="Enter name or reference number"
                bind:value={editingTransaction.paymentFrom}
                required
            />
        </div>
        
        <div>
            <Label for="editAmount" class="mb-2">Amount</Label>
            <Input
                id="editAmount"
                type="number"
                placeholder="Enter amount"
                bind:value={editingTransaction.amount}
                required
            />
        </div>
        
        <div>
            <Label for="editUnit" class="mb-2">Unit</Label>
            <Input
                id="editUnit"
                type="number"
                placeholder="Enter unit number"
                bind:value={editingTransaction.unit}
                required
            />
        </div>
        
        <div>
            <Label for="editDueDate" class="mb-2">Due Date</Label>
            <Input
                id="editDueDate"
                type="date"
                bind:value={editingTransaction.dueDate}
                required
                />
            </div>
            
            <div>
                <Label for="editStatus" class="mb-2">Status</Label>
                <Select
                    id="editStatus"
                    bind:value={editingTransaction.status}
                    items={statusOptions}
                    required
                />
            </div>
    
            <div class="flex justify-end gap-4">
                <Button color="alternative" on:click={() => showEditModal = false}>
                    Cancel
                </Button>
                <Button type="submit" color="yellow">
                    Save Changes
                </Button>
            </div>
        </form>
    </Modal>
</div>

<div class="py-6">
<div class="flex justify-between items-center mt-4">
    <div class="text-sm text-gray-700 dark:text-gray-400">
        Showing 
        <span class="font-semibold text-gray-900 dark:text-white">{helper.start}</span>
        to
        <span class="font-semibold text-gray-900 dark:text-white">{helper.end}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{helper.total}</span>
        Entries
    </div>

    <Pagination table>
        <span slot="prev">Prev</span>
    </Pagination>
</div>
</div>
</div>
</div>