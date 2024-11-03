<script setup lang="ts">
import { PropType, computed, ref, watch } from 'vue'
import { useForm } from 'vuestic-ui'
import { validators } from '../../../../services/utils'
import { IRole } from '@/stores/tenantRoles';
import { isEqual } from 'lodash';

const props = defineProps({
  role: {
    type: Object as PropType<IRole | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: 'Save',
  },
  permissions: {
    type: Array
  }
})

const defaultnewRole: IRole = {
  id: -1,
  name: '',
  permissions: []
}

const newRole = ref<IRole>({ ...defaultnewRole });

const isFormHasUnsavedChanges = computed(() => {
  const roleToCompare = props.role ?? defaultnewRole;

  return Object.keys(newRole.value).some((key) => {
    return !isEqual(newRole.value[key as keyof IRole], roleToCompare[key as keyof IRole]);
  });
});

defineExpose({
  isFormHasUnsavedChanges,
})

watch(
  () => props.role,
  () => {
    if (!props.role) {
      return
    }

    newRole.value = {
      ...props.role,
    }
  },
  { immediate: true },
)

const form = useForm('add-role-form')

const emit = defineEmits(['close', 'save']);

const onSave = () => {
  if (form.validate()) {
    emit('save', newRole.value)
  }
}

</script>

<template>
  <VaForm v-slot="{ isValid }" ref="add-role-form" class="flex-col justify-start items-start gap-4 inline-flex w-full">
    
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="">{{ isValid }}</div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newRole.name"
          label="Name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
      </div>

      <div class="flex flex-col gap-2 mt-4">
        <label class="font-semibold mb-2">Permissions:</label>
        <div class="flex flex-col gap-1">
          <VaCheckbox
            v-for="(permission, index) in permissions"
            :key="index"
            v-model="newRole.permissions"
            :label="permission"
            :array-value="permission"
            :rules="[validators.required]"
          />
        </div>
      </div>

      <div class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center">
        <VaButton preset="secondary" color="secondary" @click="$emit('close')">Cancel</VaButton>
        <VaButton :disabled="!isValid" @click="onSave">{{ saveButtonLabel }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
