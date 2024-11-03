<template>
  <h1 class="page-title">Inventories</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <!-- Toggle for Active/Inactive Inventory Items -->
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          />

          <!-- Search Input for Inventory Items -->
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>

        <!-- Add Inventory Button -->
        <VaButton @click="showAddInventoryModal">Add Inventory</VaButton>
      </div>

      <!-- Inventory Table -->
      <InventoryTable
        :inventoryItems="inventories"
        :loading="loading"
        @edit-inventory="showEditInventoryModal"
      />
    </VaCardContent>

    <!-- Add/Edit Inventory Modal -->
    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowEditInventoryModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ inventoryToEdit ? 'Edit Inventory' : 'Add Inventory' }}</h1>
      <AddInventory
        ref="editFormRef"
        :inventoryItem="inventoryToEdit"
        :save-button-label="inventoryToEdit ? 'Save' : 'Add'"
        @close="cancel"
        @save="
          (item) => {
            onInventorySaved(item)
            ok()
          }
        "
      />
    </VaModal>
  </VaCard>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { IInventory, useTenantInventoryStore } from '../../../stores/tenantIventory';
import { useToast, useModal } from 'vuestic-ui';
import moment from 'moment';

import InventoryTable from './widgets/InventoryTable.vue';
import AddInventory from './widgets/AddInventory.vue';

const { init: notify } = useToast();

const filters = ref({
  isActive: true,
  search: ''
} as any);

const doShowEditInventoryModal = ref(false);
const inventoryStore = useTenantInventoryStore();
const { addInventory, fetchInventory } = useTenantInventoryStore();
const { loading, inventories } = storeToRefs(inventoryStore);

const editFormRef = ref();
const { confirm } = useModal();
const inventoryToEdit = ref<IInventory | null>(null);

const showAddInventoryModal = () => {
  inventoryToEdit.value = null;
  doShowEditInventoryModal.value = true;
};

const showEditInventoryModal = (item: IInventory) => {
  inventoryToEdit.value = item;
  doShowEditInventoryModal.value = true;
};

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    });
    if (agreed) {
      hide();
    }
  } else {
    hide();
  }
};

const onInventorySaved = async (item: IInventory) => {
  if (inventoryToEdit.value) {
    // TODO: ADD UPDATE INVENTORY
    // await updateInventoryItem(item);
    // notify({
    //   message: `${item.name} has been updated`,
    //   color: 'success',
    // });
  } else {
    await addInventory({
      ...item,
      expiry_date: moment(item?.expiry_date).format("YYYY-MM-DD")
    });
    notify({
      message: `${item.name} has been created`,
      color: 'success',
    });
  }
  fetchInventory();
};

onMounted(() => {
  fetchInventory();
});
</script>
