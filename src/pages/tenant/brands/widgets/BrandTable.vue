<template>
  <VaDataTable
    :columns="columns"
    :items="brands"
    :loading="$props.loading"
  >
    <!-- Brand Name Column -->
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

    <!-- Actions Column -->
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit brand"
          @click="$emit('edit-brand', rowData)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete brand"
          @click="onBrandDelete(rowData)"
        />
      </div>
    </template>
  </VaDataTable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { IBrand } from '../../../../stores/tenantBrand'; // Update with the correct path to your store
import { defineVaDataTableColumns, useModal } from 'vuestic-ui';

const { confirm } = useModal();

const props = defineProps({
  brands: {
    type: Array as PropType<IBrand[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
});

const columns = defineVaDataTableColumns([
  { label: 'Brand Name', key: 'name', sortable: true },
  { label: 'Description', key: 'description', sortable: false },
  { label: ' ', key: 'actions', align: 'right' },
]);

const emit = defineEmits<{
  (event: 'edit-brand', brand: IBrand): void;
  (event: 'delete-brand', brand: IBrand): void;
}>();

const onBrandDelete = async (brand: IBrand) => {
  const agreed = await confirm({
    title: 'Delete Brand',
    message: `Are you sure you want to delete the brand "${brand.name}"?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  });

  if (agreed) {
    emit('delete-brand', brand);
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
