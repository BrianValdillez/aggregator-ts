import { db } from "..";
import { exit } from "node:process";
import { eq, lt, gte, ne } from 'drizzle-orm';
import { type User, users } from "../schema";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUser(name: string) {
    const [result] = await db.select().from(users).where(eq(users.name, name));
    return result;
}

export async function resetUsers(){
  await db.delete(users);
}

export async function getUsers(): Promise<User[]>{
  try {
    const results = await db.select().from(users);
    return results;
  } catch (error){
    console.log("Failed to retrieve users list!");
    exit(1);
  }
}