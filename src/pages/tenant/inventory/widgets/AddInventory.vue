<template>
  <VaForm v-slot="{ isValid }" ref="add-inventory-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col w-full">
        <!-- Inventory Name Input -->
        <VaInput
          v-model="newInventory.name"
          label="Inventory Name"
          class="w-full"
          :rules="[validators.required]"
          name="name"
        />

        <!-- Inventory Description Input -->
        <VaInput
          v-model="newInventory.description"
          label="Description"
          class="w-full"
          :rules="[validators.required]"
          name="description"
        />

        <!-- Quantity Input -->
        <VaInput
          v-model="newInventory.quantity"
          label="Quantity"
          class="w-full"
          type="number"
          :rules="[validators.required, validators.numeric]"
          name="quantity"
        />

        <!-- Price Input -->
        <VaInput
          v-model="newInventory.price"
          label="Price"
          class="w-full"
          type="number"
          :rules="[validators.required, validators.numeric]"
          name="price"
        />

        <div class="flex flex-col gap-2 mt-4">
        <label class="font-semibold mb-2">Expiry Date</label>
        <div class="flex flex-col gap-1">
          <VaDatePicker
          v-model="newInventory.expiry_date"
          label="Expiry Date"
          class="w-full"
          :rules="[validators.required]"
          name="expiry_date"
        />
        </div>
      </div>
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
import { IInventory } from '../../../../stores/tenantIventory';
import { isEqual } from 'lodash';

const props = defineProps({
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
  inventoryItem: {
    type: Object as PropType<IInventory | null>,
    default: null,
  },
});

const defaultInventory: IInventory = {
  id: -1,
  name: '',
  description: '',
  quantity: 0,
  price: 0,
  expiry_date: '',
};

const newInventory = ref<IInventory>({
  ...defaultInventory
});

const isFormHasUnsavedChanges = computed(() => {
  const inventoryToCompare = props.inventoryItem ?? defaultInventory;
  return Object.keys(newInventory.value).some((key) => {
    return !isEqual(newInventory.value[key as keyof IInventory], inventoryToCompare[key as keyof IInventory]);
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  () => props.inventoryItem,
  () => {
    if (!props.inventoryItem) {
      return;
    }
    newInventory.value = {
      ...props.inventoryItem,
    };
  },
  { immediate: true },
);

const form = useForm('add-inventory-form');
const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newInventory.value);
  }
};
</script>

<style scoped>
.flex-col {
  display: flex;
  flex-direction: column;
}
</style>
