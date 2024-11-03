import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface ICustomer {
    id?: number;
    name: string;
    phone: string;
    email: string;
}

export const useCustomerStore = defineStore("tenantCustomer", () => {
    const customer = ref<ICustomer>();
    const customers = ref<ICustomer[]>([]);
    const loading = ref<Boolean>(false);

    async function addCustomer(payload: ICustomer) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/customer", payload);
            customer.value = data;
            customers.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchCustomers() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/customer");
            customers.value = data.data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        loading,
        customers,
        addCustomer,
        fetchCustomers
    };
});
