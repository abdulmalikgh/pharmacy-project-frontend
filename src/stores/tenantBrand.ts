import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IBrand {
    name:string;
    description:string;
}

export const useTenantBrandStore = defineStore("tenantBrand", () => {
    const brand = ref<IBrand>();
    const brands = ref<IBrand[]>([]);
    const loading = ref<Boolean>(false);

    async function addBrand(payload: IBrand) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/brand", payload);
            brand.value = data;
            brands.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchBrands() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/admin/brand");
            brands.value = data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        brand,
        brands,
        loading,
        addBrand,
        fetchBrands
    };
});
