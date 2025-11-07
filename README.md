# AdoptMe – Docker

## 🐳 Imagen en Docker Hub
**Enlace público:** https://hub.docker.com/r/margervm/adoptme

## 📦 Requisitos
- Docker 24+
- Archivo `.env` en la raíz con:
```env
PORT=8080
MONGO_URL=...           # Mongo local o Atlas
JWT_SECRET=...          # Secreto JWT
NODE_ENV=...


## Ejecutar con Docker (usando la imagen publicada)
docker pull margervm/adoptme:latest
docker run --name adoptme \
  -p 8080:8080 \
  --env-file .env \
  margervm/adoptme:latest

## Construir la imagen localmente (opcional)
docker build -t adoptme:1.0.0 .
docker run --name adoptme \
  -p 8080:8080 \
  --env-file .env \
  adoptme:1.0.0


Swagger (Users): http://localhost:8080/api/docs