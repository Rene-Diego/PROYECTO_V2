# Usa una imagen liviana de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia solo el package.json y package-lock.json para aprovechar la caché de Docker
COPY package.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto
COPY . .

# Expone el puerto 8080
EXPOSE 8080

# Define el comando para ejecutar el servidor
CMD ["npx", "http-server", "./", "-p", "8080"]