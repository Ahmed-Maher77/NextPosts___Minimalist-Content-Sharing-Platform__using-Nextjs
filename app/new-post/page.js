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
      <form action={formAction} noValidate>
        <p className="form-control">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            aria-required="true"
            aria-invalid={!!state.errors?.title || undefined}
            aria-describedby={state.errors?.title ? "title-error" : undefined}
          />
          {state.errors?.title && <span id="title-error" className="error" role="alert">{state.errors.title}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            accept="image/png, image/jpeg"
            id="image"
            name="image"
            aria-invalid={!!state.errors?.image || undefined}
            aria-describedby={state.errors?.image ? "image-error" : undefined}
          />
          {state.errors?.image && <span id="image-error" className="error" role="alert">{state.errors.image}</span>}
        </p>
        <p className="form-control">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            rows="5"
            aria-required="true"
            aria-invalid={!!state.errors?.content || undefined}
            aria-describedby={state.errors?.content ? "content-error" : undefined}
          />
          {state.errors?.content && <span id="content-error" className="error" role="alert">{state.errors.content}</span>}
        </p>
        <p className="form-actions">
          <button type="reset">Reset</button>
          <CreatePostSubmitButton />
        </p>
      </form>
    </>
  );
}
