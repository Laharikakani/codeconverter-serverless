import React from "react";
import { Editor } from "@monaco-editor/react";

const InputEditor = ({ sourceCode, setSourceCode }) => {
  return (
    <div>
      <h3>Input Code</h3>
      <Editor
        height="300px"
        language="python"
        value={sourceCode}
        onChange={(value) => setSourceCode(value)}
      />
    </div>
  );
};

export default InputEditor;
