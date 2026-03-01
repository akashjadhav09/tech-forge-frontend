import { createBlog } from '../api/blog.api';
import BlogPostForm from '../components/blog/BlogPostForm';
import { useNavigate } from 'react-router-dom';

export default function WritePostPage() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    await createBlog(data);
    alert("Post created successfully");
    navigate("/home")
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
