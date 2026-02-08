import { db } from "./db";
import {
  registrations,
  type InsertRegistration,
  type Registration
} from "@shared/schema";

export interface IStorage {
  createRegistration(registration: InsertRegistration): Promise<Registration>;
}

export class DatabaseStorage implements IStorage {
  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const [registration] = await db
      .insert(registrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }
}

export const storage = new DatabaseStorage();
