export default function CategoryFilter({ value, onChange }) {
  const btn = (v, label) => (
    <button
      onClick={() => onChange(v)}
      className={`px-3 py-1 rounded ${
        value === v ? "bg-green-600 text-white" : "border"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="flex gap-2 justify-center">
      {btn("all", "Toate")}
      {btn("general", "General")}
      {btn("tips", "Sfaturi")}
      {btn("marketplace", "Piață")}
    </div>
  )
}
