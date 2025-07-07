import { useEffect, useState } from "react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Import 'createClient' and the 'Entry' type from the contentful package
import { createClient, type Entry } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

// You'll need to install these packages if you haven't already:
// npm install contentful @contentful/rich-text-react-renderer @contentful/rich-text-types

// Initialize the Contentful client
const client = createClient({
  space: 'h66dvnjgy1q4',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'Zk5JSoji1fbiVJEIueMNv67S5IsaSGKpTV332pYNjHI'
});

// Define a type for our blog post fields for better TypeScript support
// NOTE: Make sure you have a 'title' field (Short text) in your 'blogPost' content model
type BlogPost = {
  title: string;
  text: Document;
}

function App() {
  // FIX 1: State must be an array of entries, initialized to an empty array.
  const [posts, setPosts] = useState<Entry<BlogPost>[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetch all entries of the 'blogPost' content type
        const response = await client.getEntries<BlogPost>({ content_type: 'blogPost' });
        
        if (response.items) {
          // This will correctly set the array of posts into the state.
          setPosts(response.items);
        }
      } catch (error) {
        console.error("Error fetching Contentful entries:", error);
      }
    };

    fetchPosts();
  }, []); // The empty dependency array ensures this effect runs only once

  return (
    <main>
      <h1>Aditya Sharma's Blog</h1>
      
      {/* FIX 2: This logic now works because 'posts' is always an array. */}
      {posts.length > 0 ? (
        // Map over the array of posts and render an article for each one
        posts.map((post) => (
          <article key={post.sys.id}>
            <h2>{post.fields.title}</h2>
            <div>
              {documentToReactComponents(post.fields.text)}
            </div>
            <hr />
          </article>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </main>
  );
}

export default App;
