import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";

import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import WritePostPage from "./pages/WritePostPage";
import MyBlogsPage from "./pages/MyBlogsPage";

import { AuthProvider } from "./contexts/AuthContext";
import ExploreBlogsPage from "./pages/ExploreBlogsPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="">
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/blogs" element={<ExploreBlogsPage />} />
            <Route path="/blogs/:id" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-blogs" element={<MyBlogsPage />} />
            <Route path="/writeablog" element={<WritePostPage />} />
          </Route>

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;
