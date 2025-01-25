<script lang="ts">
	import { onMount } from 'svelte';
	import { Button, Input } from 'flowbite-svelte';
	import UnitModal from '../../components/UnitModal.svelte';
	import type { Unit } from '../../types/Unit';
	import unitService from '../../services/unit.service';
	import UnitCard from '../../components/UnitCard.svelte';

	let units: Unit[] = [];
	let selectedUnit: Unit | null = null;
	let searchQuery = '';
	let modalOpen = false;
	let isNew = false;

	// Fetch units on component mount
	onMount(async () => {
		try {
			units = await unitService.getUnits();
			console.log(units);
		} catch (error) {
			console.error('Failed to load units', error);
		}
	});

	// Open the modal in "create" mode
	function openCreateModal() {
		selectedUnit = {
			title: '',
			description: '',
			location: {
				address: '',
				city: '',
				province: '',
				zipCode: '',
				country: ''
			},
			rentAmount: 0,
			rooms: 1
		};
		isNew = true;
		modalOpen = true;
	}

	function openEditModal(unit: Unit) {
		selectedUnit = unit;
		isNew = false;
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
		selectedUnit = null;
		isNew = false;
	}

	function filterUnits(unit: Unit): boolean {
		const query = searchQuery.toLowerCase();
		const locationMatch = Object.values(unit.location)
			.map((value) => value.toLowerCase())
			.some((field) => field.includes(query));
		const titleMatch = unit.title.toLowerCase().includes(query);
		return titleMatch || locationMatch;
	}
</script>

<div class="container mx-auto p-6">
	<div class="mb-12 flex items-center justify-between">
		<Button color="blue" on:click={openCreateModal}>+ Add New Unit</Button>
		<div class="relative w-72">
			<Input type="text" bind:value={searchQuery} placeholder="Search units..." class="pl-10" />
		</div>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each units.filter(filterUnits) as unit (unit.id)}
			<UnitCard {unit} onDetails={() => openEditModal(unit)} />
		{/each}
	</div>

	<UnitModal bind:isOpen={modalOpen} unit={selectedUnit} {isNew} onClose={closeModal} />
</div>
