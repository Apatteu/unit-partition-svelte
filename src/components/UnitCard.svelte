<script lang="ts">
	import type { Unit } from '../types/Unit';
	export let unit: Unit;
	export let onDetails: (unit: Unit) => void;
</script>

<div class="card-inventory">
	<img src={unit.photos?.[0]} alt={unit.title} class="card-img-inventory" />
	<div class="card-content-inventory">
		<h5 class="card-title-inventory">{unit.title}</h5>
		<div class="card-details-inventory">
			<p>{unit.rooms} Rooms</p>
			<p>₱{unit.rentAmount.toLocaleString()}/month</p>
			<p>
				{unit.location.address}, {unit.location.city}, {unit.location.province}, {unit.location
					.country}
				{unit.location.zipCode}
			</p>
			<p>{unit.description}</p>
		</div>
		<div class="card-footer-inventory">
			<span
				class="status-badge-inventory {unit.status === 'OCCUPIED'
					? 'status-occupied-inventory'
					: 'status-available-inventory'}"
			>
				{unit.status}
			</span>
			<button class="btn-inventory btn-blue-inventory" on:click={() => onDetails(unit)}>Edit</button
			>
		</div>
	</div>
</div>
