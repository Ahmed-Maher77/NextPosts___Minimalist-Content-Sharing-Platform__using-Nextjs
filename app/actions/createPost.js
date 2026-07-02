"use server";
import { storePost } from "@/lib/posts";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPostSchema } from "../validation-schemas";
import fs from "node:fs";
import path from "path";
import { uploadImage } from "@/lib/cloudinary";

export default async function createPost(prev, formData) {
  const postData = {
    title: formData.get("title"),
    image: formData.get("image"),
    content: formData.get("content"),
  };

  const result = createPostSchema.safeParse(postData);
  if (!result.success) {
    return {
      errors: result.error.issues.reduce((acc, issue) => {
        acc[issue.path[0]] = issue.message;
        return acc;
      }, {}),
      success: false,
    };
  }

  const imageUrl = await uploadImage(postData.image);
  const bufferedImage = await postData.image.arrayBuffer();
  const buffer = Buffer.from(bufferedImage);

  const filename = `${Date.now()}-${postData.image.name}`;
  const publicDir = path.join(process.cwd(), "public");
  const uploadDir = path.join(publicDir, "images");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, filename);
  await fs.promises.writeFile(filePath, buffer);

  const newPost = {
    imageUrl: imageUrl,
    title: postData.title,
    content: postData.content,
    userId: 1,
  };

  await storePost(newPost);

  revalidatePath("/feed");
  redirect("/feed");
}
