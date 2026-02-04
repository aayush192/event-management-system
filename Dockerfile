FROM ubuntu
RUN apt update && apt install -y curl ca-certificates


RUN curl -fsSL https://deb.nodesource.com/setup_24.x | bash - \
  && apt install -y nodejs

RUN npm install -g pnpm  
COPY . .

RUN pnpm install

RUN npx prisma generate



RUN pnpm build

CMD ["node" ,"dist/src/index.js" ]

