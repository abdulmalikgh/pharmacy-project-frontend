<template>
 <VaDataTable
    :columns="columns"
    :items="roles"
    :loading="$props.loading"
  >
    <template #cell(id)="{ rowData }">
        #{{ rowData?.id }}
    </template>
    <template #cell(permissions)="{ rowData }">
        <span v-for="permission in rowData?.permissions" :key="permission">{{ permission }}</span>
    </template>
    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit role"
          @click="$emit('edit-role', rowData as IRole)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-lock"
          color="danger"
          aria-label="Delete role"
          @click="onStaffDelete(rowData as IRole)"
        />
      </div>
    </template>
  </VaDataTable>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import { IRole } from '../../../../stores/tenantRoles';

const { confirm } = useModal()

const props = defineProps({
  roles: {
    type: Array as PropType<IRole[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
})

const columns = defineVaDataTableColumns([
{ label: 'ID', key: 'id' },
  { label: 'Name', key: 'name', sortable: true },
  { label: 'Permissions', key: 'permissions', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])


const emit = defineEmits<{
  (event: 'edit-role', role: IRole): void
  (event: 'delete-role', role: IRole): void
}>()

const onStaffDelete = async (role: IRole) => {
  const agreed = await confirm({
    title: 'Delete role',
    message: `Are you sure you want to delete ${role.name}?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('delete-role', role)
  }
}
</script>
<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}
</style>