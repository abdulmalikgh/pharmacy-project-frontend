<template>
  <VaForm v-slot="{ isValid }" ref="add-customer-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>
      <div class="flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.email"
          label="Email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
      </div>
      <div class="flex-col sm:flex-row w-full">
        <VaInput
          v-model="newCustomer.phone"
          label="Phone"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.phone]"
          name="phone"
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
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { validators } from '../../../../services/utils'

const props = defineProps({
  customer: {
    type: Object as PropType<{ id: number, name: string, email: string, phone: string } | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
})

const defaultNewCustomer = {
  id: -1,
  name: '',
  email: '',
  phone: ''
}

const newCustomer = ref({ ...defaultNewCustomer });

const isFormHasUnsavedChanges = computed(() => {
  const customerToCompare = props.customer ?? defaultNewCustomer;
  return Object.keys(newCustomer.value).some((key) => {
    return newCustomer.value[key as keyof typeof newCustomer.value] !== customerToCompare[key as keyof typeof customerToCompare];
  });
});

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.customer,
  () => {
    if (!props.customer) {
      return;
    }
    newCustomer.value = { ...props.customer };
  },
  { immediate: true },
)

const form = useForm('add-customer-form')

const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newCustomer.value)
  }
}
</script>
