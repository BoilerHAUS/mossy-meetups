FROM node:18-bullseye-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run prisma:generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
