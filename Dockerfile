# Node 22.12+ exigido pelo Angular CLI 21 (v22.4.0 falha no build).
FROM node:22-bookworm-slim AS builder

# Definir o diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install -f

# Copiar o código fonte da aplicação
COPY . .

# Compilar a aplicação Angular
RUN npm run build-prod

# Configurar a imagem final do Nginx
FROM nginx:alpine

# Copiar os arquivos de build da aplicação para o diretório padrão do Nginx
COPY --from=builder /app/dist/mobiis-radar-angular/browser/ /usr/share/nginx/html/

# Expor a porta 80 para acesso externo
EXPOSE 80

# Iniciar o servidor Nginx quando o container for iniciado
CMD ["nginx", "-g", "daemon off;"]
