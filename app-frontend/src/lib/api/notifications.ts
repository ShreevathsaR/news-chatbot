import { toast } from "sonner"
import api from "../api"

export async function deleteNotifications() {
    try {
      const response = await api.delete('/notifications')
      if (response.data.success) {
        return toast.success("Notifications cleared successfully!")
      }
    } catch (error) {
      console.error(error)
    }
  }