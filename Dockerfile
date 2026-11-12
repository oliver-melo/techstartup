FROM nginx:alpine

# Remove os arquivos padrão do Nginx e copia os arquivos do projeto
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/

EXPOSE 80
