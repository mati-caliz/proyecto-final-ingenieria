# ArguCheck: Herramienta de Verificación de Argumentos
## Descripción
**ArguCheck** es una plataforma diseñada para analizar argumentos en texto, audio, video y enlaces de YouTube. Utiliza técnicas de procesamiento del lenguaje natural y algoritmos de inteligencia artificial para verificar la veracidad de la información, priorizando fuentes confiables como .org y .edu. Este proyecto es parte de una tesis de Ingeniería Informática de UADE.
## Requisitos Previos
1) Clonar el proyecto mediante alguna de las siguientes formas:  
  - Ejecutar en la consola (CMD): ```git clone https://github.com/mati-caliz/proyecto-final-ingenieria.git``` (con HTTPS).
  - Ejecutar en la consola (CMD): ```git clone git@github.com:mati-caliz/proyecto-final-ingenieria.git``` (con SSH).
  - Descargar manualmente el código en zip y descomprimirlo.
2) Instalar Docker:
  - ```https://docs.docker.com/desktop/setup/install/windows-install/```.
3) Solicitar el archivo con las claves de conexión de las APIs a macaliz@uade.edu.ar o cdigiorno@uade.edu.ar, para integrarse con AssemblyAI, ChatGPT, etc. Agregar el archivo .env en la carpeta raiz del proyecto.
4) Navegar a la carpeta principal y construir los contenedores de Docker:
  - Ejecutar en la consola (CMD): ```docker-compose up --build```.
5) Ingresar a ArguCheck en la web mediante la URL: ```http://localhost```.

Nota: La aplicación fue diseñada para ejecutarse en un entorno Dockerizado. Recomendamos instalar Docker para una experiencia más sencilla y consistente. Si Docker no está disponible, es posible configurar el entorno manualmente siguiendo los pasos descritos en la sección "README.md" de la carpeta "frontend" y "backend".
## Autores
- Matias Caliz | macaliz@uade.edu.ar
- Christian Digiorno | cdigiorno@uade.edu.ar

Universidad Argentina de la Empresa, 2024
