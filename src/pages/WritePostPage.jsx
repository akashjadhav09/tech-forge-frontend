import { createBlog } from '../api/blog.api';
import BlogPostForm from '../components/blog/BlogPostForm';

export default function WritePostPage() {
  const handleCreate = async (data) => {
    await createBlog(data);
  };

  return (
    <BlogPostForm
      mode="create"
      onSubmit={handleCreate}
      labels={{
        heading: "Create New Post",
        subheading: "Share your thoughts",
        publishButton: "Publish Post",
        draftButton: "Save Draft"
      }}
    />
  );
}
