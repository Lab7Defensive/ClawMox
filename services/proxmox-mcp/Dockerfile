FROM node:22-alpine
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY services/shared/package.json services/shared/package.json
COPY services/proxmox-mcp/package.json services/proxmox-mcp/package.json
RUN npm install
COPY services/shared services/shared
COPY services/proxmox-mcp services/proxmox-mcp
RUN npm run build --workspace @clawmox/shared && npm run build --workspace @clawmox/proxmox-mcp
CMD ["node", "services/proxmox-mcp/dist/index.js"]
