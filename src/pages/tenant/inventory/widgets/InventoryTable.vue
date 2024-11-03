<template>
  <VaDataTable
    :columns="columns"
    :items="inventoryItems"
    :loading="loading"
  >
    <!-- Inventory Name Column -->
    <template #cell(name)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.name }}
      </div>
    </template>

    <!-- Description Column -->
    <template #cell(description)="{ rowData }">
      <div class="ellipsis max-w-[250px]">
        {{ rowData.description }}
      </div>
    </template>

    <!-- Quantity Column -->
    <template #cell(quantity)="{ rowData }">
      <div class="text-center">{{ rowData.quantity }}</div>
    </template>

    <!-- Price Column -->
    <template #cell(price)="{ rowData }">
      <div class="text-right">{{ rowData.price }}</div>
    </template>

    <!-- Expiry Date Column -->
    <template #cell(expiry_date)="{ rowData }">
      <div class="text-center">{{ rowData.expiry_date }}</div>
    </template>

    <!-- Actions Column -->
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit inventory"
          @click="$emit('edit-inventory', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete inventory"
          @click="onInventoryDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { defineVaDataTableColumns, useModal } from 'vuestic-ui';

const { confirm } = useModal();

const props = defineProps({
  inventoryItems: {
    type: Array as PropType<Array<{
      id: number;
      name: string;
      description: string;
      quantity: number;
      price: string;
      expiry_date: string;
    }>>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const columns = defineVaDataTableColumns([
  { label: 'Inventory Name', key: 'name', sortable: true },
  { label: 'Description', key: 'description', sortable: false },
  { label: 'Quantity', key: 'quantity', sortable: true },
  { label: 'Price', key: 'price', sortable: true },
  { label: 'Expiry Date', key: 'expiry_date', sortable: true },
  { label: 'Actions', key: 'actions', align: 'right' },
]);

const emit = defineEmits<{
  (event: 'edit-inventory', inventory: any): void;
  (event: 'delete-inventory', inventory: any): void;
}>();

const onInventoryDelete = async (inventoryItem: any) => {
  const agreed = await confirm({
    title: 'Delete Inventory',
    message: `Are you sure you want to delete the inventory item "${inventoryItem.name}"?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  });

  if (agreed) {
    emit('delete-inventory', inventoryItem);
  }
};
</script>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>
