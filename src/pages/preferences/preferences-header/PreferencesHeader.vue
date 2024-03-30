<template>
  <VaAvatar size="large" color="warning"
    ><span class="text-4xl"> 😍 </span></VaAvatar
  >
  <div class="flex flex-col justify-center">
    <h2 class="text-[28px] md:text-[32px] leading-10 font-bold">
      {{ authenticatedUser.first_name }} {{ authenticatedUser.last_name }}
    </h2>
    <div class="flex space-x-1 text-[13px] leading-4">
      <p>Member since</p>
      <!-- TODO: ADD CREATED AT -->
      <p>{{ authenticatedUser.last_login }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from "../../../stores/auth";
const { authenticatedUser } = useAuthStore();
</script>
