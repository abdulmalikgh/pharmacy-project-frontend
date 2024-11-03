<template>
  <VaForm v-slot="{ isValid }" ref="add-branch-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col w-full">
        <VaInput
          v-model="newBranch.name"
          label="Branch Name"
          class="w-full"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput
          v-model="newBranch.location"
          label="Location"
          class="w-full"
          :rules="[validators.required]"
          name="location"
        />
        <VaInput
          v-model="newBranch.address"
          label="Address"
          class="w-full"
          :rules="[validators.required]"
          name="address"
        />
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watch } from 'vue';
import { useForm } from 'vuestic-ui';
import { validators } from '../../../../services/utils';
import { IBranch } from '@/stores/tenantBranches';
import { isEqual } from 'lodash'

const props = defineProps({
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
  branch: {
    type: Object as PropType<IBranch | null>,
    default: null,
  }
});

const defaultBranch = {
  id: -1,
  name: '',
  location: '',
  address: '',
}

const newBranch = ref({
  ...defaultBranch
});

const isFormHasUnsavedChanges = computed(() => {
  const brandToCompare = props.branch ?? defaultBranch;
defaultBranch
  return Object.keys(newBranch.value).some((key) => {
    return !isEqual(newBranch.value[key as keyof IBranch], defaultBranch[key as keyof IBranch]);
  });
});

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.branch,
  () => {
    if (!props.branch) {
      return
    }

    newBranch.value = {
      ...props.branch,
    }
  },
  { immediate: true },
)

const form = useForm('add-branch-form');

const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newBranch.value);
  }
};

</script>

