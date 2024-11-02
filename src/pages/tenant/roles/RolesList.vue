<template>
   <h1 class="page-title">Roles</h1>
   <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddUserModal">Add role</VaButton>
      </div>

      <RoleTable
        :roles="roles"
        :loading="loading"
        @delete-role="handleDeleteRole"
        @edit-role="showEditRoleModal"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doshowEditRoleModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ roleToEdit ? 'Edit role' : 'Add role' }}</h1>
      <AddRole
        ref="editFormRef"
        :role="roleToEdit"
        :save-button-label="roleToEdit ? 'Save' : 'Add'"
        :permissions="permissions"
        @close="cancel"
        @save="
          (role) => {
            onroleSaved(role)
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
import { IRole, useTenantRolesStore } from '../../../stores/tenantRoles';
import { useToast, useModal } from 'vuestic-ui'

import RoleTable from './widgets/RoleTable.vue';
import AddRole from './widgets/AddRole.vue';

const { init: notify } = useToast()

const filters = ref({
  isActive: true,
  search: ''
} as any)

const doshowEditRoleModal = ref(false)
const { 
      addRole,
      updateRole,
      fetchRoles,fetchPermissions } = useTenantRolesStore();
const roleStore = useTenantRolesStore();
const { 
    roles,
    loading, 
    permissions
  } = storeToRefs(roleStore)

const handleDeleteRole = async (role : any) => {

  notify({
    message: `${role.first_name} ${role.last_name} has been deleted`,
    color: 'success',
  })
}

const showAddUserModal = () => {
  roleToEdit.value = null
  doshowEditRoleModal.value = true
}

const showEditRoleModal = (role: IRole) => {
  roleToEdit.value = role
  doshowEditRoleModal.value = true
}

const editFormRef = ref()

const { confirm } = useModal()

const roleToEdit = ref<IRole | null>(null)

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

const onroleSaved = async (role: IRole) => {
  if (roleToEdit.value) {
    await updateRole(role?.id, role)
    notify({
      message: `${role.name} has been updated`,
      color: 'success',
    })
  } else {
    addRole(role)
    notify({
      message: `${role.name} has been created`,
      color: 'success',
    })
  }
}

onMounted(() => {
  fetchRoles();
  fetchPermissions()
})
</script>