export const useTask = () => {
  const currentTask = useState<any>('currentTask', () => null);
  const loading = useState('taskLoading', () => false);
  const {fetchWithAuth}=useApi()

  // Fetch task details
  const fetchTask = async (id: string) => {
    loading.value = true;
    try {
      const response: any = await fetchWithAuth(`/api/tasks/${id}`, {
        method: 'GET',
      });
      currentTask.value = response.task;
      return response.task;
    } catch (error: any) {
      console.error('Error fetching task:', error);
      currentTask.value = null;
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Create task
  const createTask = async (data: {
    listId: string;
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    loading.value = true;
    try {
      const response: any = await fetchWithAuth('/api/tasks', {
        method: 'POST',
        body: data,
      });
      return response.task;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Update task
  const updateTask = async (
    id: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: string | null;
      position?: number;
      listId?: string;
    }
  ) => {
    loading.value = true;
    try {
      const response: any = await fetchWithAuth(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: data,
      });
      
      if (currentTask.value?.id === id) {
        currentTask.value = { ...currentTask.value, ...response.task };
      }
      
      return response.task;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    loading.value = true;
    try {
      await fetchWithAuth(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (currentTask.value?.id === id) {
        currentTask.value = null;
      }
      
      return true;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    currentTask: currentTask,
    loading: readonly(loading),
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
  };
};