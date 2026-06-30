"use client";
import CreatePostSubmitButton from "@/components/create-post-submit-button/create-post-submit-button";
import createPost from "../actions/createPost";
import { useFormState } from "react-dom";

const initialFormData = {
  values: {
    title: "",
    image: null,
    content: "",
  },
  errors: {},
  success: false,
}

export default function NewPostPage() {
  const [state, formAction] = useFormState(createPost, initialFormData);  

  return (
    <>
      <h1>Create a new post</h1>
      <form action={formAction}>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" />
          {state.errors?.title && <span className="error">{state.errors.title}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="image">Image URL</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
          />
          {state.errors?.image && <span className="error">{state.errors.image}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows="5" />
          {state.errors?.content && <span className="error">{state.errors.content}</span>}
        </p>
        <p className="form-actions">
          <button type="reset">Reset</button>
          <CreatePostSubmitButton />
        </p>
      </form>
    </>
  );
}
