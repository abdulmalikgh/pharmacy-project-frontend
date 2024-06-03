import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import JwtService from "../services/JwtService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IBrand {
    name:string;
    description:string;
}

export const useAuthStore = defineStore("tenantBrand", () => {
    const branch = ref<IBrand>();
    const branches = ref<IBrand[]>([]);
    const loading = ref<Boolean>(false);

    async function addBrand(payload: IBrand) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/brand", payload);
            branch.value = data;
            branches.value?.unshift(data)
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
            branches.value = data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        addBrand,
        fetchBrands
    };
});
