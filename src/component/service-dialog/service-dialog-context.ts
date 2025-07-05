import {LngLat} from "@/component/map-view/map-view";
import {createContext} from "react";

type ServiceDialogContextType = {
    openDialog: (location: LngLat) => void,
}

export const ServiceDialogContext = createContext<ServiceDialogContextType>({
    openDialog: () => {
        throw new Error("no initialized service dialog context");
    },
});
