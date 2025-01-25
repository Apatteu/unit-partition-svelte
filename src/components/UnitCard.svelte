<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import type { Unit } from '../types/Unit';
	export let unit: Unit;
	export let onDetails: (unit: Unit) => void;
</script>

<Card
	img={unit.photos?.[0]}
	padding="sm"
	class="overflow-hidden"
	imgClass="w-full h-48 object-cover"
>
	<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">
		{unit.title}
	</h5>
	<div class="mb-4 space-y-1 text-gray-700">
		<p>{unit.rooms} Rooms</p>
		<p>₱{unit.rentAmount.toLocaleString()}/month</p>
		<p>{unit.location}</p>
	</div>
	<div class="flex items-center justify-between">
		<span
			class="rounded-full px-3 py-1 text-sm font-medium"
			class:bg-green-500={unit.status === 'OCCUPIED'}
			class:text-green-50={unit.status === 'OCCUPIED'}
			class:bg-red-500={unit.status === 'AVAILABLE'}
			class:text-red-50={unit.status === 'AVAILABLE'}
		>
			{unit.status}
		</span>
		<Button size="sm" color="blue" on:click={() => onDetails(unit)}>Details</Button>
	</div>
</Card>
