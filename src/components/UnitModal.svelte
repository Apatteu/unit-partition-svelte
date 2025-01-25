<script lang="ts">
	import { Modal } from 'flowbite-svelte';
	import type { Unit, Location } from '../types/Unit';
	import UnitService from '../services/unit.service';
	import { fade, slide } from 'svelte/transition';

	export let unit: Unit | null = null;
	export let isOpen = false;
	export let isNew = false;
	export let onClose: () => void;

	let editedUnit: Unit = {
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

	let images: File[] = [];
	let previews: string[] = [];
	let errorMessage = '';

	$: if (unit) {
		editedUnit = { ...unit };
	}

	function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			images = Array.from(input.files);
			previews = images.map((file) => URL.createObjectURL(file));
		}
	}

	function removeImage(index: number) {
		images.splice(index, 1);
		previews.splice(index, 1);
		images = images;
		previews = previews;
	}

	async function handleSubmit() {
		errorMessage = '';

		try {
			if (isNew) {
				await UnitService.createUnit(editedUnit, images);
			} else if (unit?.id) {
				await UnitService.updateUnit(unit.id, editedUnit, images);
			}
			isOpen = false;
			onClose();
		} catch (error) {
			console.error('Failed to save unit', error);
			errorMessage = 'Failed to save unit. Please try again.';
		}
	}
</script>

<Modal bind:open={isOpen} class="modal-container">
	<div>
		<div class="modal-header">
			<h3>{isNew ? 'Add New Unit' : 'Edit Unit'}</h3>
		</div>

		{#if errorMessage}
			<div transition:slide class="modal-error" role="alert">
				{errorMessage}
			</div>
		{/if}

		<div class="modal-content">
			<div class="form-section">
				<div class="input-group">
					<label for="title" class="input-label">Unit Title</label>
					<input
						id="title"
						type="text"
						class="input-field"
						bind:value={editedUnit.title}
						placeholder="e.g., Cozy Downtown Apartment"
					/>
				</div>

				<div class="input-group">
					<label for="rentAmount" class="input-label">Monthly Rent</label>
					<input
						id="rentAmount"
						type="number"
						class="input-field"
						bind:value={editedUnit.rentAmount}
						placeholder="Enter rent amount"
					/>
				</div>

				<div class="input-group">
					<label for="rooms" class="input-label">Number of Rooms</label>
					<input
						id="rooms"
						type="number"
						class="input-field"
						bind:value={editedUnit.rooms}
						min="1"
					/>
				</div>

				<div class="input-group">
					<label for="description" class="input-label">Description</label>
					<textarea
						id="description"
						class="input-field"
						bind:value={editedUnit.description}
						rows={4}
						placeholder="Describe your unit's unique features"
					></textarea>
				</div>
			</div>

			<div class="form-section">
				<h4 class="input-label">Location Details</h4>
				<div class="location-grid">
					<div class="input-group col-span-2">
						<label for="address" class="input-label">Street Address</label>
						<input
							id="address"
							type="text"
							class="input-field"
							bind:value={editedUnit.location.address}
							placeholder="123 Main St"
						/>
					</div>
					<div class="input-group">
						<label for="city" class="input-label">City</label>
						<input
							id="city"
							type="text"
							class="input-field"
							bind:value={editedUnit.location.city}
							placeholder="Manila"
						/>
					</div>
					<div class="input-group">
						<label for="province" class="input-label">Province</label>
						<input
							id="province"
							type="text"
							class="input-field"
							bind:value={editedUnit.location.province}
							placeholder="Metro Manila"
						/>
					</div>
					<div class="input-group">
						<label for="zipCode" class="input-label">Zip Code</label>
						<input
							id="zipCode"
							type="text"
							class="input-field"
							bind:value={editedUnit.location.zipCode}
							placeholder="1000"
						/>
					</div>
					<div class="input-group">
						<label for="country" class="input-label">Country</label>
						<input
							id="country"
							type="text"
							class="input-field"
							bind:value={editedUnit.location.country}
							placeholder="Philippines"
						/>
					</div>
				</div>

				<div class="input-group">
					<label class="input-label">Upload Images</label>
					<div class="image-upload-section">
						<label class="image-upload-label" for="imageUpload">
							<span>Add Images</span>
							<input
								id="imageUpload"
								type="file"
								multiple
								accept="image/*"
								class="hidden"
								on:change={handleImageChange}
							/>
						</label>

						{#each previews as preview, index}
							<div class="image-preview">
								<img src={preview} alt="Preview" />
								<button class="image-remove-btn" on:click={() => removeImage(index)}> ✕ </button>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="modal-actions">
			<button class="btn btn-cancel" on:click={onClose}> Cancel </button>
			<button class="btn btn-submit" on:click={handleSubmit}>
				{isNew ? 'Create Unit' : 'Save Changes'}
			</button>
		</div>
	</div>
</Modal>
