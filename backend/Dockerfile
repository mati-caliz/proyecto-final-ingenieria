# Dockerfile del backend

# Imagen base de Python
FROM python:3.10-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instalar dependencias del sistema necesarias para PostgreSQL, gcc y ffmpeg
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    pip install --upgrade pip

# Copiar el archivo de requerimientos y instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto de los archivos del proyecto al contenedor
COPY . .

# Exponer el puerto en el que correrá el servidor Django
EXPOSE 8000

# Comando predeterminado para aplicar migraciones y luego iniciar el servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
