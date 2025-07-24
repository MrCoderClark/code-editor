"use server";

import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createPlayground = async (data: {
  title: string;
  template: Templates;
  description: string;
}) => {
  const { template, title, description } = data;
  const user = await currentUser();

  try {
    if (!user) {
      throw new Error("User not found");
    }
    const playground = await db.playground.create({
      data: {
        title,
        template,
        description,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    return playground;
  } catch (error) {
    console.log(error);
  }
};

export const getAllPlaygroundForUser = async () => {
  const user = await currentUser();

  try {
    const playgound = await db.playground.findMany({
      where: {
        userId: user?.id,
      },
      include: {
        user: true,
        Starmark: {
          where: {
            userId: user?.id,
          },
          select: {
            isMarked: true,
          },
        },
      },
    });
    return playgound;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const deleteProjectById = async (id: string) => {
  try {
    await db.playground.delete({
      where: { id },
    });

    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const editProjectById = async (
  id: string,
  data: { title: string; description: string }
) => {
  try {
    await db.playground.update({
      where: { id },
      data: data,
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

export const duplicateProjectById2 = async (id: string) => {
  try {
    const originalPlayground = await db.playground.findUnique({
      where: { id },
    });
    if (!originalPlayground) {
      throw new Error("Playground not found");
    }

    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,
      },
    });
    revalidatePath("/dashboard");
    return duplicatedPlayground;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const duplicateProjectById = async (id: string) => {
  try {
    // Fetch the original playground data
    const originalPlayground = await db.playground.findUnique({
      where: { id },
    });

    if (!originalPlayground) {
      throw new Error("Original playground not found");
    }

    // Create a new playground with the same data but a new ID
    const duplicatedPlayground = await db.playground.create({
      data: {
        title: `${originalPlayground.title} (Copy)`,
        description: originalPlayground.description,
        template: originalPlayground.template,
        userId: originalPlayground.userId,
      },
    });

    // Revalidate the dashboard path to reflect the changes
    revalidatePath("/dashboard");

    return duplicatedPlayground;
  } catch (error) {
    console.error("Error duplicating project:", error);
  }
};
