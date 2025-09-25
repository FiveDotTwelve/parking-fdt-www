<p align="left">
  <img src="src/public/img/fivedottwelve.jpg" alt="FiveDotTwelve — App Development Company" width="92px" height="92px">
</p>

[![Postman](https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=white)](#)
[![ChatGPT](https://img.shields.io/badge/ChatGPT-74aa9c?logo=openai&logoColor=white)](#)
[![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?logo=vsc&logoColor=white)](#)
[![Slack](https://img.shields.io/badge/Slack-4A154B?logo=slack&logoColor=fff)](#)
[![Express.js](https://img.shields.io/badge/Express.js-%23404d59.svg?logo=express&logoColor=%2361DAFB)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff)](#)
[![CSS](https://img.shields.io/badge/CSS-639?logo=css&logoColor=fff)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?logo=redis&logoColor=white)](#)
[![Google](https://img.shields.io/badge/Google-4285F4?logo=google&logoColor=white)](#)
[![NodeJS](https://img.shields.io/badge/Node.js-6DA55F?logo=node.js&logoColor=white)](#)

<p>
⭐ Star this repository on GitHub — your support motivates me to keep learning and building! 🚀✨
</p>

[![Instagram](https://img.shields.io/badge/Instagram-%23E4405F.svg?logo=Instagram&logoColor=white)](https://www.instagram.com/fivedottwelve/)
[![LinkedIn](https://custom-icon-badges.demolab.com/badge/LinkedIn-0A66C2?logo=linkedin-white&logoColor=fff)](https://pl.linkedin.com/company/fivedottwelve)
[![GitHub](https://img.shields.io/badge/GitHub-%23121011.svg?logo=github&logoColor=white)](https://github.com/FiveDotTwelve)
[![Facebook](https://img.shields.io/badge/Facebook-%231877F2.svg?logo=Facebook&logoColor=white)](https://www.facebook.com/fivedottwelve)

---

# FDTParking 🚀

<p>
FDTParking is an integration bot for Slack, created during practice. The project was built with Node.js, Express, and TypeScript, and integrated with the Google Calendar API, using a Redis database. The bot runs as a backend server that receives events from Slack, processes user messages according to the application logic, and communicates with Google Calendar to handle reservations and manage parking spots. This makes the process of booking parking spaces fast, simple, and accessible directly from Slack.
</p>

---

## Project Stack 💼

- Node.js  
- Express.js  
- TypeScript  
- Slack API  
- Google Calendar API
- Redis
- CSS
- TailwindCSS
- Zod
- Prettier

---

## List of Available Commands 🔥


- `/parking help` – Show all commands  
- `/parking login` – Connect your Slack account to Google to book parking  
- `/parking reserve` – Reserve a parking spot and add it to Google Calendar  
- `/parking cancel` – Cancel a parking spot and delete it from your Google Calendar.
- `/parking show [today | week | next ]` – Shows available and taken parking spots 

---

## Installation 💿

```bash
git clone https://github.com/Kubaleek/FDTParking.git

cd FDTParking

npm install

cp .env-sample .env
# set up environment variables - follow instructions from .env-sample

npm run dev
```

---


## Issues
If you encounter any problems during installation or while using FDTParking, please report them in the [Issues](https://github.com/Kubaleek/FDTParking/issues) section on GitHub.  
Include a description of the problem, and if possible, attach screenshots or error logs to help with troubleshooting.

---

## License

The project is licensed under the MIT License – you can use, modify, and distribute the code on your own terms.

---

