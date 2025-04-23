
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  // Return empty provider without rendering toasts
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
