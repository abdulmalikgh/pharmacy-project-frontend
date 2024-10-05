<template>
   <h1 class="page-title">Staffs</h1>
   <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaButtonToggle
            v-model="filters.isActive"
            color="background-element"
            border-color="background-element"
            :options="[
              { label: 'Active', value: true },
              { label: 'Inactive', value: false },
            ]"
          />
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add Staff</VaButton>
      </div>

      <StaffTable
        :staffs="staffs"
        :loading="loading"
        @block-staff="handleBlockUser"
        @edit-staff="showEditStaffModal"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowEditStaffModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ staffToEdit ? 'Edit staff' : 'Add staff' }}</h1>
      <AddStaff
        ref="editFormRef"
        :staff="staffToEdit"
        :save-button-label="staffToEdit ? 'Save' : 'Add'"
        @close="cancel"
        @save="
          (staff) => {
            onStaffSaved(staff)
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
import { IStaff, useTenantSfaffsStore } from '../../../stores/tenantStaffs';
import { useToast, useModal } from 'vuestic-ui'

import StaffTable from './widgets/StaffTable.vue';
import AddStaff from './widgets/AddStaff.vue';

const { init: notify } = useToast()

const filters = ref({
  isActive: true,
  search: ''
} as any)

const doShowEditStaffModal = ref(false)
const { fetchStaffs,blockStaff, addStaff } = useTenantSfaffsStore();
const staffsStore = useTenantSfaffsStore();
const { loading, staffs } = storeToRefs(staffsStore)

const handleBlockUser = async (staff : any) => {
  await blockStaff(staff?.id)
  await fetchStaffs();
  notify({
    message: `${staff.first_name} ${staff.last_name} has been block`,
    color: 'success',
  })
}

const showAddUserModal = () => {
  staffToEdit.value = null
  doShowEditStaffModal.value = true
}

const showEditStaffModal = (staff: IStaff) => {
  staffToEdit.value = staff
  doShowEditStaffModal.value = true
}

const editFormRef = ref()

const { confirm } = useModal()

const staffToEdit = ref<IStaff | null>(null)

const beforeEditFormModalClose = async (hide: () => unknown) => {
  if (editFormRef.value.isFormHasUnsavedChanges) {
    const agreed = await confirm({
      maxWidth: '380px',
      message: 'Form has unsaved changes. Are you sure you want to close it?',
      size: 'small',
    })
    if (agreed) {
      hide()
    }
  } else {
    hide()
  }
}

const onStaffSaved = async (staff: IStaff) => {
  if (staffToEdit.value) {
    await addStaff(staff)
    notify({
      message: `${staff.first_name} ${staff.last_name}  has been updated`,
      color: 'success',
    })
  } else {
    addStaff(staff)
    notify({
      message: `${staff.first_name} ${staff.last_name}  has been created`,
      color: 'success',
    })
  }
}

onMounted(() => {
  fetchStaffs();
})
</script>