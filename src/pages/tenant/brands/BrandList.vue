<template>
  <h1 class="page-title">Brands</h1>
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
        <VaButton @click="showAddBrandModal">Add Brand</VaButton>
      </div>

      <BrandTable
        :brands="brands"
        :loading="loading"
        @edit-brand="showEditBrandModal"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doShowEditBrandModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ brandToEdit ? 'Edit Brand' : 'Add Brand' }}</h1>
      <AddBrand
        ref="editFormRef"
        :brand="brandToEdit"
        :save-button-label="brandToEdit ? 'Save' : 'Add'"
        @close="cancel"
        @save="
          (brand) => {
            onBrandSaved(brand)
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
import { IBrand, useTenantBrandStore } from '../../../stores/tenantBrand';
import { useToast, useModal } from 'vuestic-ui';

import BrandTable from './widgets/BrandTable.vue';
import AddBrand from './widgets/AddBrand.vue';

const { init: notify } = useToast();

const filters = ref({
  isActive: true,
  search: ''
} as any);

const doShowEditBrandModal = ref(false);
const brandsStore = useTenantBrandStore();
const { fetchBrands, addBrand } = brandsStore;
const { loading, brands } = storeToRefs(brandsStore);

const editFormRef = ref();
const { confirm } = useModal();
const brandToEdit = ref<IBrand | null>(null);

const showAddBrandModal = () => {
  brandToEdit.value = null;
  doShowEditBrandModal.value = true;
};

const showEditBrandModal = (brand: IBrand) => {
  brandToEdit.value = brand;
  doShowEditBrandModal.value = true;
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

const onBrandSaved = async (brand: IBrand) => {
  if (brandToEdit.value) {
    // TODO: ADD UPDATE BRAND
    // await updateBrand(brand);
    // notify({
    //   message: `${brand.name} has been updated`,
    //   color: 'success',
    // });
  } else {
    await addBrand(brand);
    notify({
      message: `${brand.name} has been created`,
      color: 'success',
    });
  }
  fetchBrands();
};

onMounted(() => {
  fetchBrands();
});
</script>
