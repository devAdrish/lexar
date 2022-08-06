import Form from "components/form";
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Form
        onSubmit={(v) => {
          console.log("Success", v);
        }}
      />
    </div>
  );
}

export default App;
