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
            className="bg-[#1A1A1A] text-[#DFDFDF] border border-[#333333] rounded px-2 py-1"
            autoFocus
            maxLength={30}
          />
          <button
            onClick={handleNameSave}
            className="text-green-500"
            disabled={!editedName.trim()}
            aria-label="Save name"
          >
            <Check size={20} />
          </button>
          <button
            onClick={handleNameCancel}
            className="text-red-500"
            aria-label="Cancel editing"
          >
            <X size={20} />
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{editedName || "Username"}</h2>
          <button
            onClick={handleNameEdit}
            className="text-purple-500 hover:text-purple-400"
            aria-label="Edit name"
          >
            <Edit size={18} />
          </button>
        </>
      )}
    </div>
  );
}