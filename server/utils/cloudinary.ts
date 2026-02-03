import {v2 as cloudinary} from "cloudinary"

const config=useRuntimeConfig()

cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
})

export const uploadToCloudinary = async(file:string,folder:string='taskflow'):Promise<{url:string;publicId:string}>=>{
    try {
        const result = await cloudinary.uploader.upload(file,{
            folder,
            resource_type:'auto',
        })
        return {
            url:result.secure_url,
            publicId:result.public_id
        }
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error
    }
}

export const deleteFromCloudinary = async(publicId:string):Promise<void>=>{
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error
    }
}