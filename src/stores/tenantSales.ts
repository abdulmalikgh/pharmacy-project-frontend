import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface ISale {
    customer_id:number;
    inventory_id:number;
    quantity:number;
}

export const useAuthStore = defineStore("tentatSales", () => {
    const sale = ref<ISale>();
    const sales = ref<ISale[]>([]);
    const loading = ref<Boolean>(false);

    async function addSale(payload: ISale) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/salesPoint", payload);
            sale.value = data;
            sales.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        addSale,
    };
});
