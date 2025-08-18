import api from "../api"

export async function getQueries() {
    try {
      const response = await api.get('/query')
      return response.data.data
    } catch (error) {
      console.error(error)
    }
  }