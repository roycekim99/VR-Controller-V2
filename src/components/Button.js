import React from "react";

export default function Button({ name, onClick, param }) {
  return (
    <button className="r_button" onClick={() => onClick(param)}>
      {name}
    </button>
  );
}
