// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css:["/assets/css/main.css"],
  app:{
    head:{
      titleTemplate:"%s-TaskFlow",
      meta:[
        {name:"description",content:"Task Management Tool"}
      ]
    },
    pageTransition:{
      mode:"out-in",name:"page"
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    databaseUrl: process.env.DATABASE_URL,
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    
    public: {
      baseUrl: process.env.BASE_URL,
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
})
