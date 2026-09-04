import prisma from "../../lib/prisma.js";

export async function getDashboard(req, res, next) {
  try {
    const stores = await prisma.store.findMany({
      where: {
        ownerId: req.user.userId,
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                address: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const result = stores.map((store) => {
      const ratings = store.ratings;

      const averageRating = ratings.length
        ? Number(
            (
              ratings.reduce((sum, item) => sum + item.rating, 0) /
              ratings.length
            ).toFixed(1)
          )
        : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating,
        totalRatings: ratings.length,
        ratings: ratings.map((item) => ({
          rating: item.rating,
          createdAt: item.createdAt,
          user: item.user,
        })),
      };
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
}