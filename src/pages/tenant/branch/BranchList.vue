<template>
  <h1 class="page-title">Branches</h1>
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
        <VaButton @click="showAddBranchModal">Add Branch</VaButton>
      </div>

      <BranchTable
        :branches="branches"
        :loading="loading"
        @edit-branch="showEditBranchModal"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowEditBranchModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ branchToEdit ? 'Edit Branch' : 'Add Branch' }}</h1>
      <AddBranch
        ref="editFormRef"
        :branch="branchToEdit"
        :save-button-label="branchToEdit ? 'Save' : 'Add'"
        @close="cancel"
        @save="
          (branch) => {
            onBranchSaved(branch)
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
import { IBranch, useTenantBranchesStore } from '../../../stores/tenantBranches';
import { useToast, useModal } from 'vuestic-ui';

import BranchTable from './widgets/BranchTable.vue';
import AddBranch from './widgets/AddBranch.vue';

const { init: notify } = useToast();

const filters = ref({
  isActive: true,
  search: ''
} as any);

const doShowEditBranchModal = ref(false);
const branchesStore = useTenantBranchesStore();
const { fetchBranches, addBranch, updateBranch } = branchesStore;
const { loading, branches } = storeToRefs(branchesStore);

const editFormRef = ref();
const { confirm } = useModal();
const branchToEdit = ref<IBranch | null>(null);

const showAddBranchModal = () => {
  branchToEdit.value = null;
  doShowEditBranchModal.value = true;
};

const showEditBranchModal = (branch: IBranch) => {
  branchToEdit.value = branch;
  doShowEditBranchModal.value = true;
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

const onBranchSaved = async (branch: IBranch) => {
  if (branchToEdit.value) {
    await updateBranch(branch);
    notify({
      message: `${branch.name} has been updated`,
      color: 'success',
    });
  } else {
    await addBranch(branch);
    notify({
      message: `${branch.name} has been added`,
      color: 'success',
    });
  }
  fetchBranches();
};

onMounted(() => {
  fetchBranches();
});
</script>
