import React from "react";
import { Editor } from "@monaco-editor/react";

const OutputEditor = ({ convertedCode }) => {
  return (
    <div>
      <h3>Converted Code</h3>
      <Editor height="300px" language="javascript" value={convertedCode} />
    </div>
  );
};

export default OutputEditor;
