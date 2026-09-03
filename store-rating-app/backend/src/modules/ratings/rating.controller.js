import prisma from "../../lib/prisma.js";

export async function createRating(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);
    const userId = req.user.userId;
    const { rating } = req.body;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (existingRating) {
      return res.status(409).json({
        message: "You have already rated this store",
      });
    }

    const newRating = await prisma.rating.create({
      data: {
        rating,
        userId,
        storeId,
      },
    });

    res.status(201).json({
      message: "Rating submitted successfully",
      rating: newRating.rating,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRating(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);
    const userId = req.user.userId;
    const { rating } = req.body;

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId,
          storeId,
        },
      },
    });

    if (!existingRating) {
      return res.status(404).json({
        message: "You have not rated this store yet",
      });
    }

    const updatedRating = await prisma.rating.update({
      where: {
        id: existingRating.id,
      },
      data: {
        rating,
      },
    });

    res.json({
      message: "Rating updated successfully",
      rating: updatedRating.rating,
    });
  } catch (error) {
    next(error);
  }
}