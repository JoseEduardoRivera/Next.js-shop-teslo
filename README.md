This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Clonar el repositorio

## Ejecutar el comando

`npm install`

## Docker - Levantar la base de datos (PostgreSQL)

1. Correr en cmd `docker-compose uo -d`

2. Crear archivo de [.ENV] con la informacion:
   DB_USER=postgres
   DB_NAME=teslo-shop
   DB_PASSWORD=123456

## Correr las migraciones de Prisma

`npx prisma migrate dev`

Abrir [http://localhost:3000](http://localhost:3000) En algun navegador

## Ejecutar seed

`npm run seed`

## Limpiar el LocalStorage del navegador

## Getting Started

Correr en dev:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

### Ayudas

1. Como ejecutar una migracion si se ha actualizado el modelo de prisma
   `npx prisma migrate --name NombreDeLaMigracion`
