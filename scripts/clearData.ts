import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("🗑️ Clearing all user data...");
    
    // Delete in reverse dependency order to avoid foreign key constraint errors
    await prisma.vote.deleteMany({});
    console.log("✅ Votes deleted");
    
    await prisma.comment.deleteMany({});
    console.log("✅ Comments deleted");
    
    await prisma.complaint.deleteMany({});
    console.log("✅ Complaints deleted");
    
    await prisma.user.deleteMany({});
    console.log("✅ Users deleted");
    
    console.log("🎉 Database cleared successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
