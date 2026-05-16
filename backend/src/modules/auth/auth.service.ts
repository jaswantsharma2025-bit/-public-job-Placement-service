import prisma from "../../config/prisma";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken";

export const registerUser = async (data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      phone: data.phone,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
    },
  });

  const token = generateToken(user.id, user.role);

  const { password: _, ...safeUser } = user;

return {
  token,
  user: safeUser,
};
};

export const loginUser = async (
  phone: string,
  password: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      phone,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...safeUser } = user;

 return {
  token,
  user: safeUser,
};
};