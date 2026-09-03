import prisma from "../../lib/prisma.js";

export async function getStores(req, res, next) {
  try {
    const {
      name,
      address,
      sortBy = "name",
      order = "asc",
    } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
        ...(address && {
          address: {
            contains: address,
            mode: "insensitive",
          },
        }),
      },
      include: {
        ratings: {
          select: {
            rating: true,
            userId: true,
          },
        },
      },
      orderBy:
        sortBy === "name"
          ? {
              name: order === "desc" ? "desc" : "asc",
            }
          : undefined,
    });

    const result = stores.map(({ ratings, ...store }) => {
      const average =
        ratings.length > 0
          ? ratings.reduce((sum, item) => sum + item.rating, 0) /
            ratings.length
          : 0;

      const userRating = ratings.find(
        (rating) => rating.userId === req.user.userId
      );

      return {
        ...store,
        overallRating: Number(average.toFixed(1)),
        userRating: userRating?.rating ?? null,
      };
    });

    if (sortBy === "rating") {
      result.sort((a, b) =>
        order === "desc"
          ? b.overallRating - a.overallRating
          : a.overallRating - b.overallRating
      );
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}