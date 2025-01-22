<script lang="ts">
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, Badge, Button } from 'flowbite-svelte';
</script>

<div class="bg-[#DBDBDB] h-screen flex flex-col justify-between">
  <div class="flex-grow flex items-center justify-center">
    <div class="max-w-8xl w-full mx-auto px-4 py-6"> <!-- Adjusted max width to make the table wider -->
      <div class="overflow-hidden rounded-lg bg-white shadow-lg">
        <Table class="w-full">
          <TableHead>
            <TableHeadCell class="!p-4">
            </TableHeadCell>
            <TableHeadCell>Tenant</TableHeadCell>
            <TableHeadCell>Date</TableHeadCell>
            <TableHeadCell>Unit</TableHeadCell>
            <TableHeadCell class="truncate">Request</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
          </TableHead>
          <TableBody tableBodyClass="divide-y">
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>Bonnie Green</TableBodyCell>
              <TableBodyCell>Apr 23, 2021</TableBodyCell>
              <TableBodyCell>1</TableBodyCell>
              <TableBodyCell>The lock on my front door is sticking, and I’m worried it might not lock properly.</TableBodyCell>
              <TableBodyCell><Badge color="green">Completed</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>John Doe</TableBodyCell>
              <TableBodyCell>Apr 23, 2021</TableBodyCell>
              <TableBodyCell>2</TableBodyCell>
              <TableBodyCell>The kitchen faucet is dripping constantly, and there seems to be a leak.</TableBodyCell>
              <TableBodyCell><Badge color="green">Completed</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>Criss Phine</TableBodyCell>
              <TableBodyCell>Apr 18, 2021</TableBodyCell>
              <TableBodyCell>3</TableBodyCell>
              <TableBodyCell>The bathroom sink is draining really slowly, and I think it might be clogged.</TableBodyCell>
              <TableBodyCell><Badge color="red">Cancelled</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>Lana Byrd</TableBodyCell>
              <TableBodyCell>Apr 15, 2021</TableBodyCell>
              <TableBodyCell>4</TableBodyCell>
              <TableBodyCell>The dishwasher isn’t working properly—it won’t start. Could you have someone take a look?</TableBodyCell>
              <TableBodyCell><Badge color="purple">In Progress</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>Jese Leos</TableBodyCell>
              <TableBodyCell>Apr 15, 2021</TableBodyCell>
              <TableBodyCell>5</TableBodyCell>
              <TableBodyCell>I’ve noticed some roaches in the kitchen. Could you arrange for pest control?</TableBodyCell>
              <TableBodyCell><Badge color="green">Completed</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
            <TableBodyRow>
              <TableBodyCell class="!p-4">
                <Checkbox />
              </TableBodyCell>
              <TableBodyCell>THEMSBERG LLC</TableBodyCell>
              <TableBodyCell>Apr 11, 2021</TableBodyCell>
              <TableBodyCell>6</TableBodyCell>
              <TableBodyCell>There’s a crack in the wall near the window that’s getting worse. Can you fix it?</TableBodyCell>
              <TableBodyCell><Badge color="green">Completed</Badge></TableBodyCell>
              <TableBodyCell>
                <Button color="green">Edit</Button>
              </TableBodyCell>
            </TableBodyRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  <footer class="border-t py-4">
    <div class="flex justify-between items-center max-w-7xl mx-auto px-4">
      <span class="text-sm text-gray-700">Showing 1-10 of 1000</span>
      <nav class="inline-flex space-x-1">
        <button class="px-3 py-1 bg-gray-200 text-gray-600 rounded">1</button>
        <button class="px-3 py-1 bg-gray-100 text-gray-600 rounded">2</button>
        <button class="px-3 py-1 bg-gray-100 text-gray-600 rounded">...</button>
        <button class="px-3 py-1 bg-gray-100 text-gray-600 rounded">100</button>
      </nav>
    </div>
  </footer>
</div>