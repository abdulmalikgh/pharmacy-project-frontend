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
import { useToast } from 'vuestic-ui'

import StaffTable from './widgets/StaffTable.vue';

const { init: notify } = useToast()

const { fetchStaffs,blockStaff } = useTenantSfaffsStore();
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

onMounted(() => {
  fetchStaffs();
})
</script>