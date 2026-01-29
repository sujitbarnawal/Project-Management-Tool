

export const useWorkspace=()=>{
    const workspaces = useState<any[]>("workspaces",()=>[])
    const currentWorkspace = useState<any>("currentWorkspace",()=>null)
    const loading = useState<boolean>("workspaceLoading",()=>false)

    const fetchWorkspaces = async()=>{
        loading.value=true;
        try {
            const response:any = await $fetch('/api/workspaces',{
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

    const fetchWorkspaceById=async(id:string)=>{
        loading.value=true
        try {
            const response = await $fetch(`/api/workspaces/${id}`,{
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
            const response:any=await $fetch('/api/workspaces',{
                method:"POST",
                credentials:"include",
                body:data
            })
            workspaces.value.push(response?.workspace)
            return response.workspace
        } catch (error) {
            throw error;
        } finally{
            loading.value=false
        }
    }

    const updateWorkspace=async(id:string,data:{name?:string,description?:string})=>{
        loading.value=true
        try {
            const response:any = await $fetch(`/api/workspaces/${id}`,{
                method:"PATCH",
                credentials:"include",
                body:data
            })
            const index = workspaces.value.findIndex(w=>w.id===id)
            if(index!==-1){
                workspaces.value={...workspaces.value[index],...response.workspace}
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
            const response:any = await $fetch(`/api/workspaces/${id}`,{
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

    return{
        fetchWorkspaces,
        fetchWorkspaceById,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        workspaces,
        currentWorkspace,
        loading:readonly(loading)
    }

}