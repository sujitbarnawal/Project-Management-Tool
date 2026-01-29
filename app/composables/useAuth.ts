export const useAuth = () => {
  const user = useState<any>("user", () => null);
  const loading = useState("authLoading", () => false);
  const userCookie = useCookie("userCookie")

  if(!user.value && userCookie.value){
    user.value=userCookie.value
  }


  //register user
  const register = async (data: {
    email: string;
    password: string;
    name: string;
  }) => {
    loading.value = true;
    try {
      const response: any = await $fetch("/api/auth/register", {
        method: "POST",
        body: data,
        credentials:'include'
      });
      user.value = response.user;
      userCookie.value=response.user
      return response;
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  //login user
  const login = async (data: { email: string; password: string }) => {
    loading.value = true;
    try {
      const response: any = await $fetch("/api/auth/login", {
        method: "POST",
        body: data,
        credentials:'include'
      });
      user.value = response.user;
      userCookie.value=response.user
      return response;
    } catch (error) {
      console.log("error");
      throw error;
    } finally {
      loading.value = false;
    }
  };

  //logout
  const logout = async () => {
    loading.value = true;
    try {
      const response = await $fetch("/api/auth/logout", {
        method: "POST",
      });
      user.value = null;
      userCookie.value=null;
      return response;
    } catch (error) {
      console.log("error");
    } finally {
      loading.value = false;
    }
  };

  //get user data
  const fetchUser = async()=>{
    loading.value=true
    try {
        const response:any = await $fetch('/api/auth/me',{
            method:"GET",
            credentials:'include'
        })
        user.value=response.user
        return response.user
        
    } catch (error) {
        user.value=null
        return null
    } finally{
        loading.value=false
    }
  }

  //refresh token
  const refreshToken=async()=>{
    try {
        const response:any = await $fetch('/api/auth/refresh',{
            method:"POST",
            credentials:'include'
        })
        user.value=response.user
        return response.user
    } catch (error) {
        user.value=null
        return null
    }
  }

  return{
    user,
    loading:readonly(loading),
    register,
    login,
    logout,
    fetchUser,
    refreshToken
  }
};
