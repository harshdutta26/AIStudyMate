import React, { useEffect, useState } from 'react';

function Summary() {
  const [response, setResponse] = useState('');
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await fetch('http://localhost:3000/Summary', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.summary) {
          console.log('Data is success');
          setResponse(data.summary);
          const formattedHTML = formatGemminiOutput(data.summary);
          setFormatted(formattedHTML);
        }
      } catch (err) {
        console.log(`Error at Summary Fetching ${err}`);
      }
    }
    fetchSummary();
  }, []);

  function formatGemminiOutput(rawText) {
    const lines = rawText.split('\n').filter(line => line.trim() !== '');

    const output = lines.map(line => {
      if (/^\d+\./.test(line)) {
        return `<li>${line}</li>`;
      } else if (line.startsWith('-')) {
        return `<li>${line.slice(1).trim()}</li>`;
      } else if (line.endsWith(':')) {
        return `<h3 class="text-lg font-semibold mt-4">${line.replace(':', '')}</h3>`;
      } else {
        return `<p class="mt-2">${line}</p>`;
      }
    });

    return output.join('\n');
  }

  return (
    <div className='min-h-[calc(100vh-224px)] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <div className='border border-gray-300 dark:border-gray-700 rounded p-4 shadow'>
        <h2 className='text-2xl md:text-3xl font-bold mb-4 text-orange-600'>📄 Summary</h2>

        {formatted ? (
          <div className='space-y-3 text-sm md:text-4xl prose prose-sm dark:prose-invert' dangerouslySetInnerHTML={{ __html: formatted }} />
        ) : (
          <p>Loading summary...</p>
        )}
      </div>
    </div>
  );
}

export default Summary;
