import React, { useState, useEffect } from 'react';
import { type TestResult } from '../types/testResult';

const TestResults: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const mockData: TestResult[] = [
        { id: '1', date: '01/10/2024', arv: 'TDF + 3TC + DTG', cd4: 500, viralLoad: 50 },
        { id: '2', date: '01/11/2024', arv: 'TDF + 3TC + DTG', cd4: 520, viralLoad: 40 },
      ];
      setResults(mockData);
    };
    fetchResults();
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in">
      <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Kết Quả Xét Nghiệm</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary text-gray-700">
              <th className="p-4 text-left">Ngày</th>
              <th className="p-4 text-left">Phác đồ ARV</th>
              <th className="p-4 text-left">CD4</th>
              <th className="p-4 text-left">Tải lượng HIV</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={result.id}
                className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-secondary transition-colors`}
              >
                <td className="p-4">{result.date}</td>
                <td className="p-4">{result.arv}</td>
                <td className="p-4">{result.cd4}</td>
                <td className="p-4">{result.viralLoad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;