FROM node:latest

COPY package.json app.js /src/
RUN cd /src; npm install

EXPOSE 8000
CMD ["node", "/src/app.js"]