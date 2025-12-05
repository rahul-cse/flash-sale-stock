# flash-sale-stock
The project is about reserving and selling products from stock

At first we need to have Node JS and Redis installed in the computer.
Then go to the project folder.
Type the following commands ....

# backend setup
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init --skip-seed
npx ts-node prisma/seed.ts
npm run start:dev

Start another terminal from project root

cd backend
npm run worker

#frontend setup

Open another terminal from project root

cd frontend
npm install
npm run dev

