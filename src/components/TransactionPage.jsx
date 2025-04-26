{showTransactionPage && selectedCategory && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 text-black">
        <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
        <form className="flex flex-col gap-4">
          <div>
            <label className="text-sm">Category</label>
            <input
              type="text"
              value={selectedCategory.label}
              readOnly
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm">Description</label>
            <input
              type="text"
              placeholder="Enter description"
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="text-sm">Date</label>
            <input
              type="date"
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded mt-4"
          >
            Save
          </button>
        </form>
        <button
          onClick={() => setShowTransactionPage(false)}
          className="absolute top-4 right-4 text-black"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )}
  