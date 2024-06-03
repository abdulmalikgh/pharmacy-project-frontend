import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IIventory {
    name:string;
    description:string;
    quantity: number;
    price: number,
    expiry_date: string
}

export interface IIventToBrand {
    quantity: number;
    branch_id: number;
    inventory_id: number
}

export const useAuthStore = defineStore("tenantInventory", () => {
    const inventory = ref<IIventory>();
    const inventories = ref<IIventory[]>([]);
    const loading = ref<Boolean>(false);

    async function addInventory(payload: IIventory) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/inventory", payload);
            inventory.value = data;
            inventories.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function addInventoryToBrand(payload: IIventToBrand) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/add/branch/inventory", payload);
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchInventory() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/admin/inventory");
            inventories.value = data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        addInventory,
        fetchInventory,
        addInventoryToBrand
    };
});
