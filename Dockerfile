FROM node:12-alpine

COPY package.json package-lock.json ./

RUN npm set progress=false && \
  npm config set depth 0 && \
  npm cache clean --force

RUN npm i && \
  mkdir /opt/app && \
  cp -R ./node_modules ./opt/app

WORKDIR /opt/app

# Run as non-privileged user
RUN addgroup app && \
  adduser -S app && \
  chown -R app:app /opt/app

USER app

COPY . .

CMD ["npm", "start"]
