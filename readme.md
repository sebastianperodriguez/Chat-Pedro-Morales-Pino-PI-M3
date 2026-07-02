# Chat con Pedro Morales Pino 

Single Page Application que permite chatear con **Pedro Morales Pino**,
compositor, bandolista y director musical colombiano considerado el padre
de la música colombiana, y de la bandola andina colombiana,
impulsado por **Google Gemini AI** y conectado de
forma segura mediante una **Vercel Serverless Function**.

Proyecto integrador — Módulo 3, carrera de programación en **Henry**.

> 🔗 **Aplicación desplegada:** https://chat-pedro-morales-pino-pi-m3.vercel.app/

---

## 🎼 El personaje: Pedro Morales Pino

Pedro Morales Pino (Cartago, Valle del Cauca, 22 de febrero de 1863 –
Bogotá, 4 de marzo de 1926) nació en una familia humilde; de niño vendía
dulces en la calle, lo que lo acercó a los músicos populares. Su madre le
regaló su primer tiple, y más tarde estudió en la Academia Nacional de
Música de Bogotá con el maestro Julio Quevedo (1882).

Su gran legado fue llevar el **bambuco**, el **pasillo** y la **danza** de
la tradición oral colombiana al pentagrama, con técnica académica, además
de modernizar la **bandola andina**. En 1897 fundó la **Lira Colombiana**,
una estudiantina con la que giró por Centroamérica y Estados Unidos,
convirtiéndose en uno de los primeros músicos colombianos en triunfar en
el extranjero. Compuso más de 100 obras, entre ellas los pasillos
*Joyeles*, *Reflejos* y *Pierrot*, y el bambuco-tipo *Cuatro preguntas*.

El *system prompt* del proyecto (`api/chat.js`) le da una voz cálida y
cercana, en español latinoamericano natural, apasionada por la música
andina colombiana, con respuestas cortas apropiadas para un chat.

---

##  Estructura del proyecto
morales-pino-chat/
├── api/
│   └── chat.js          # Vercel Serverless Function → llama a Gemini AI
├── src/
│   ├── index.html         # Punto de entrada (root de Vite)
│   ├── styles.css          # Estilos mobile-first
│   ├── app.js                # Router SPA (History API) + vistas
│   ├── chat.js                 # Lógica del chat: estado, fetch, render
│   └── utils.js                  # Funciones puras (routing, validación, parseo)
├── tests/
│   ├── utils.test.js
│   └── app.test.js
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── vite.config.js

## Desarrollado por
Sebastián Pérez R.
sebastianperodriguez@gmail.com
Henry Full Stack Developer M-3
2026.