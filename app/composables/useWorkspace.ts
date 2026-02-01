

export const useWorkspace=()=>{
    const workspaces = useState<any[]>("workspaces",()=>[])
    const currentWorkspace = useState<any>("currentWorkspace",()=>null)
    const loading = useState<boolean>("workspaceLoading",()=>false)

    const {fetchWithAuth}=useApi()

    const fetchWorkspaces = async()=>{
        loading.value=true;
        try {
            const response:any = await fetchWithAuth('/api/workspaces',{
                method:"GET",
                credentials:"include"
            })
            workspaces.value=response.workspaces
            return response.workspaces
        } catch (error) {
            throw error;
        } finally{
            loading.value=false
        }
    }

    const fetchWorkspace=async(id:string)=>{
        loading.value=true
        try {
            const response:any = await fetchWithAuth(`/api/workspaces/${id}`,{
                method:"GET",
                credentials:"include"
            })
            currentWorkspace.value=response.workspace
            return response.workspace
            
        } catch (error) {
            throw error;
            
        } finally{
            loading.value=false
        }
    }

    const createWorkspace = async(data:{name:string,description?:string})=>{
        loading.value=true;
        try {
            const response:any=await fetchWithAuth('/api/workspaces',{
                method:"POST",
                credentials:"include",
                body:data
            })
            workspaces.value.push(response?.workspace)
            return response
        } catch (error) {
            throw error;
        } finally{
            loading.value=false
        }
    }

    const updateWorkspace=async(id:string,data:{name?:string,description?:string})=>{
        loading.value=true
        try {
            const response:any = await fetchWithAuth(`/api/workspaces/${id}`,{
                method:"PATCH",
                credentials:"include",
                body:data
            })
            const index = workspaces.value.findIndex(w=>w.id===id)
            if(index!==-1){
                workspaces.value[index]={...workspaces.value[index],...response.workspace}
            }
            if(currentWorkspace?.value.id===id){
                currentWorkspace.value={...currentWorkspace.value,...response.workspace}
            }
            return response.workspace
        } catch (error) {
            throw error;
        } finally{
            loading.value=false
        }
    }

    const deleteWorkspace = async(id:string)=>{
        loading.value=true
        try {
            const response:any = await fetchWithAuth(`/api/workspaces/${id}`,{
                method:"DELETE",
                credentials:"include",
            })
            workspaces.value=workspaces.value.filter(w=>w.id!==id)
            if(currentWorkspace.value.id===id){
                currentWorkspace.value=null
            }
            return response.workspace
        } catch (error) {
            throw error
        } finally{
            loading.value=false
        }
    }

    // Invite member
const inviteMember = async (workspaceId: string, email: string, role: string = 'member') => {
  loading.value = true;
  try {
    const response: any = await fetchWithAuth(`/api/workspaces/${workspaceId}/members/invite`, {
      method: 'POST',
      body: { email, role },
    });
    return response;
  } catch (error: any) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Remove member
const removeMember = async (workspaceId: string, memberId: string) => {
  loading.value = true;
  try {
    await fetchWithAuth(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error: any) {
    throw error;
  } finally {
    loading.value = false;
  }
};

// Update member role
const updateMemberRole = async (workspaceId: string, memberId: string, role: string) => {
  loading.value = true;
  try {
    const response: any = await fetchWithAuth(`/api/workspaces/${workspaceId}/members/${memberId}`, {
      method: 'PATCH',
      body: { role },
    });
    return response;
  } catch (error: any) {
    throw error;
  } finally {
    loading.value = false;
  }
};


    return{
        fetchWorkspaces,
        fetchWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        workspaces,
        currentWorkspace,
        inviteMember,
        removeMember,
        updateMemberRole,
        loading:readonly(loading)
    }

}