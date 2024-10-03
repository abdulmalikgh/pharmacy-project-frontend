<template>
   <h1 class="page-title">Staffs</h1>
   <VaCard>
    <VaCardContent>
      <StaffTable
      :staffs="staffs"
      :loading="loading"
      @block-user="handleBlockUser"
      />
    </VaCardContent>
   </VaCard>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useTenantSfaffsStore } from '../../../stores/tenantStaffs';

import StaffTable from './widgets/StaffTable.vue';

const { fetchStaffs } = useTenantSfaffsStore();
const staffsStore = useTenantSfaffsStore();
const { loading, staffs } = storeToRefs(staffsStore)

const handleBlockUser = () => {

}

onMounted(() => {
  fetchStaffs();
})
</script>