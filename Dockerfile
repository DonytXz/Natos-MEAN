FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY . .

# Expose default port (Hugging Face Spaces uses 7860, standard uses 4200 or $PORT)
EXPOSE 4200 7860

ENV PORT=4200 \
    NODE_ENV=production

CMD ["npm", "start"]
