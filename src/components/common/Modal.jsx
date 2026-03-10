function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="bg-white rounded-xl shadow-lg w-[400px] p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {children}

      </div>
    </div>
  )
}

export default Modal