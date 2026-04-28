"use server";

import { auth } from "@/auth";
import { db, schema } from "@/db/client";
import { isAdminEmail } from "@/lib/admins";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function requireAdmin(): Promise<string> {
  const session = await auth();
  const email = session?.user?.email;
  if (!email || !isAdminEmail(email)) {
    throw new Error("Not authorized");
  }
  return email;
}

export async function approveBusiness(id: number) {
  const email = await requireAdmin();
  await db
    .update(schema.businesses)
    .set({
      status: "approved",
      approvedAt: new Date(),
      approvedBy: email,
    })
    .where(eq(schema.businesses.id, id));
  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/");
}

export async function rejectBusiness(id: number) {
  const email = await requireAdmin();
  await db
    .update(schema.businesses)
    .set({
      status: "rejected",
      approvedBy: email,
    })
    .where(eq(schema.businesses.id, id));
  revalidatePath("/admin");
}

export async function unapproveBusiness(id: number) {
  await requireAdmin();
  await db
    .update(schema.businesses)
    .set({
      status: "pending",
      approvedAt: null,
      approvedBy: null,
    })
    .where(eq(schema.businesses.id, id));
  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/");
}

export async function deleteBusiness(id: number) {
  await requireAdmin();
  await db.delete(schema.businesses).where(eq(schema.businesses.id, id));
  revalidatePath("/admin");
  revalidatePath("/businesses");
  revalidatePath("/");
}
