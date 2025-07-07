import { useEffect, useState } from "react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// Import 'createClient', 'Entry', and the new 'EntrySkeletonType'
import { createClient, type Entry, type EntrySkeletonType } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

// You'll need to install these packages if you haven't already:
// npm install contentful @contentful/rich-text-react-renderer @contentful/rich-text-types

// Initialize the Contentful client
const client = createClient({
  space: 'h66dvnjgy1q4',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'Zk5JSoji1fbiVJEIueMNv67S5IsaSGKpTV332pYNjHI'
});

// FIX 1: Define the full "skeleton" for your content type.
// By providing the content type ID ('blogPost'), we give TypeScript
// enough information to correctly type the 'fields' property.
type BlogPostSkeleton = EntrySkeletonType<{
  title: string;
  text: Document;
}, "blogPost">;

function App() {
  // Use the new skeleton type in useState.
  const [posts, setPosts] = useState<Entry<BlogPostSkeleton>[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Use the skeleton type when fetching entries.
        const response = await client.getEntries<BlogPostSkeleton>({ content_type: 'blogPost' });
        
        if (response.items) {
          setPosts(response.items);
        }
      } catch (error) {
        console.error("Error fetching Contentful entries:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <main>
      <h1>Aditya Sharma's Blog</h1>
      
      {/* This rendering logic now works because TypeScript understands the shape of 'post.fields' */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <article key={post.sys.id}>
            <h2>{post.fields.title}</h2>
            <div>
              {/* FIX 2: Check if post.fields.text exists before rendering */}
              {post.fields.text && documentToReactComponents(post.fields.text)}
            </div>
            <hr/>
          </article>
        ))
      ) : (
        <p>Loading posts...</p>
      )}
    </main>
  );
}

export default App;
