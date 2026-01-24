import { useMemo, useState } from "react";

const parsePrice = (value) =>
  Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;

export default function CreateModal() {
  const [rows, setRows] = useState([
    {
      id: 1,
      person: "Ion Popescu",
      patient: "Maria Ionescu",
      workType: "Ecografie",
      time: "30 min",
      price: "200$",
    },
    {
      id: 2,
      person: "Ana Georgescu",
      patient: "Vasile Păun",
      workType: "Radiografie",
      time: "45 min",
      price: "100$",
    },
    {
      id: 3,
      person: "Mihai Dobre",
      patient: "Elena Vasilescu",
      workType: "RMN",
      time: "60 min",
      price: "50$",
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    person: "",
    patient: "",
    workType: "",
    time: "",
    price: "",
  });

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + parsePrice(r.price), 0),
    [rows]
  );

  const openModal = () => {
    setForm({ person: "", patient: "", workType: "", time: "", price: "" });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v.trim())) return;

    setRows((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        ...form,
        price: form.price.includes("$") ? form.price : `${form.price}$`,
      },
    ]);

    closeModal();
  };

  return (
    <div className="w-full text-slate-200">
      {/* CREATE BUTTON */}
      <button
        onClick={openModal}
        className="
          mt-4 mr-8 ml-auto flex
          rounded-lg bg-blue-500
          px-6 py-2.5
          font-semibold text-white
          transition hover:bg-blue-600 active:scale-95
        "
      >
        Create
      </button>

      {/* TABLE */}
      <div className="flex justify-center w-full p-4">
        <div
          className="
            w-11/12 overflow-x-auto rounded-xl
            border border-white/10
            bg-white/5 backdrop-blur
          "
        >
          <table className="w-full border-collapse">
            <thead className="bg-white/5">
              <tr className="text-sm uppercase tracking-wide">
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Person</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Work</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="
                    border-t border-white/10
                    text-sm whitespace-nowrap
                    hover:bg-white/5
                  "
                >
                  <td className="p-3">{row.id}</td>
                  <td className="p-3">{row.person}</td>
                  <td className="p-3">{row.patient}</td>
                  <td className="p-3">{row.workType}</td>
                  <td className="p-3">{row.time}</td>
                  <td className="p-3 text-right font-semibold">{row.price}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="border-t border-white/10 bg-white/5">
                <td colSpan={5} className="p-3 text-right font-semibold">
                  Total
                </td>
                <td className="p-3 text-right font-bold text-blue-400">
                  {total}$
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/60 p-4
          "
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div
            className="
              w-full max-w-lg rounded-xl
              border border-white/10
              bg-white/10 backdrop-blur
              p-6 shadow-2xl
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Add new entry</h2>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {[
                ["person", "Name of Person"],
                ["patient", "Patient Name"],
                ["workType", "Work Type"],
                ["time", "Time Required"],
                ["price", "Price"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-1 block text-sm">{label}</label>
                  <input
                    value={form[key]}
                    onChange={onChange(key)}
                    className="
                      w-full rounded-md
                      border border-white/10
                      bg-white/5
                      px-3 py-2 text-sm
                      text-white placeholder-white/40
                      focus:border-blue-400 focus:outline-none
                      focus:ring-1 focus:ring-blue-400
                    "
                    placeholder={label}
                  />
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    rounded-md px-4 py-2 text-sm
                    text-white/70 hover:bg-white/10
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="
                    rounded-md bg-blue-500
                    px-5 py-2 text-sm font-semibold
                    text-white hover:bg-blue-600
                  "
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
