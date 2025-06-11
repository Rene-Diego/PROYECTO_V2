# Usa una imagen oficial de Node.js como base
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencia primero para aprovechar el caché de Docker
COPY package.json package-lock.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente al contenedor
COPY . .

# Expone el puerto en el que corre el servidor
EXPOSE 9090

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]