<template>
  <VaForm v-slot="{ isValid }" ref="add-brand-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col w-full">
        <!-- Brand Name Input -->
        <VaInput
          v-model="newBrand.name"
          label="Brand Name"
          class="w-full"
          :rules="[validators.required]"
          name="name"
        />

        <!-- Brand Description Input -->
        <VaInput
          v-model="newBrand.description"
          label="Description"
          class="w-full"
          :rules="[validators.required]"
          name="description"
        />
      </div>

      <!-- Action Buttons -->
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
import { IBrand } from '../../../../stores/tenantBrand';
import { isEqual } from 'lodash';

const props = defineProps({
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
  brand: {
    type: Object as PropType<IBrand | null>,
    default: null,
  },
});

const defaultBrand: IBrand = {
  id: -1,
  name: '',
  description: '',
};

const newBrand = ref<IBrand>({
  ...defaultBrand
});

const isFormHasUnsavedChanges = computed(() => {
  const brandToCompare = props.brand ?? defaultBrand;
  return Object.keys(newBrand.value).some((key) => {
    return !isEqual(newBrand.value[key as keyof IBrand], brandToCompare[key as keyof IBrand]);
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  () => props.brand,
  () => {
    if (!props.brand) {
      return;
    }
    newBrand.value = {
      ...props.brand,
    };
  },
  { immediate: true },
);

const form = useForm('add-brand-form');
const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newBrand.value);
  }
};
</script>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}
</style>
