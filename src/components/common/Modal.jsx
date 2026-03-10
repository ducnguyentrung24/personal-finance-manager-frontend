function Modal({ isOpen, onClose, title, children }) {

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white p-6 rounded-xl shadow w-[400px] max-h-[80vh] overflow-y-auto">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold">
            {title}
          </h2>

          <button onClick={onClose}>
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  )
}

export default Modal