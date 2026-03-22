import toast from "react-hot-toast";
import SystemToast from "../components/ui/SystemToast";

export const showSuccess = (message) => {
    toast.custom((t) => (
        <SystemToast
            toast={{ type: "success", message }}
            onClick={() => toast.dismiss(t.id)}
        />
    ));
};

export const showError = (message) => {
    toast.custom((t) => (
        <SystemToast
            toast={{ type: "error", message }}
            onClick={() => toast.dismiss(t.id)}
        />
    ));
};

export const showInfo = (message) => {
    toast.custom((t) => (
        <SystemToast
            toast={{ type: "info", message }}
            onClick={() => toast.dismiss(t.id)}
        />
    ));
};