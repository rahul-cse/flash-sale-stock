import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main(){
await prisma.product.createMany({
data: [
{ name: 'Samsung Galaxy A05', price: 12999.0, availableStock: 5 },
{ name: 'Xiomi Note 14', price: 9249.0, availableStock: 10 },
{ name: 'iPhone 12', price: 29999.0, availableStock: 3 }
]
})
console.log('Seeded')
}

main().catch(e=>{console.error(e);process.exit(1)})
.finally(()=>prisma.$disconnect())