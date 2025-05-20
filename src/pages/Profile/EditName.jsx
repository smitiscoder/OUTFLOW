import React from "react";
import { Edit, Check, X } from "lucide-react";

export default function EditName({
  isEditing,
  editedName,
  setEditedName,
  handleNameEdit,
  handleNameSave,
  handleNameCancel,
}) {
  return (
    <div className="text-center flex items-center gap-2">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="bg-[#1A1A1A] text-[#DFDFDF] border border-[#333333] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition w-48"
            autoFocus
            maxLength={30}
            minLength={2}
            placeholder="Enter name"
            aria-label="Edit username"
          />
          <button
            onClick={handleNameSave}
            className={`text-green-500 hover:text-green-400 transition ${
              !editedName.trim() || editedName.length < 2 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!editedName.trim() || editedName.length < 2}
            aria-label="Save name"
          >
            <Check size={20} />
          </button>
          <button
            onClick={handleNameCancel}
            className="text-red-500 hover:text-red-400 transition"
            aria-label="Cancel editing"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{editedName || "Set Username"}</h2>
          <button
            onClick={handleNameEdit}
            className="text-purple-500 hover:text-purple-400 transition"
            aria-label="Edit name"
          >
            <Edit size={18} />
          </button>
        </>
      )}
    </div>
  );
}