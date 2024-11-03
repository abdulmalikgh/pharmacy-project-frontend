<template>
  <h1 class="page-title">Customers</h1>
  <VaCard>
    <VaCardContent>
      <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
        <div class="flex flex-col md:flex-row gap-2 justify-start">
          <VaInput v-model="filters.search" placeholder="Search Customers">
            <template #prependInner>
              <VaIcon name="search" color="secondary" size="small" />
            </template>
          </VaInput>
        </div>
        <VaButton @click="showAddCustomerModal">Add Customer</VaButton>
      </div>

      <CustomerTable
        :customers="customers"
        :loading="loading"
        @delete-customer="handleDeleteCustomer"
        @edit-customer="showEditCustomerModal"
      />
    </VaCardContent>

    <VaModal
      v-slot="{ cancel, ok }"
      v-model="doshowEditCustomerModal"
      size="small"
      mobile-fullscreen
      close-button
      hide-default-actions
      :before-cancel="beforeEditFormModalClose"
    >
      <h1 class="va-h5">{{ customerToEdit ? 'Edit Customer' : 'Add Customer' }}</h1>
      <AddCustomer
        ref="editFormRef"
        :customers="customerToEdit"
        :save-button-label="customerToEdit ? 'Save' : 'Add'"
        @close="cancel"
        @save="
          (customer) => {
            onCustomerSaved(customer)
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
import { ICustomer, useCustomerStore } from '../../../stores/tenantCustomer'; // Update with the correct path
import { useToast, useModal } from 'vuestic-ui';

import CustomerTable from "./widgets/CustomerTable.vue"; 
import AddCustomer from './widgets/AddCustomer.vue'; 

const { init: notify } = useToast();

const filters = ref({
  search: '',
});

const { addCustomer, fetchCustomers } = useCustomerStore();
const customerStore = useCustomerStore();
const { customers, loading } = storeToRefs(customerStore);

const doshowEditCustomerModal = ref(false)
const handleDeleteCustomer = async (customer: ICustomer) => {
  notify({
    message: `${customer.name} has been deleted`,
    color: 'success',
  });
}

const showAddCustomerModal = () => {
  customerToEdit.value = null;
  doshowEditCustomerModal.value = true;
}

const showEditCustomerModal = (customer: ICustomer) => {
  customerToEdit.value = customer;
  doshowEditCustomerModal.value = true;
}

const editFormRef = ref();
const { confirm } = useModal();
const customerToEdit = ref<ICustomer | null>(null);

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
}

const onCustomerSaved = async (customer: ICustomer) => {
  if (customerToEdit.value) {
    // await updateCustomer(customer?.id, customer);
    // notify({
    //   message: `${customer.name} has been updated`,
    //   color: 'success',
    // });
  } else {
    await addCustomer(customer);
    notify({
      message: `${customer.name} has been added`,
      color: 'success',
    });
  }
}

onMounted(() => {
  fetchCustomers();
});
</script>
