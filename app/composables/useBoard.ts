export const useBoard = () => {
  const boards = useState<any[]>('boards', () => []);
  const currentBoard = useState<any>('currentBoard', () => null);
  const loading = useState('boardLoading', () => false);
  const {fetchWithAuth}=useApi()


  const fetchBoards = async (workspaceId: string) => {
    loading.value = true;
    try {
      const response:any = await fetchWithAuth(`/api/workspaces/boards/${workspaceId}`);
      boards.value = response.boards;
      return response.boards;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const fetchBoard = async (id: string, isBackground: boolean = false) => {
    if (!isBackground) loading.value = true;
    try {
      const response:any = await fetchWithAuth(`/api/boards/${id}`);
      currentBoard.value = response.board;
      return response.board;
    } catch (error: any) {
      throw error;
    } finally {
      if (!isBackground) loading.value = false;
    }
  };


  const createBoard = async (data: {
    workspaceId: string;
    name: string;
    description?: string;
    backgroundColor?: string;
  }) => {
    loading.value = true;
    try {
      const response:any = await fetchWithAuth('/api/boards', {
        method: 'POST',
        body: data,
      });

      boards.value.push(response.board);
      return response.board;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateBoard = async (
    id: string,
    data: { name?: string; description?: string; backgroundColor?: string }
  ) => {
    loading.value = true;
    try {
      const response:any = await fetchWithAuth(`/api/boards/${id}`, {
        method: 'PATCH',
        body: data,
      });

    
      const index = boards.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        boards.value[index] = { ...boards.value[index], ...response.board };
      }

     
      if (currentBoard.value?.id === id) {
        currentBoard.value = { ...currentBoard.value, ...response.board };
      }

      return response.board;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  
  const deleteBoard = async (id: string) => {
    loading.value = true;
    try {
      await fetchWithAuth(`/api/boards/${id}`, {
        method: 'DELETE',
      });

      boards.value = boards.value.filter((b) => b.id !== id);

      if (currentBoard.value?.id === id) {
        currentBoard.value = null;
      }

      return true;
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  return {
    boards: boards,
    currentBoard: currentBoard,
    loading: readonly(loading),
    fetchBoards,
    fetchBoard,
    createBoard,
    updateBoard,
    deleteBoard,
  };
};