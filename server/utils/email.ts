import nodemailer from "nodemailer";

const config = useRuntimeConfig();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.smtpEmail,
    pass: config.smtpPass,
  },
});
// console.log(config.smtpEmail,config.smtpPass)

export const sendInviteEmail = async (
  email: string,
  inviterName: string,
  workspaceName: string,
  inviteLink: string,
) => {
  const info = await transporter.sendMail({
    from: "TaskFLow <taskflow@gmail.com>",
    to: email,
    subject: `You are invited to join ${workspaceName}`,
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Workspace Invitation – Taskflow</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
</head>
<body style="
  margin: 0;
  padding: 40px 16px;
  background-color: #0d0f14;
  font-family: 'DM Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
">

  <!-- Wrapper -->
  <div style="max-width: 560px; margin: 0 auto;">

    <!-- Top Brand -->
    <div style="display:flex; align-items:center; justify-content:center; gap:10px; padding-bottom:28px;">
      <div style="
        width:32px; height:32px;
        background:linear-gradient(135deg,#3b82f6,#2563eb);
        border-radius:8px;
        display:flex; align-items:center; justify-content:center;
      ">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 11l3 3L22 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span style="font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#ffffff; letter-spacing:-0.3px;">Taskflow</span>
    </div>

    <!-- Card -->
    <div style="
      background:#13161e;
      border:1px solid #1e2230;
      border-radius:20px;
      overflow:hidden;
      box-shadow:0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
    ">

      <!-- Hero -->
      <div style="
        background:linear-gradient(135deg,#1a2540 0%,#111827 60%,#0f172a 100%);
        padding:48px 40px 40px;
        text-align:center;
        position:relative;
        overflow:hidden;
      ">
        <!-- Glow circle (decorative) -->
        <div style="
          position:absolute; top:-60px; left:50%; transform:translateX(-50%);
          width:320px; height:320px;
          background:radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
          pointer-events:none;
        "></div>

        <!-- Avatar stack -->
        <div style="display:flex; justify-content:center; align-items:center; gap:-8px; margin-bottom:20px;">
          <!-- Inviter avatar placeholder -->
          <div style="
            width:56px; height:56px; border-radius:50%;
            background:linear-gradient(135deg,#3b82f6,#1d4ed8);
            border:3px solid #13161e;
            display:flex; align-items:center; justify-content:center;
            font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:white;
            box-shadow:0 0 0 6px rgba(59,130,246,0.12), 0 8px 24px rgba(59,130,246,0.3);
          ">T</div>

          <!-- Arrow icon -->
          <div style="
            margin:0 12px;
            width:28px; height:28px; border-radius:50%;
            background:#1e2a40; border:1px solid #2a3a55;
            display:flex; align-items:center; justify-content:center;
          ">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#4a6fa5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Workspace icon -->
          <div style="
            width:56px; height:56px; border-radius:14px;
            background:linear-gradient(135deg,#0ea5e9,#0284c7);
            border:3px solid #13161e;
            display:flex; align-items:center; justify-content:center;
            box-shadow:0 0 0 6px rgba(14,165,233,0.1), 0 8px 24px rgba(14,165,233,0.25);
          ">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
            </svg>
          </div>
        </div>

        <h1 style="
          font-family:'Syne',sans-serif;
          font-size:26px; font-weight:800;
          color:#f0f4ff; letter-spacing:-0.5px;
          margin:0 0 10px;
        ">You're Invited!</h1>

        <p style="font-size:14px; color:#7a8aaa; margin:0; line-height:1.6;">
          You've been invited to collaborate on a workspace
        </p>
      </div>

      <!-- Body -->
      <div style="padding:36px 40px;">

        <p style="font-size:15px; color:#9aa3b8; line-height:1.8; margin:0 0 24px;">
          Hi there 👋,<br/>
          <span style="color:#c8d0e0; font-weight:500;">${inviterName}</span> has invited you to join the
          <span style="color:#c8d0e0; font-weight:500;">${workspaceName}</span> workspace on Taskflow.
          Start collaborating, managing tasks, and shipping faster — together.
        </p>

        <!-- Workspace card -->
        <div style="
          background:#0d0f14;
          border:1px solid #1e2a45;
          border-radius:16px;
          padding:20px 22px;
          display:flex;
          align-items:center;
          gap:16px;
          margin-bottom:28px;
          position:relative;
          overflow:hidden;
        ">
          <!-- Top accent line -->
          <div style="
            position:absolute; top:0; left:0; right:0; height:2px;
            background:linear-gradient(90deg,transparent,#0ea5e9,transparent);
          "></div>

          <div style="
            width:46px; height:46px; border-radius:12px;
            background:linear-gradient(135deg,#0ea5e9,#0369a1);
            display:flex; align-items:center; justify-content:center;
            flex-shrink:0;
            box-shadow:0 4px 16px rgba(14,165,233,0.25);
          ">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
            </svg>
          </div>

          <div>
            <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#3a4a6a; font-weight:500; margin-bottom:4px;">Workspace</div>
            <div style="font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:#e2e8f0; letter-spacing:-0.2px;">${workspaceName}</div>
            <div style="font-size:12px; color:#4a5680; margin-top:2px;">Invited by ${inviterName}</div>
          </div>
        </div>

        <!-- CTA Button -->
        <div style="text-align:center; margin-bottom:28px;">
          <a href="${inviteLink}" style="
            display:inline-block;
            padding:14px 40px;
            background:linear-gradient(135deg,#3b82f6,#2563eb);
            color:#ffffff;
            text-decoration:none;
            font-family:'Syne',sans-serif;
            font-size:15px;
            font-weight:700;
            border-radius:50px;
            letter-spacing:0.2px;
            box-shadow:0 4px 24px rgba(59,130,246,0.4), 0 0 0 1px rgba(59,130,246,0.3);
          ">Accept Invitation →</a>
        </div>

        <!-- Info pills row -->
        <div style="display:flex; gap:10px; margin-bottom:24px;">
          <!-- Expires -->
          <div style="
            flex:1;
            background:#0d0f14;
            border:1px solid #1a1f2e;
            border-radius:12px;
            padding:14px 16px;
            display:flex;
            gap:10px;
            align-items:flex-start;
          ">
            <div style="width:8px; height:8px; border-radius:50%; background:#f59e0b; margin-top:5px; flex-shrink:0;"></div>
            <div>
              <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#4a5040; font-weight:500; margin-bottom:3px;">Expires</div>
              <div style="font-size:12.5px; color:#6a7080; line-height:1.5;">This link expires in <span style="color:#f59e0b; font-weight:500;">7 days</span></div>
            </div>
          </div>

          <!-- Single use -->
          <div style="
            flex:1;
            background:#0d0f14;
            border:1px solid #1a1f2e;
            border-radius:12px;
            padding:14px 16px;
            display:flex;
            gap:10px;
            align-items:flex-start;
          ">
            <div style="width:8px; height:8px; border-radius:50%; background:#10b981; margin-top:5px; flex-shrink:0;"></div>
            <div>
              <div style="font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#1a3a2a; font-weight:500; margin-bottom:3px;">One-Time</div>
              <div style="font-size:12.5px; color:#6a7080; line-height:1.5;">Link is valid for a <span style="color:#10b981; font-weight:500;">single use</span></div>
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div style="
          background:rgba(239,68,68,0.05);
          border:1px solid rgba(239,68,68,0.14);
          border-radius:12px;
          padding:14px 16px;
          display:flex;
          gap:10px;
          align-items:flex-start;
          margin-bottom:28px;
        ">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style="flex-shrink:0; margin-top:2px;">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p style="font-size:12.5px; color:#f87171; opacity:0.8; line-height:1.6; margin:0;">
            If you didn't expect this invitation, you can safely ignore this email. Do not share this link with anyone.
          </p>
        </div>

        <!-- Divider -->
        <div style="border-top:1px solid #1a1f2e; margin-bottom:24px;"></div>

        <!-- Or copy link -->
        <div style="margin-bottom:8px;">
          <div style="font-size:11px; text-transform:uppercase; letter-spacing:1.5px; color:#3a4460; margin-bottom:10px; font-weight:500;">Or copy the link manually</div>
          <div style="
            background:#0a0c11;
            border:1px dashed #1e2535;
            border-radius:10px;
            padding:12px 14px;
            font-size:12px;
            color:#3a4a6a;
            word-break:break-all;
            font-family:monospace;
            line-height:1.5;
          ">${inviteLink}</div>
        </div>

      </div>

      <!-- Footer -->
      <div style="
        padding:22px 40px 30px;
        border-top:1px solid #1a1f2e;
        text-align:center;
      ">
        <div style="display:flex; align-items:center; justify-content:center; gap:7px; margin-bottom:10px;">
          <div style="
            width:20px; height:20px;
            background:linear-gradient(135deg,#3b82f6,#2563eb);
            border-radius:5px;
            display:flex; align-items:center; justify-content:center;
          ">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span style="font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#2e3a50;">Taskflow</span>
        </div>
        <p style="font-size:11.5px; color:#252c3a; line-height:1.8; margin:0;">
          © 2025 Taskflow, Inc. · All rights reserved.<br/>
          <a href="#" style="color:#2e3a50;">Unsubscribe</a> · 
          <a href="#" style="color:#2e3a50;">Privacy Policy</a> · 
          <a href="#" style="color:#2e3a50;">Terms of Service</a>
        </p>
      </div>

    </div>
  </div>

</body>
</html>
        `,
  });
  // console.log("Email Sent",info.messageId)
  return info;
};

export const sendOtp = async (otp: string, email: string) => {
  const info = await transporter.sendMail({
    from: "Taskflow <taskflow@gmail.com>",
    to: email,
    subject: "Your Reset Password OTP",
    html: `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Taskflow – Reset Password OTP</title>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      background-color: #0d0f14;
      font-family: 'DM Sans', sans-serif;
      padding: 40px 16px;
      -webkit-font-smoothing: antialiased;
    }

    .wrapper {
      max-width: 560px;
      margin: 0 auto;
    }

    /* Top bar */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 0 0 28px 0;
    }

    .topbar-logo {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .topbar-name {
      font-family: 'Syne', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.3px;
    }

    /* Card */
    .card {
      background: #13161e;
      border: 1px solid #1e2230;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03);
    }

    /* Hero strip */
    .hero {
      background: linear-gradient(135deg, #1d2a4a 0%, #162040 50%, #0f172a 100%);
      padding: 48px 40px 40px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -60px; left: 50%;
      transform: translateX(-50%);
      width: 320px; height: 320px;
      background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      box-shadow: 0 0 0 8px rgba(59,130,246,0.12), 0 8px 24px rgba(59,130,246,0.35);
    }

    .hero-title {
      font-family: 'Syne', sans-serif;
      font-size: 28px;
      font-weight: 800;
      color: #f0f4ff;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
    }

    .hero-sub {
      font-size: 14px;
      color: #7a8aaa;
      font-weight: 400;
      line-height: 1.6;
    }

    /* Body */
    .body {
      padding: 36px 40px;
    }

    .greeting {
      font-size: 15px;
      color: #9aa3b8;
      margin-bottom: 20px;
      line-height: 1.7;
    }

    .greeting span {
      color: #e2e8f0;
      font-weight: 500;
    }

    /* OTP Box */
    .otp-wrapper {
      background: #0d0f14;
      border: 1px solid #1e2a45;
      border-radius: 16px;
      padding: 28px 24px;
      text-align: center;
      margin: 24px 0;
      position: relative;
      overflow: hidden;
    }

    .otp-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    }

    .otp-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #4a5680;
      margin-bottom: 14px;
      font-weight: 500;
    }

    .otp-code {
      font-family: 'Syne', sans-serif;
      font-size: 44px;
      font-weight: 800;
      letter-spacing: 10px;
      color: #3b82f6;
      line-height: 1;
      text-shadow: 0 0 30px rgba(59,130,246,0.4);
    }

    .otp-timer {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 14px;
      font-size: 12px;
      color: #4a5680;
      background: #161a24;
      border-radius: 20px;
      padding: 5px 12px;
    }

    .otp-timer svg {
      width: 12px; height: 12px;
      flex-shrink: 0;
    }

    /* Info row */
    .info-row {
      display: flex;
      gap: 12px;
      margin: 24px 0;
    }

    .info-item {
      flex: 1;
      background: #0d0f14;
      border: 1px solid #1a1f2e;
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }

    .info-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }

    .info-text {
      font-size: 12px;
      color: #5a6480;
      line-height: 1.5;
    }

    .info-text strong {
      display: block;
      color: #8a96b0;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }

    /* Warning */
    .warning {
      background: rgba(239,68,68,0.06);
      border: 1px solid rgba(239,68,68,0.15);
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
      margin: 24px 0;
    }

    .warning-text {
      font-size: 12.5px;
      color: #f87171;
      line-height: 1.6;
      opacity: 0.85;
    }

    /* Divider */
    .divider {
      border: none;
      border-top: 1px solid #1a1f2e;
      margin: 28px 0;
    }

    .closing {
      font-size: 14px;
      color: #6a748a;
      line-height: 1.8;
    }

    .closing a {
      color: #3b82f6;
      text-decoration: none;
    }

    /* Footer */
    .footer {
      padding: 24px 40px 32px;
      border-top: 1px solid #1a1f2e;
      text-align: center;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .footer-logo-icon {
      width: 22px; height: 22px;
      background: linear-gradient(135deg, #3b82f6, #2563eb);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .footer-logo-name {
      font-family: 'Syne', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #3a4460;
    }

    .footer-text {
      font-size: 11.5px;
      color: #2e3448;
      line-height: 1.7;
    }

    .footer-text a {
      color: #3a4a6a;
      text-decoration: underline;
    }

  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Brand top -->
    <div class="topbar">
      <div class="topbar-logo">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l3 3L22 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <span class="topbar-name">Taskflow</span>
    </div>

    <div class="card">

      <!-- Hero -->
      <div class="hero">
        <div class="hero-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M7 2a5 5 0 0 0 0 10c.34 0 .67-.03 1-.09V14h1v2h2v2h2v-4h1v-2h1V9.91A5 5 0 0 0 7 2zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" fill="white"/>
          </svg>
        </div>
        <h1 class="hero-title">Reset Your Password</h1>
        <p class="hero-sub">We received a request to reset the password<br/>for your Taskflow account.</p>
      </div>

      <!-- Body -->
      <div class="body">

        <p class="greeting">
          Hi there 👋, use the one-time password below to complete your
          <span>password reset</span>. This code is valid for
          <span>10 minutes</span> only.
        </p>

        <!-- OTP Display -->
        <div class="otp-wrapper">
          <div class="otp-label">Your One-Time Password</div>
          <div class="otp-code">${otp}</div>
          <div class="otp-timer">
            <svg viewBox="0 0 24 24" fill="none" stroke="#4a5680" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Expires in 10 minutes
          </div>
        </div>

        <!-- Info cards -->
        <div class="info-row">
          <div class="info-item">
            <div class="info-dot" style="background:#3b82f6;"></div>
            <div class="info-text">
              <strong>Single Use</strong>
              This OTP can only be used once and expires after use.
            </div>
          </div>
          <div class="info-item">
            <div class="info-dot" style="background:#10b981;"></div>
            <div class="info-text">
              <strong>Keep Private</strong>
              Never share this code with anyone, including support.
            </div>
          </div>
        </div>

        <!-- Warning -->
        <div class="warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="flex-shrink:0;margin-top:1px;">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <p class="warning-text">
            If you didn't request a password reset, please ignore this email or
            <a href="#" style="color:#f87171;">contact support</a> immediately —
            your account may be at risk.
          </p>
        </div>

        <hr class="divider"/>

        <p class="closing">
          Need help? Reach out to us at
          <a href="mailto:support@taskflow.com">support@taskflow.com</a> — we're always here.<br/><br/>
          — The Taskflow Team
        </p>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-logo">
          <div class="footer-logo-icon">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M9 11l3 3L22 4" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="footer-logo-name">Taskflow</span>
        </div>
        <p class="footer-text">
          © 2025 Taskflow, Inc. · All rights reserved.<br/>
          <a href="#">Unsubscribe</a> · <a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a>
        </p>
      </div>

    </div>
  </div>
</body>
</html>
        `,
  });
  return info;
};
