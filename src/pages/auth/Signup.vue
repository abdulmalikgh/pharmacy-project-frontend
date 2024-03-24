<template>
  <VaForm ref="form" @submit.prevent="submit">
    <h1 class="font-semibold text-4xl mb-4">Sign up</h1>
    <p class="text-base mb-4 leading-5">
      Have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-primary"
        >Login</RouterLink
      >
    </p>
    <h2 class="mb-2 font-semibold">Company Information</h2>
    <VaInput
      v-model="formData.company_name"
      :rules="[(v) => !!v || 'Company name field is required']"
      class="mb-4"
      label="Company Name"
      type="text"
    />
    <VaInput
      v-model="formData.company_email"
      :rules="[
        (v) => !!v || 'Company Email field is required',
        (v) => /.+@.+\..+/.test(v) || 'Company Email should be valid',
      ]"
      class="mb-4"
      label="Company Email"
      type="email"
    />
    <VaInput
      v-model="formData.company_phone"
      :rules="[(v) => !!v || 'Company Phone field is required']"
      class="mb-4"
      label="Company Phone"
      type="phone"
    />
    <h2 class="mb-2 font-semibold">Personal Information</h2>
    <VaInput
      v-model="formData.first_name"
      :rules="[(v) => !!v || 'First name field is required']"
      class="mb-4"
      label="First Name"
      type="text"
    />
    <VaInput
      v-model="formData.last_name"
      :rules="[(v) => !!v || 'Last name field is required']"
      class="mb-4"
      label="Last Name"
      type="text"
    />
    <VaInput
      v-model="formData.email"
      :rules="[
        (v) => !!v || 'Email field is required',
        (v) => /.+@.+\..+/.test(v) || 'Email should be valid',
      ]"
      class="mb-4"
      label="Email"
      type="email"
    />
    <VaInput
      v-model="formData.phone"
      :rules="[(v) => !!v || 'Phone field is required']"
      class="mb-4"
      label="Phone"
      type="tel"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        ref="password1"
        v-model="formData.password"
        :rules="passwordRules"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        messages="Password should be 8+ characters: letters, numbers, and special characters."
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
      <VaInput
        ref="password2"
        v-model="formData.repeatPassword"
        :rules="[
          (v) => !!v || 'Repeat Password field is required',
          (v) => v === formData.password || 'Passwords don\'t match',
        ]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Repeat Password"
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Create account</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useForm, useToast } from "vuestic-ui";
import { useAuthStore } from "../../stores/auth";

const { validate } = useForm("form");
const { push } = useRouter();
const { init } = useToast();
const authStore = useAuthStore();
const formData = ref({
  company_name: "",
  company_email: "",
  company_phone: "",
  first_name: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
  repeatPassword: "",
}) as any;

const submit = async () => {
  if (validate()) {
    authStore
      .register(formData.value)
      .then((res) => {
        console.log("hhh", res);
        if (res) {
          init({
            message: "You've successfully signed up",
            color: "success",
          });
          push({ name: "dashboard" });
        }
      })
      .catch((error) => console.log("********", error));
  }
};

const passwordRules: ((v: string) => boolean | string)[] = [
  (v) => !!v || "Password field is required",
  (v) => (v && v.length >= 8) || "Password must be at least 8 characters long",
  (v) =>
    (v && /[A-Za-z]/.test(v)) || "Password must contain at least one letter",
  (v) => (v && /\d/.test(v)) || "Password must contain at least one number",
  (v) =>
    (v && /[!@#$%^&*(),.?":{}|<>]/.test(v)) ||
    "Password must contain at least one special character",
];
</script>
