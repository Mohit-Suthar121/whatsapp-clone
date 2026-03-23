import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useLoginStore = create(
    persist(
        (set) => ({
            step: 1,
            userPhoneData: null,
            setStep: (number) => set({ step:number }),
            setUserPhoneData: (data) => set({ userPhoneData: data }),
            resetLoginStatus: () => set({ step: 1, userPhoneData: null }),
        }),
        {
            name: "login-storage",
            partialize: (state) => ({
                step: state.step,
                userPhoneData: state.userPhoneData
            })

        }
    )

)