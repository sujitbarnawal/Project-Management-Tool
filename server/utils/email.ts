import nodemailer from "nodemailer"


const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
       user:config.smtpEmail,
       pass:config.smtpPass
    },
    
})
// console.log(config.smtpEmail,config.smtpPass)

export const sendInviteEmail = async(
    email:string,
    inviterName:string,
    workspaceName:string,
    inviteLink:string
)=>{
    const info = await transporter.sendMail({
        from:"TaskFLow <taskflow@gmail.com>",
        to:email,
        subject:`You are invited to join ${workspaceName}`,
        html:`
        <h2>Workspace Invitation</h2>
        <p>${inviterName} invited you to join <b>${workspaceName}</b></p>
        <a href="${inviteLink}"
            style="padding:10px 15px;background:blue;color:white,text-decoration:none;">
            Accept Invitation
        </a>
        <p>This Link expires in 7 days.</p>
        `
    })
    console.log("Email Sent",info.messageId)
    return info
}