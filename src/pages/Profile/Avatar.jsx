import React from "react";
import { DEFAULT_AVATAR } from "../../utils/constants";

export default function Avatar() {
  return (
    <img
      src={DEFAULT_AVATAR}
      alt="Avatar"
      className="w-40 h-40 rounded-full border-3 border-purple-500 object-cover"
    />
  );
}