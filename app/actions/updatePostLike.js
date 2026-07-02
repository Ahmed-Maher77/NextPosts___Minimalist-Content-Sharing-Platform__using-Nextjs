"use server";
import { updatePostLikeStatus } from "@/lib/posts";
import { revalidatePath } from "next/cache";

const updatePostLike = async (postId) => {
    try {
        await updatePostLikeStatus(postId, 2);
        revalidatePath("/", "layout");
    } catch (error) {
        throw new Error("Failed to update post like status: " + error.message);
    }
};

export default updatePostLike;
