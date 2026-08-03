import { createBlog } from '../api/blog.api';
import BlogPostForm from '../components/blog/BlogPostForm';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';

export default function WritePostPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const handleCreate = async (data) => {
    try {
      await createBlog(data);
      const isDraft = data.status === 'Draft';
      if (isDraft) {
        toast.info('Draft saved', 'Your blog post has been saved as a draft.');
      } else {
        toast.success('Blog published!', 'Your blog post is now live.');
      }
      navigate('/home');
    } catch (error) {
      console.error('Create blog failed:', error);
      toast.error('Failed to create blog', error?.response?.data?.message || 'Please try again.');
    }
  };

  return (
    <BlogPostForm
      mode="create"
      onSubmit={handleCreate}
      labels={{
        heading: 'Create New Post',
        subheading: 'Share your thoughts',
        publishButton: 'Publish Post',
        draftButton: 'Save Draft'
      }}
    />
  );
}
