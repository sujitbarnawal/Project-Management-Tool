export const useList = () => {
  const loading = useState('listLoading', () => false);
  const {fetchWithAuth}=useApi()

  // Create list
  const createList = async (data: { boardId: string; title: string }) => {
    loading.value = true;
    try {
      const response: any = await fetchWithAuth('/api/lists', {
        method: 'POST',
        body: data,
      });
      return response.list;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Update list
  const updateList = async (id: string, data: { title?: string; position?: number }) => {
    loading.value = true;
    try {
      const response: any = await fetchWithAuth(`/api/lists/${id}`, {
        method: 'PATCH',
        body: data,
      });
      return response.list;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  // Delete list
  const deleteList = async (id: string) => {
    loading.value = true;
    try {
      await fetchWithAuth(`/api/lists/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading: readonly(loading),
    createList,
    updateList,
    deleteList,
  };
};