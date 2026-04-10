FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY services/shared/package.json services/shared/package.json
COPY services/infra-runner/package.json services/infra-runner/package.json
RUN npm install
COPY services/shared services/shared
COPY services/infra-runner services/infra-runner
RUN npm run build --workspace @clawmox/shared && npm run build --workspace @clawmox/infra-runner
CMD ["node", "services/infra-runner/dist/index.js"]
