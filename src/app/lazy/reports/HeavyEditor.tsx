// app/reports/HeavyEditor.tsx (Server)
"use client";

import React from "react";

const HeavyEditor: React.FC = () => {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold mb-2">Heavy Editor</h3>
      <textarea
        className="w-full h-32 p-2 border rounded"
        placeholder="Enter your text here..."
      />
    </div>
  );
};

export default HeavyEditor;
