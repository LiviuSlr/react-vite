import { useMemo, useRef, useState } from "react";

const parsePrice = (value) =>
  Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;

const statusStyles = {
  New: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  "In progress": "bg-amber-500/20 text-amber-300 border-amber-400/30",
  Ready: "bg-green-500/20 text-green-300 border-green-400/30",
  Delivered: "bg-slate-500/20 text-slate-200 border-white/10",
};

export default function LogbookOrdersTable() {
  // ✅ Setează rolul de aici pentru test:
  // const role = "doctor";
  const role = "technician"; // "doctor" | "technician"
  const currentUserName = role === "doctor" ? "Dr. John Smith" : "Tech. Alex";

  const fileInputRef = useRef(null);
  const [attachTargetId, setAttachTargetId] = useState(null);

  const [rows, setRows] = useState([
    {
      id: 1,
      orderId: "ORD-1001",
      person: "Ion Popescu",
      patient: "Maria Ionescu",
      workType: "Ecografie",
      time: "30 min",
      status: "New",
      takenBy: null,
      price: "200$",
      attachments: [],
    },
    {
      id: 2,
      orderId: "ORD-1002",
      person: "Ana Georgescu",
      patient: "Vasile Păun",
      workType: "Radiografie",
      time: "45 min",
      status: "In progress",
      takenBy: "Tech. Alex",
      price: "100$",
      attachments: [],
    },
    {
      id: 3,
      orderId: "ORD-1003",
      person: "Mihai Dobre",
      patient: "Elena Vasilescu",
      workType: "RMN",
      time: "60 min",
      status: "Ready",
      takenBy: "Tech. Maria",
      price: "50$",
      attachments: [],
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    person: "",
    patient: "",
    workType: "",
    time: "",
    status: "New",
    price: "",
  });

  const total = useMemo(
    () => rows.reduce((sum, r) => sum + parsePrice(r.price), 0),
    [rows]
  );

  const makeOrderId = (nextId) => `ORD-${String(1000 + nextId)}`;

  const openCreate = () => {
    setEditingId(null);
    setForm({
      person: "",
      patient: "",
      workType: "",
      time: "",
      status: "New",
      price: "",
    });
    setIsOpen(true);
  };

  const openEdit = (row) => {
    setEditingId(row.id);
    setForm({
      person: row.person,
      patient: row.patient,
      workType: row.workType,
      time: row.time,
      status: row.status,
      price: String(parsePrice(row.price)),
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();

    const required = [
      "person",
      "patient",
      "workType",
      "time",
      "status",
      "price",
    ];
    if (required.some((k) => !String(form[k] ?? "").trim())) return;

    const normalizedPrice = String(form.price).includes("$")
      ? String(form.price)
      : `${form.price}$`;

    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, ...form, price: normalizedPrice } : r
        )
      );
    } else {
      setRows((prev) => {
        const nextId = prev.length + 1;
        return [
          ...prev,
          {
            id: nextId,
            orderId: makeOrderId(nextId),
            ...form,
            takenBy: null,
            attachments: [],
            price: normalizedPrice,
          },
        ];
      });
    }

    closeModal();
  };

  const onDelete = (id) => {
    setRows((prev) => {
      const row = prev.find((r) => r.id === id);
      (row?.attachments || []).forEach((a) => {
        if (a?.url) URL.revokeObjectURL(a.url);
      });
      return prev.filter((r) => r.id !== id);
    });
  };

  // ✅ Take order: doar pentru tehnician, doar când status === "New"
  const takeOrder = (id) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "In progress", takenBy: currentUserName }
          : r
      )
    );
  };

  // ✅ Attach: doar doctor
  const openFilePickerForRow = (rowId) => {
    setAttachTargetId(rowId);
    fileInputRef.current?.click();
  };

  const onFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !attachTargetId) {
      e.target.value = "";
      return;
    }

    const newAttachments = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name,
      size: file.size,
      type: file.type || "file",
      url: URL.createObjectURL(file),
    }));

    setRows((prev) =>
      prev.map((r) =>
        r.id === attachTargetId
          ? { ...r, attachments: [...(r.attachments || []), ...newAttachments] }
          : r
      )
    );

    e.target.value = "";
    setAttachTargetId(null);
  };

  const removeAttachment = (rowId, attachmentId) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== rowId) return r;
        const att = (r.attachments || []).find((a) => a.id === attachmentId);
        if (att?.url) URL.revokeObjectURL(att.url);
        return {
          ...r,
          attachments: (r.attachments || []).filter(
            (a) => a.id !== attachmentId
          ),
        };
      })
    );
  };

  return (
    <div className="w-full text-slate-200">
      {/* Hidden file input for attachments */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />

      {/* CREATE BUTTON */}
      <button
        onClick={openCreate}
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
                <th className="p-3 text-left">Order</th>
                <th className="p-3 text-left">Doctor/Tech</th>
                <th className="p-3 text-left">Patient</th>
                <th className="p-3 text-left">Work</th>
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Taken by</th>
                <th className="p-3 text-left">Files</th>
                <th className="p-3 text-right">Price</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => {
                const canTake =
                  role === "technician" && String(row.status) === "New";
                const files = row.attachments || [];
                const hasFiles = files.length > 0;

                return (
                  <tr
                    key={row.id}
                    className="
                      border-t border-white/10
                      text-sm whitespace-nowrap
                      hover:bg-white/5
                      align-top
                    "
                  >
                    <td className="p-3">{row.id}</td>
                    <td className="p-3 font-semibold">{row.orderId}</td>
                    <td className="p-3">{row.person}</td>
                    <td className="p-3">{row.patient}</td>
                    <td className="p-3">{row.workType}</td>
                    <td className="p-3">{row.time}</td>

                    <td className="p-3">
                      <span
                        className={[
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                          statusStyles[row.status] ||
                            "border-white/10 bg-white/5 text-white/80",
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                    </td>

                    <td className="p-3 text-white/80">
                      {row.takenBy ? row.takenBy : "—"}
                    </td>

                    {/* Files */}
                    <td className="p-3">
                      <div className="flex flex-col gap-2">
                        {role === "doctor" && (
                          <button
                            onClick={() => openFilePickerForRow(row.id)}
                            className="rounded-md px-3 py-1 text-xs bg-white/10 hover:bg-white/15 w-fit"
                          >
                            Attach
                          </button>
                        )}

                        {hasFiles ? (
                          <div className="flex flex-col gap-1">
                            {files.slice(0, 3).map((a) => (
                              <div
                                key={a.id}
                                className="flex items-center gap-2"
                              >
                                <a
                                  href={a.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-blue-300 hover:text-blue-200 underline underline-offset-2 max-w-[180px] truncate"
                                  title={a.name}
                                >
                                  {a.name}
                                </a>

                                {role === "doctor" && (
                                  <button
                                    onClick={() =>
                                      removeAttachment(row.id, a.id)
                                    }
                                    className="text-xs text-red-200/80 hover:text-red-200"
                                    title="Remove"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            ))}

                            {files.length > 3 && (
                              <span className="text-[11px] text-white/50">
                                +{files.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-white/40">
                            No files
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right font-semibold">
                      {row.price}
                    </td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex justify-end flex-wrap gap-2">
                        {canTake && (
                          <button
                            onClick={() => takeOrder(row.id)}
                            className="rounded-md px-3 py-1 text-xs bg-blue-500/30 text-blue-100 hover:bg-blue-500/40"
                          >
                            Take order
                          </button>
                        )}

                        <button
                          onClick={() => openEdit(row)}
                          className="rounded-md px-3 py-1 text-xs bg-white/10 hover:bg-white/15"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(row.id)}
                          className="rounded-md px-3 py-1 text-xs bg-red-500/20 text-red-200 hover:bg-red-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot>
              <tr className="border-t border-white/10 bg-white/5">
                <td colSpan={9} className="p-3 text-right font-semibold">
                  Total
                </td>
                <td className="p-3 text-right font-bold text-blue-400">
                  {total}$
                </td>
                <td />
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
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit order" : "Add new entry"}
              </h2>
              <button
                onClick={closeModal}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["person", "Doctor/Technician"],
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

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm">Status</label>
                  <select
                    value={form.status}
                    onChange={onChange("status")}
                    className="
                      w-full rounded-md
                      border border-white/10
                      bg-white/5
                      px-3 py-2 text-sm
                      text-white
                      focus:border-blue-400 focus:outline-none
                      focus:ring-1 focus:ring-blue-400
                    "
                  >
                    <option className="bg-slate-900" value="New">
                      New
                    </option>
                    <option className="bg-slate-900" value="In progress">
                      In progress
                    </option>
                    <option className="bg-slate-900" value="Ready">
                      Ready
                    </option>
                    <option className="bg-slate-900" value="Delivered">
                      Delivered
                    </option>
                  </select>
                  <p className="mt-1 text-[11px] text-white/50">
                    “Take order” setează automat status = In progress.
                  </p>
                </div>
              </div>

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
                  {editingId ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
