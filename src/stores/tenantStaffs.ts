import { computed, ref, watch } from "vue";

import ApiService from "../services/ApiService";
import { defineStore } from "pinia";
import { useToast } from "vuestic-ui";


export interface IStaff {
    first_name:string;
    last_name:string;
    email:string;
    phone:string;
    dob:string;
    staff_no:string;
}

export const useAuthStore = defineStore("tenantStaffs", () => {
    const staff = ref<IStaff>();
    const staffs = ref<IStaff[]>([]);
    const loading = ref<Boolean>(false);

    async function addStaff(payload: IStaff) {
        loading.value = true;
        try {
            const { data } = await ApiService.post("/tenant/admin/staff", payload);
            staff.value = data;
            staffs.value?.unshift(data)
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function fetchStaffs() {
        loading.value = true;
        try {
            const { data } = await ApiService.get("/tenant/admin/staff");
            staffs.value = data;
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    async function blockStaff(id: any) {
        loading.value = true;
        try {
            const { data } = await ApiService.patch(`/tenant/admin/block/${id}/staff`);
            return data;
        } catch (error: any) {
            throw error.response;
        } finally {
            loading.value = false;
        };
    };

    return {
        addStaff,
        blockStaff,
        fetchStaffs,
    };
});
