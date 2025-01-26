<script lang="ts">
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

	function handleOverlayClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			isOpen = false;
			onClose();
		}
	}
	function handleOverlayKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			onClose();
		}
	}
</script>

{#if isOpen}
	<div
		class="modal-overlay"
		role="dialog"
		aria-modal="true"
		transition:fade
		on:click={handleOverlayClick}
		on:keydown={handleOverlayKeydown}
	>
		<div class="modal-container visible" on:click|stopPropagation>
			<div class="modal-content">
				<div class="modal-header">
					<h3>{isNew ? 'Add New Unit' : 'Edit Unit'}</h3>
				</div>

				{#if errorMessage}
					<div transition:slide class="error-message" role="alert">
						{errorMessage}
					</div>
				{/if}

				<div>
					<div>
						<div class="grid">
							<div class="input-group">
								<label for="title">Unit Title</label>
								<input
									id="title"
									type="text"
									bind:value={editedUnit.title}
									placeholder="e.g., Cozy Downtown Apartment"
								/>
							</div>

							<div class="input-group">
								<label for="rentAmount">Monthly Rent</label>
								<input
									id="rentAmount"
									type="number"
									bind:value={editedUnit.rentAmount}
									placeholder="Enter rent amount"
								/>
							</div>
						</div>
					</div>

					<div class="input-group">
						<label for="description">Description</label>
						<textarea
							id="description"
							bind:value={editedUnit.description}
							rows={4}
							placeholder="Describe your unit's unique features"
						></textarea>
					</div>

					<div>
						<h4>Location Details</h4>
						<div class="grid">
							<div class="input-group">
								<label for="address">Street Address</label>
								<input
									id="address"
									type="text"
									bind:value={editedUnit.location.address}
									placeholder="123 Main St"
								/>
							</div>
							<div class="input-group">
								<label for="city">City</label>
								<input
									id="city"
									type="text"
									bind:value={editedUnit.location.city}
									placeholder="Manila"
								/>
							</div>
							<div class="input-group">
								<label for="province">Province</label>
								<input
									id="province"
									type="text"
									bind:value={editedUnit.location.province}
									placeholder="Metro Manila"
								/>
							</div>
							<div class="input-group">
								<label for="zipCode">Zip Code</label>
								<input
									id="zipCode"
									type="text"
									bind:value={editedUnit.location.zipCode}
									placeholder="1000"
								/>
							</div>
							<div class="input-group">
								<label for="country">Country</label>
								<input
									id="country"
									type="text"
									bind:value={editedUnit.location.country}
									placeholder="Philippines"
								/>
							</div>
						</div>
					</div>

					<div class="input-group">
						<label for="imageUpload">Upload Images</label>
						<div class="image-upload-container">
							<label class="image-upload-btn">
								Add Images
								<input
									id="imageUpload"
									type="file"
									multiple
									accept="image/*"
									on:change={handleImageChange}
								/>
							</label>

							<div class="image-preview-container">
								{#each previews as preview, index}
									<div class="image-preview">
										<img src={preview} alt="Preview" />
										<button class="image-remove-btn" on:click={() => removeImage(index)}>
											✕
										</button>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>

				<div class="modal-actions">
					<button class="btn-cancel" on:click={onClose}> Cancel </button>
					<button class="btn-submit" on:click={handleSubmit}>
						{isNew ? 'Create Unit' : 'Save Changes'}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(45, 55, 72, 0.7);
		backdrop-filter: blur(5px);
	}

	.modal-container {
		width: 100%;
		max-width: 1000px;
		max-height: 90vh;
		background-color: white;
		border-radius: var(--border-radius);
		box-shadow: var(--shadow);
		overflow: scroll;
		transform: scale(0.9);
		opacity: 0;
		padding: 20px;
		transition: all 0.3s ease-out;
	}

	.modal-container.visible {
		transform: scale(1);
		opacity: 1;
	}

	.modal-content {
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-header h3 {
		font-size: 1.5rem;
		color: var(--text-color);
		font-weight: 600;
	}

	.error-message {
		background-color: #fecaca;
		color: #7f1d1d;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 1.5rem;
	}

	.input-group {
		margin-bottom: 1rem;
	}

	.input-group label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-color);
		font-weight: 500;
	}

	.input-group input,
	.input-group textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		background-color: white;
		transition: all 0.3s ease;
	}

	.input-group input:focus,
	.input-group textarea:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
	}

	.image-upload-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem;
	}

	.image-upload-btn {
		position: relative;
		overflow: hidden;
		background-color: var(--primary-color);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.image-upload-btn:hover {
		background-color: #3a7bd5;
	}

	.image-upload-btn input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		cursor: pointer;
	}

	.image-preview-container {
		display: flex;
		gap: 0.75rem;
	}

	.image-preview {
		position: relative;
		width: 80px;
		height: 80px;
		border-radius: 8px;
		overflow: hidden;
	}

	.image-preview img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.image-remove-btn {
		position: absolute;
		top: 5px;
		right: 5px;
		background-color: rgba(239, 68, 68, 0.8);
		color: white;
		border: none;
		border-radius: 50%;
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.image-remove-btn:hover {
		background-color: rgb(239, 68, 68);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
		margin-top: 1.5rem;
	}

	.btn-cancel,
	.btn-submit {
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.3s ease;
	}

	.btn-cancel {
		background-color: var(--secondary-color);
		color: var(--text-color);
		border: 1px solid #e2e8f0;
	}

	.btn-cancel:hover {
		background-color: #e2e8f0;
	}

	.btn-submit {
		background-color: var(--primary-color);
		color: white;
		border: none;
	}

	.btn-submit:hover {
		background-color: #3a7bd5;
	}
</style>
