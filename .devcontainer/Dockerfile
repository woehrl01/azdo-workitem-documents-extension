# see: https://github.com/microsoft/vscode-dev-containers/tree/main/containers/typescript-node

ARG VARIANT="18-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${VARIANT}

RUN su node -c "npm install -g npm@8.12"
RUN su node -c "npm install -g tfx-cli"
