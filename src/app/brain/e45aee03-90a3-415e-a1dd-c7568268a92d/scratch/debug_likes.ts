import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkLikes() {
  const postId = "cmnu0rnne006xk4v7e269sfoc"; // From the user's logs
  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true
        }
      }
    }
  });

  console.log("Total Likes found:", likes.length);
  likes.forEach((l, i) => {
    console.log(`Like ${i+1}: UserID: ${l.user.id}, Email: ${l.user.email}`);
  });
}

checkLikes()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
