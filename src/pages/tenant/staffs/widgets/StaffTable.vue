<template>
 <VaDataTable
    :columns="columns"
    :items="staffs"
    :loading="$props.loading"
  >
    <template #cell(fullname)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[150px] ellipsis">
        <UserAvatar :user="rowData" size="small" /> 
        {{ rowData?.first_name }} {{ rowData?.last_name }} 
      </div>
    </template>

    <template #cell(email)="{ rowData }">
      <div class="">
        {{ rowData.email }}
      </div>
    </template>

    <template #cell(phone)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.phone }}
      </div>
    </template>

    <template #cell(role)="{ rowData }">
      <VaBadge :text="rowData.role" />
    </template>

    <template #cell(is_active)="{ rowData }">
      <div class="text-center">
        <VaBadge :text="rowData.is_active == 1 ? 'Active' : 'In-Active'" :color="rowData.is_active == 1 ? 'success' : 'danger'"/>
      </div>
    </template>

    <template #cell(staff_no)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{  rowData?.staff_no }}
      </div>
    </template>

    <template #cell(work_phone_number)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]">
        {{  rowData?.work_phone_number }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit user"
          @click="$emit('edit-staff', rowData as IStaff)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-lock"
          color="danger"
          aria-label="Delete user"
          @click="onStaffDelete(rowData as IStaff)"
        />
      </div>
    </template>
  </VaDataTable>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { IStaff } from '../../../../stores/tenantStaffs'
import { defineVaDataTableColumns, useModal } from 'vuestic-ui'
import UserAvatar from './UserAvatar.vue';

const { confirm } = useModal()

const props = defineProps({
  staffs: {
    type: Array as PropType<IStaff[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  // pagination: { type: Object as PropType<Pagination>, required: true },
  // sortBy: { type: String as PropType<Sorting['sortBy']>, required: true },
  // sortingOrder: { type: String as PropType<Sorting['sortingOrder']>, required: true },
})

const columns = defineVaDataTableColumns([
  { label: 'Full Name', key: 'fullname', sortable: true },
  { label: 'Email', key: 'email', sortable: true },
  { label: 'Phone', key: 'phone', sortable: true },
  { label: 'Role', key: 'role', sortable: true },
  { label: 'Status', key: 'is_active', sortable: true },
  { label: 'Staff Number', key: 'staff_no', sortable: true },
  { label: 'Phone Number', key: 'work_phone_number', sortable: true },
  { label: ' ', key: 'actions', align: 'right' },
])


const emit = defineEmits<{
  (event: 'edit-staff', user: IStaff): void
  (event: 'block-staff', user: IStaff): void
}>()

const onStaffDelete = async (staff: IStaff) => {
  const agreed = await confirm({
    title: 'Block staff',
    message: `Are you sure you want to block ${staff.first_name + " " + staff.last_name}?`,
    okText: 'Yes',
    cancelText: 'No',
    size: 'small',
    maxWidth: '380px',
  })

  if (agreed) {
    emit('block-staff', staff)
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