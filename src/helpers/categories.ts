import { db } from "@/db";

export const getCategories = async () => {
  return await db.query.categoryTable.findMany({});
};
