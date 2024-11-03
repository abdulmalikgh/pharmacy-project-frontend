<template>
  <VaDataTable
    :columns="columns"
    :items="branches"
    :loading="$props.loading"
  >
    <template #cell(name)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.name }}
      </div>
    </template>

    <template #cell(location)="{ rowData }">
      <div class="ellipsis max-w-[200px]">
        {{ rowData.location }}
      </div>
    </template>

    <template #cell(address)="{ rowData }">
      <div class="ellipsis max-w-[250px]">
        {{ rowData.address }}
      </div>
    </template>

    <template #cell(manager)="{ rowData }">
      <div class="ellipsis max-w-[200px]">
        {{ rowData.manager ? rowData.manager : 'N/A' }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit branch"
          @click="$emit('edit-branch', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete branch"
          @click="onBranchDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IBranch } from '../../../../stores/tenantBranches'; // Update with the correct path to your store
import { defineVaDataTableColumns, useModal } from 'vuestic-ui';

const { confirm } = useModal();

const props = defineProps({
  branches: {
    type: Array as PropType<IBranch[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const columns = defineVaDataTableColumns([
  { label: 'Branch Name', key: 'name', sortable: true },
  { label: 'Location', key: 'location', sortable: true },
  { label: 'Address', key: 'address', sortable: true },
  { label: 'Manager', key: 'manager', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
]);

const emit = defineEmits<{
  (event: 'edit-branch', branch: IBranch): void;
  (event: 'delete-branch', branch: IBranch): void;
}>();

const onBranchDelete = async (branch: IBranch) => {
  const agreed = await confirm({
    title: 'Delete Branch',
    message: `Are you sure you want to delete the branch "${branch.name}"?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  });

  if (agreed) {
    emit('delete-branch', branch);
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
