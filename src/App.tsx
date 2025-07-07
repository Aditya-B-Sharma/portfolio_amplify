import { useEffect, useState } from "react";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { createClient } from 'contentful';
import type { Document } from '@contentful/rich-text-types';

const client = createClient({
  space: 'h66dvnjgy1q4',
  environment: 'master', // defaults to 'master' if not set
  accessToken: 'Zk5JSoji1fbiVJEIueMNv67S5IsaSGKpTV332pYNjHI'
})

function App() {

  const [body, setBody] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const entry = await client.getEntry('EO80XfTYtGkwc7joiHyWD');
        if (entry.fields.text) {
          setBody(entry.fields.text as Document);
        }
      }
      catch (error) {
        console.error("error occurred", error)
      }
    };

    fetchPage();
  }, []);
  

  return (
    <main>
      <h1>Aditya Sharma</h1>
      <div>
        🥳 This is me!
        {body ? documentToReactComponents(body) : <p>Loading...</p>}
        <br />
      </div>
    </main>
  );
}

export default App;
