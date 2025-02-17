## Setup

### pyenv

Se recomienda usar `pyenv` para el manejo de versiones de Python.

Ejemplo de creación de virtual environment: `pyenv virtualenv 3.12.3 pfi`.

Activación del venv: `pyenv activate pfi`.

Instalar requirements: `pip install -r requirements.txt`.

### PyCharm

1. Instalar las `distutils` que correspondan
* Ejecutar `python --version`
* Ejemplo de resultado: `Python 3.12.3`
* Ejecutar `sudo apt install python3.12-distutils` cambiando la versión según corresponda

2. Configurar el interpreter de PyCharm:
* Ir a Settings
* Buscar "Python Interpreter"
* Seleccionar el venv creado con `pyenv`

3. Activar Django support
* Ir a Settings
* Buscar "Languages & Frameworks" -> "Django"
* Tildar "Enable Django Support"
  * Django project root: la ruta del proyecto (el root es grupo-31-pfi-backend)
  * Settings: `conf.settings.base.py` (o el que se desee usar en su lugar)
  * Manage script: `manage.py`

### Base de datos

En el proyecto se utiliza una base de datos PostgreSQL. Para tener la base de datos local, seguir los siguientes pasos:

1. Asegurarse de tener el archivo `.env` con las credenciales correctas (usar `.env.sample` como base)

2. Asegurarse de que el proceso de `psql` está instalado y corriendo:
* Ejecutar `psql --version`
* Si no se tiene `psql` instalado, hay que instalarlo:
  * `sudo apt-get update`
  * `sudo apt-get install postgresql postgresql-contrib`
* Ejecutar `sudo systemctl status postgresql`
* Si está inactivo, hay que activarlo:
  * `sudo systemctl start postgresql`
* Revisar los logs para comprobar que todo está bien:
  * Buscar la versión instalada de `psql`
  * Ejecutar `sudo tail /var/log/postgresql/postgresql-XX-main.log`, reemplazando XX por la versión encontrada

3. Crear la base de datos
* Cambiar al usuario postgres: `sudo su - postgres`
* Entrar a la consola: `psql`
* Ejecutar `CREATE DATABASE nombre_de_tu_base_de_datos;`
* Para usar un usuario que no sea postgres (el default):
  * Ejecutar `\connect nombre_de_tu_base_de_datos` 
  * Ejecutar `CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';`
  * Ejecutar `GRANT ALL PRIVILEGES ON DATABASE nombre_de_tu_base_de_datos TO tu_usuario;`
  * Ejecutar `GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tu_usuario;`
  * Ejecutar `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;`
  * Ejecutar `GRANT ALL ON SCHEMA public TO tu_usuario;`
  * Ejecutar `ALTER DATABASE nombre_de_tu_base_de_datos OWNER TO tu_usuario;`
* Salir ejecutando dos veces `exit`

4. Ejecutar las migraciones
* Ejecutar `python manage.py migrate`

### Levantar el servidor
* Ejecutar `python manage.py runserver 0.0.0.0:8000`
