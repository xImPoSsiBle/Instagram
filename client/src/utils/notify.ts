import { toast, type ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    theme: 'colored',
    hideProgressBar: true,
    pauseOnHover: false,
}

export const notify = {
    error: (message: string) => toast.error(message, defaultOptions),
    success: (message: string) => toast.success(message, defaultOptions),
}