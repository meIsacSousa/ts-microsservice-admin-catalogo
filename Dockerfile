FROM node:16.17.0-slim

# usuário do container - o padrão é root
# conceito do minimo privilégio
# id é o echo $UID
USER node - 1000

WORKDIR /home/node/app

CMD [ "sh", "-c", "npm", "install", "&&", "tail", "-f", "/dev/null" ]

