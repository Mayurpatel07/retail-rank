import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";

export async function getDashboard(req, res, next) {
  try {
    const [users, stores, ratings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.json({
      users,
      stores,
      ratings,
    });
  } catch (error) {
    next(error);
  }
}

export async function createUser(req, res, next) {
  try {
    const { name, email, address, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        passwordHash,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function createStore(req, res, next) {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner || owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        message: "Invalid store owner",
      });
    }

    const existingStore = await prisma.store.findUnique({
      where: { email },
    });

    if (existingStore) {
      return res.status(409).json({
        message: "Store email is already registered",
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId,
      },
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    next(error);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { name, email, address, role, sortBy = "name", order = "asc" } =
      req.query;

    const allowedSortFields = ["name", "email", "address", "role"];

    const users = await prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
        ...(email && {
          email: {
            contains: email,
            mode: "insensitive",
          },
        }),
        ...(address && {
          address: {
            contains: address,
            mode: "insensitive",
          },
        }),
        ...(role && { role }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
      },
      orderBy: {
        [allowedSortFields.includes(sortBy) ? sortBy : "name"]:
          order === "desc" ? "desc" : "asc",
      },
    });

    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function getStores(req, res, next) {
  try {
    const { name, email, address, sortBy = "name", order = "asc" } =
      req.query;

    const allowedSortFields = ["name", "email", "address"];

    const stores = await prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
        ...(email && {
          email: {
            contains: email,
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
          },
        },
      },
      orderBy: {
        [allowedSortFields.includes(sortBy) ? sortBy : "name"]:
          order === "desc" ? "desc" : "asc",
      },
    });

    const result = stores.map(({ ratings, ...store }) => ({
      ...store,
      rating: ratings.length
        ? Number(
            (
              ratings.reduce((sum, item) => sum + item.rating, 0) /
              ratings.length
            ).toFixed(1)
          )
        : 0,
    }));

    if (sortBy === "rating") {
      result.sort((a, b) =>
        order === "desc" ? b.rating - a.rating : a.rating - b.rating
      );
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        stores: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const stores = user.stores.map(({ ratings, ...store }) => ({
      ...store,
      rating: ratings.length
        ? Number(
            (
              ratings.reduce((sum, item) => sum + item.rating, 0) /
              ratings.length
            ).toFixed(1)
          )
        : 0,
    }));

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
      ...(user.role === "STORE_OWNER" && { stores }),
    });
  } catch (error) {
    next(error);
  }
}