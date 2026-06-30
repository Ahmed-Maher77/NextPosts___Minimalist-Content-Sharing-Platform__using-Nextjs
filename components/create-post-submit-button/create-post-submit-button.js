"use client";
import { useFormStatus } from 'react-dom'

const CreatePostSubmitButton = () => {
    const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create Post"}
    </button>
  )
}

export default CreatePostSubmitButton
