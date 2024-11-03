<template>
  <VaDataTable
    :columns="columns"
    :items="customers"
    :loading="loading"
  >
    <!-- Customer Name Column -->
    <template #cell(name)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.name }}
      </div>
    </template>

    <!-- Email Column -->
    <template #cell(email)="{ rowData }">
      <div class="ellipsis max-w-[250px]">
        {{ rowData.email }}
      </div>
    </template>

    <!-- Phone Column -->
    <template #cell(phone)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.phone }}
      </div>
    </template>

    <!-- Actions Column -->
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit customer"
          @click="$emit('edit-customer', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete customer"
          @click="onCustomerDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { ICustomer } from '../../../stores/customerStore'; // Update with the correct path to your store
import { defineVaDataTableColumns, useModal } from 'vuestic-ui';

const { confirm } = useModal();

const props = defineProps({
  customers: {
    type: Array as PropType<ICustomer[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const columns = defineVaDataTableColumns([
  { label: 'Customer Name', key: 'name', sortable: true },
  { label: 'Email', key: 'email', sortable: false },
  { label: 'Phone', key: 'phone', sortable: false },
  { label: ' ', key: 'actions', align: 'right' },
]);

const emit = defineEmits<{
  (event: 'edit-customer', customer: ICustomer): void;
  (event: 'delete-customer', customer: ICustomer): void;
}>();

const onCustomerDelete = async (customer: ICustomer) => {
  const agreed = await confirm({
    title: 'Delete Customer',
    message: `Are you sure you want to delete the customer "${customer.name}"?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  });

  if (agreed) {
    emit('delete-customer', customer);
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
