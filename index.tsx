import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [address, setAddress] = useState('');
  const [valuation, setValuation] = useState('');
  const [loading, setLoading] = useState(false);

  const getValuation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      const data = await response.json();
      setValuation(data.valuation || 'No valuation available.');
    } catch (error) {
      setValuation('Error retrieving valuation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4">
      <Head>
        <title>AI Home Valuation</title>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Enter Your Home Address</h1>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="123 Main St, City, State"
        className="w-full max-w-md p-2 mb-4 rounded border border-gray-300 dark:border-gray-700"
      />
      <button
        onClick={getValuation}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        {loading ? 'Loading...' : 'Get Valuation'}
      </button>
      {valuation && (
        <div className="mt-6 p-4 border rounded bg-white dark:bg-gray-800 max-w-md w-full">
          <h2 className="text-xl font-semibold">Estimated Value:</h2>
          <p>{valuation}</p>
        </div>
      )}
    </div>
  );
}