import { BrowserRouter as Router } from "react-router-dom"
import Header from "./widgets/ui/Header.tsx"
import Footer from "./widgets/ui/Footer.tsx"
import PostsManagerPage from "./pages/PostsManagerPage.tsx"
import { PostsProvider } from "./features/post/get-posts/context.tsx"
import { CommentsProvider } from "./features/comment/get-comments/context.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const App = () => {
  const queryClient = new QueryClient()

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <PostsProvider>
              <CommentsProvider>
                <PostsManagerPage />
              </CommentsProvider>
            </PostsProvider>
          </main>
          <Footer />
        </div>
      </QueryClientProvider>
    </Router>
  )
}

export default App
