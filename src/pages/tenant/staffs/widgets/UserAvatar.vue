<script setup lang="ts">
import { PropType } from 'vue'
import { IStaff } from '../../../../stores/tenantStaffs';

const avatarColor = (userName: string) => {
  const colors = ['primary', '#FFD43A', '#ADFF00', '#262824', 'danger']
  const index = userName.charCodeAt(0) % colors.length
  return colors[index]
}

defineProps({
  user: {
    type: Object as PropType<IStaff>,
    required: true,
  },
  size: {
    type: String,
    default: 'medium',
  },
})

const isUrl = (avatar: string) => {
  return avatar.startsWith('http') || avatar.startsWith('blob:')
}
</script>

<template>
  <VaAvatar
    :size="size"
    :src="''"
    :fallback-text="user?.first_name[0]"
    :color="avatarColor(user?.first_name)"
  />
</template>
