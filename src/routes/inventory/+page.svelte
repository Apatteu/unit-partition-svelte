<script>
	import { Card, Button, Modal, Label, Textarea, Input, Toggle } from 'flowbite-svelte';
	import { ArrowRightOutline, SearchOutline, PenOutline } from 'flowbite-svelte-icons';

	let searchQuery = '';
  let modalOpen = false;
  let addUnitModalOpen = null;
  let isEditing = false;
  /**
	 * @type {{ image: any; name: any; status: string; bedrooms: any; cr: any; kitchen: any; balcony: any; monthlyRent: any; securityDeposit: any; advanceDeposit: any; currentTenant: any; leaseStart: any; leaseEnd: any; description: any; } | null}
	 */
  let selectedUnit = null;

	let units = [
		{
			id: 1,
			name: 'Unit 1 @ E.B.B',
			status: 'Occupied',
			bedrooms: 2,
			cr: 1,
			kitchen: 1,
			balcony: true,
			image: '/apartment1.jpg',
      // Additional details for modal
      monthlyRent: "₱15,000",
      securityDeposit: "₱30,000",
      advanceDeposit: "₱15,000",
      currentTenant: "John Doe",
      leaseStart: "2024-01-01",
      leaseEnd: "2024-12-31",
      description: "Modern and spacious unit with great natural lighting..."
    },
		
		// Add more units as needed
	];

  // Form data for new unit
  let newUnit = {
    name: '',
    bedrooms: '',
    cr: '',
    kitchen: '',
    balcony: false,
    monthlyRent: '',
    securityDeposit: '',
    advanceDeposit: '',
    description: '',
    image: null
  };

  function handleAddUnit() {
    // TODO: Implement form validation and submission
    console.log('New unit data:', newUnit);
    // Reset form
    newUnit = {
      name: '',
      bedrooms: '',
      cr: '',
      kitchen: '',
      balcony: false,
      monthlyRent: '',
      securityDeposit: '',
      advanceDeposit: '',
      description: '',
      image: null
    };
    addUnitModalOpen = false;
  }

  function handleUpdate(){
    console.log('Updating unit:', selectedUnit);
    isEditing = false;
    modalOpen = false;
  }

  function cancelUpdate(){
    isEditing = false;
    modalOpen = false;
  }

	$: filteredUnits = units.filter((unit) =>
		unit.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

  function openUnitModal(unit){
    selectedUnit = unit;
    modalOpen = true;
  }
</script>

<div class="container mx-auto p-6">
	<!-- Header Section -->
	<div class="mb-12 flex items-center justify-between">
		<Button color="blue" class="px-4 py-2" onclick={() => addUnitModalOpen = true}>
			<span class="mr-2">+</span> Add new unit
		</Button>

		<div class="relative w-72">
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<SearchOutline class="h-5 w-5 text-gray-400" />
			</div>
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search units..."
				class="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:ring-blue-500"
			/>
		</div>
	</div>

  <!-- Add New Unit Modal -->
<Modal 
bind:open={addUnitModalOpen} 
size="lg" 
title="Add New Unit"
autoclose={false}
>
<form class="space-y-6" on:submit|preventDefault={handleAddUnit}>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Basic Information -->
    <div class="space-y-4">
      <h4 class="font-semibold text-lg">Basic Information</h4>
      
      <div>
        <Label for="unitName" class="mb-2">Unit Name</Label>
        <Input
          id="unitName"
          placeholder="e.g., Unit 1 @ E.B.B"
          required
          bind:value={newUnit.name}
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="bedrooms" class="mb-2">Bedrooms</Label>
          <Input
            id="bedrooms"
            type="number"
            min="0"
            required
            bind:value={newUnit.bedrooms}
          />
        </div>
        
        <div>
          <Label for="cr" class="mb-2">Bathrooms</Label>
          <Input
            id="cr"
            type="number"
            min="0"
            required
            bind:value={newUnit.cr}
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <Label for="kitchen" class="mb-2">Kitchen</Label>
          <Input
            id="kitchen"
            type="number"
            min="0"
            required
            bind:value={newUnit.kitchen}
          />
        </div>
        
        <div class="flex items-center">
          <Toggle bind:checked={newUnit.balcony} class="mt-4">
            Has Balcony
          </Toggle>
        </div>
      </div>
    </div>

    <!-- Financial Information -->
    <div class="space-y-4">
      <h4 class="font-semibold text-lg">Financial Information</h4>
      
      <div>
        <Label for="monthlyRent" class="mb-2">Monthly Rent (₱)</Label>
        <Input
          id="monthlyRent"
          type="number"
          min="0"
          required
          bind:value={newUnit.monthlyRent}
        />
      </div>

      <div>
        <Label for="securityDeposit" class="mb-2">Security Deposit (₱)</Label>
        <Input
          id="securityDeposit"
          type="number"
          min="0"
          required
          bind:value={newUnit.securityDeposit}
        />
      </div>

      <div>
        <Label for="advanceDeposit" class="mb-2">Advance Deposit (₱)</Label>
        <Input
          id="advanceDeposit"
          type="number"
          min="0"
          required
          bind:value={newUnit.advanceDeposit}
        />
      </div>
    </div>
  </div>

  <!-- Unit Image -->
  <div class="space-y-2">
    <Label for="unitImage" class="mb-2">Unit Image</Label>
    <Input
      id="unitImage"
      type="file"
      accept="image/*"
      required
      onChange={(e) => newUnit.image = e.target.files[0]}
    />
  </div>

  <!-- Description -->
  <div class="space-y-2">
    <Label for="description" class="mb-2">Description</Label>
    <Textarea
      id="description"
      rows= "4"
      placeholder="Enter unit description..."
      bind:value={newUnit.description}
    />
  </div>

  <!-- Form Actions -->
  <div class="flex justify-end space-x-4">
    <Button 
      color="alternative" 
      on:click={() => addUnitModalOpen = false}
    >
      Cancel
    </Button>
    <Button type="submit" color="blue">
      Add Unit
    </Button>
  </div>
</form>
</Modal>

	<!-- Units Grid -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		{#each filteredUnits as unit (unit.id)}
			<Card
				img={unit.image}
				padding="sm"
				class="overflow-hidden"
				imgClass="w-full h-48 object-cover"
			>
				<h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
					{unit.name}
				</h5>
				<div class="mb-4 space-y-1 text-gray-700 dark:text-gray-400">
					<p>{unit.bedrooms} Bedroom</p>
					<p>{unit.cr} CR</p>
					<p>{unit.kitchen} Kitchen</p>
					<p>{unit.balcony ? 'with Balcony' : 'No Balcony'}</p>
				</div>
				<div class="flex items-center justify-between">
					<span
						class="rounded-full px-3 py-1 text-sm font-medium"
						class:bg-green-500={unit.status === 'Occupied'}
						class:text-green-50={unit.status === 'Occupied'}
						class:bg-red-500={unit.status === 'Vacant'}
						class:text-red-50={unit.status === 'Vacant'}
					>
						{unit.status}
					</span>
					<Button size="sm" color="blue" on:click={() => openUnitModal(unit)}>
            Read more <ArrowRightOutline class="w-4 h-4 ml-2" />
          </Button>
				</div>
			</Card>
		{/each}

     <!-- Modal -->
<Modal bind:open={modalOpen} size="lg">
  {#if selectedUnit}
    <div class="space-y-6">
      <!-- Header with Image -->
      <div class="relative h-64 -mt-4 -mx-4">
        <img
          src={selectedUnit.image}
          alt={selectedUnit.name}
          class="w-full h-full object-cover"
        />
        <div class="absolute top-4 right-4">
          <span 
            class="px-3 py-1 rounded-full text-sm font-medium"
            class:bg-green-500={selectedUnit.status === "Occupied"}
            class:text-green-50={selectedUnit.status === "Occupied"}
            class:bg-red-500={selectedUnit.status === "Vacant"}
            class:text-red-50={selectedUnit.status === "Vacant"}
          >
            {selectedUnit.status}
          </span>
        </div>
      </div>

      <!-- Unit Details -->
      <div class="px-4">
        <h3 class="text-2xl font-bold mb-4">{selectedUnit.name}</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <!-- Basic Information -->
          <div class="space-y-4">
            <h4 class="font-semibold text-lg">Basic Information</h4>
            <div class="space-y-2">
              <p><span class="font-medium">Bedrooms:</span> {selectedUnit.bedrooms}</p>
              <p><span class="font-medium">Bathrooms:</span> {selectedUnit.cr}</p>
              <p><span class="font-medium">Kitchen:</span> {selectedUnit.kitchen}</p>
              <p><span class="font-medium">Balcony:</span> {selectedUnit.balcony ? 'Yes' : 'No'}</p>
            </div>
          </div>

          <!-- Financial Details -->
          <div class="space-y-4">
            <h4 class="font-semibold text-lg">Financial Details</h4>
            <div class="space-y-2">
              <p><span class="font-medium">Monthly Rent:</span> {selectedUnit.monthlyRent}</p>
              <p><span class="font-medium">Security Deposit:</span> {selectedUnit.securityDeposit}</p>
              <p><span class="font-medium">Advance Deposit:</span> {selectedUnit.advanceDeposit}</p>
            </div>
          </div>

            <!-- Tenant Information (if occupied) -->
          {#if selectedUnit.status === "Occupied"}
          <div class="mt-6 space-y-4">
            <h4 class="font-semibold text-lg">Current Tenant</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> {selectedUnit.currentTenant}</p>
                <p><span class="font-medium">Lease Period:</span> {selectedUnit.leaseStart} to {selectedUnit.leaseEnd}</p>
              </div>
          </div>
          {/if}

          <!-- Description -->
          <div class="mt-6 space-y-4">
            <h4 class="font-semibold text-lg">Description</h4>
            <p class="text-gray-600">{selectedUnit.description}</p>
          </div>

          <!--Action Buttons-->
          <div class="mt-8 flex justify-end space-x-4">
            <Button 
              color="alternative" 
              on:click={cancelUpdate}
            >
              Cancel
            </Button>
            <Button 
              color="blue"
              on:click={() => isEditing = true}
            >
              <PenOutline class="w-4 h-4 mr-2" />
              Update
            </Button>
          </div>
        </div>
      </div>

      <!-- Edit Mode Modal -->
    <Modal bind:open={isEditing} size="lg">
      {#if isEditing}
        <form class="space-y-6" on:submit|preventDefault={handleUpdate}>
          <h3 class="text-xl font-bold mb-4">Update Unit Details</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Basic Information -->
            <div class="space-y-4">
              <h4 class="font-semibold text-lg">Basic Information</h4>
              
              <div>
                <Label for="editUnitName" class="mb-2">Unit Name</Label>
                <Input
                  id="editUnitName"
                  placeholder="Unit name"
                  required
                  bind:value={selectedUnit.name}
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="editBedrooms" class="mb-2">Bedrooms</Label>
                  <Input
                    id="editBedrooms"
                    type="number"
                    min="0"
                    required
                    bind:value={selectedUnit.bedrooms}
                  />
                </div>
                
                <div>
                  <Label for="editCr" class="mb-2">Bathrooms</Label>
                  <Input
                    id="editCr"
                    type="number"
                    min="0"
                    required
                    bind:value={selectedUnit.cr}
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Label for="editKitchen" class="mb-2">Kitchen</Label>
                  <Input
                    id="editKitchen"
                    type="number"
                    min="0"
                    required
                    bind:value={selectedUnit.kitchen}
                  />
                </div>
                
                <div class="flex items-center">
                  <Toggle bind:checked={selectedUnit.balcony} class="mt-4">
                    Has Balcony
                  </Toggle>
                </div>
              </div>
            </div>

            <!-- Financial Information -->
            <div class="space-y-4">
              <h4 class="font-semibold text-lg">Financial Information</h4>
              
              <div>
                <Label for="editMonthlyRent" class="mb-2">Monthly Rent (₱)</Label>
                <Input
                  id="editMonthlyRent"
                  type="number"
                  min="0"
                  required
                  bind:value={selectedUnit.monthlyRent}
                />
              </div>

              <div>
                <Label for="editSecurityDeposit" class="mb-2">Security Deposit (₱)</Label>
                <Input
                  id="editSecurityDeposit"
                  type="number"
                  min="0"
                  required
                  bind:value={selectedUnit.securityDeposit}
                />
              </div>

              <div>
                <Label for="editAdvanceDeposit" class="mb-2">Advance Deposit (₱)</Label>
                <Input
                  id="editAdvanceDeposit"
                  type="number"
                  min="0"
                  required
                  bind:value={selectedUnit.advanceDeposit}
                />
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-2">
            <Label for="editDescription" class="mb-2">Description</Label>
            <Textarea
              id="editDescription"
              rows="4"
              placeholder="Enter unit description..."
              bind:value={selectedUnit.description}
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4">
            <Button 
              color="alternative" 
              on:click={() => isEditing = false}
            >
              Cancel
            </Button>
            <Button type="submit" color="blue">
              Save Changes
            </Button>
          </div>
        </form>
      {/if}
    </Modal>
      </div>
    {/if}
  </Modal>
	</div>
</div>