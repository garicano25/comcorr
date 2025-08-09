# Usa una imagen base ligera
FROM node:22.11.0-slim

# Establece el directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para instalar dependencias
#COPY package.json ./

# Instala las dependencias con optimización
# RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# Copia el resto del código fuente
COPY . .

# Expone el puerto en el que corre la aplicación
EXPOSE 80

# Comando para iniciar la aplicación
CMD ["npm", "start"]
