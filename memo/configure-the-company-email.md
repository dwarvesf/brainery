---
author: 
created_time: 2022-11-29
tags: dwarves, team, process, updates
created: 2022-11-29
---

### 1. **Make sure you have 2FA enabled**

For this method to work, you need to have [two factor authentification](https://www.google.com/landing/2step/) enabled for your Google account. If it’s not, follow the link below and set it up.

[https://www.google.com/landing/2step/](https://www.google.com/landing/2step/)


### 2. **Create an App Password**

Google will verify your ownership with this app password. Select “Mail” under app, and “Mac” under device. Hit “Generate”. Copy and keep for later!

![](https://improvmx.com/wp-content/themes/improvmx/img/app-password-google.gif)


### 3. **Add your email to Gmail**

Go to Gmail -> Settings -> Accounts and Import. Then, select “Add another email address you own” under Aliases.

[https://security.google.com/settings/security/apppasswords](https://security.google.com/settings/security/apppasswords)


### 4. **Fill in your sender’s information**

Set your forwarded email (example@d.foundation) and your sender’s name. Untick “treat as an alias”.

![](https://improvmx.com/wp-content/themes/improvmx/img/smtp-sender-info-gmail.gif)


### 5. **Fill in your email informations**

SMTP is **smtp.gmail.com**, port is right already. 

Username is **your gmail address** (incl. @gmail.com). 

Password is the password you generated on Step 2. 

Leave TLS enabled as is

![](https://improvmx.com/wp-content/themes/improvmx/img/smtp-gmail.gif)


### 6. **Confirm Ownership**

You will receive an email from GMail asking you to confirm ownership with a code. Fill in the code in the popup modal, and you are all set!

### 7. **Send emails from your alias**

Now you can just select your alias in the list when you compose a new message.


### 8. **To send emails from your Mac client (optional)**

* Go to Mail client -> Settings -> Choose your individual email which added alias -> Edit Email Addresses

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6587c635-f994-4486-bf34-e6e0c5b2e659/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202207Z&X-Amz-Expires=3600&X-Amz-Signature=734bea29c96b1eada7d110edc7d83497f2cf2c31abd9378e77b84632df774dcc&X-Amz-SignedHeaders=host&x-id=GetObject)

* Fill your alias information

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ee94e766-1fb2-438a-bff4-9c99b9181ad9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202207Z&X-Amz-Expires=3600&X-Amz-Signature=e03b51a19c1a62fd9013e673d2e9c6d8f617e0f03a3453bbcb55f1926b73faae&X-Amz-SignedHeaders=host&x-id=GetObject)

* Now you can just select your alias in the list when you compose a new message in your Mac client.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ed6c500f-251d-4838-a5a9-77db8c195ff0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202207Z&X-Amz-Expires=3600&X-Amz-Signature=b3787f16b539a885813e34f7e71e3f6ab1ad1e457619e6dcee283000ba0437db&X-Amz-SignedHeaders=host&x-id=GetObject)

