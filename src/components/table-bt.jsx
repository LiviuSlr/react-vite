import { useEffect, useMemo, useRef, useState } from "react";
import { ID, Permission, Role, Query } from "appwrite";
import { databases } from "../lib/appwrite"; // adjust path if different
import { useAuth } from "../context/AuthContext"; // adjust path if different

const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const LOGBOOK_ID = import.meta.env.VITE_APPWRITE_LOGBOOK_COLLECTION_ID;

const parsePrice = (value) =>
  Number(String(value).replace(/[^0-9.-]+/g, "")) || 0;

const statusStyles = {
  New: "bg-blue-500/20 text-blue-300 border-blue-400/30",
  "In progress": "bg-amber-500/20 text-amber-300 border-amber-400/30",
  Ready: "bg-green-500/20 text-green-300 border-green-400/30",
  Delivered: "bg-slate-500/20 text-slate-200 border-white/10",
};

function docToRow(doc) {
  return {
    id: doc.$id,                // ✅ Appwrite doc id
    orderId: doc.orderId,       // your ORD-xxxxx
    person: doc.sender ?? doc.person,
    patient: doc.patient,
    workType: doc.work ?? doc.workType,
    time: doc.time,
    status: doc.status,
    takenBy: doc.takenBy ?? null,
    price: doc.price,
    files: doc.files ?? null,
    userId: doc.userId,
  };
}

export default function LogbookOrdersTable() {
  const { user, profile } = useAuth();

  // If you want role from profile:
  const role = (profile?.role || "technician").toLowerCase(); // "doctor" | "lab technician" etc
  const isDoctor = role.includes("doctor");
  const isTechnician = role.includes("tech");

  const currentUserName = user?.name || user?.email || "Unknown";

  const fileInputRef = useRef(null);
  const [attachTargetId, setAttachTargetId] = useState(null);

  const [rows, setRows] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [error, setError] = useState("");

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

  // Generate an order number (client-side). In production you might do this server-side.
  const makeOrderId = () => `ORD-${Date.now().toString().slice(-6)}`;

  async function fetchRows() {
    if (!user) return;
    setLoadingRows(true);
    setError("");

    try {
      // Show all orders (or filter by createdBy)
      const res = await databases.listDocuments(DB_ID, LOGBOOK_ID, [
        Query.orderDesc("$createdAt"),
        Query.limit(200),
      ]);

      setRows(res.documents.map(docToRow));
    } catch (e) {
      setError(e?.message || "Failed to load logbook.");
    } finally {
      setLoadingRows(false);
    }
  }

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.$id]);

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

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const required = ["person", "patient", "workType", "time", "status", "price"];
    if (required.some((k) => !String(form[k] ?? "").trim())) return;

    const normalizedPrice = String(form.price).includes("$")
      ? String(form.price)
      : `${form.price}$`;

    try {
      if (!user) throw new Error("Not logged in");

      if (editingId) {
        // UPDATE
        const updatedDoc = await databases.updateDocument(DB_ID, LOGBOOK_ID, editingId, {
          ...form,
          price: normalizedPrice,
        });

        setRows((prev) =>
          prev.map((r) => (r.id === editingId ? docToRow(updatedDoc) : r))
        );
      } else {
        // CREATE
        const payload = {
        orderId: makeOrderId(),
        patient: form.patient,
        time: Number(form.time),
        status: form.status,
        takenBy: "",                 // since column exists
        files: "",                   // string column (store file names later)
        price: Number(parsePrice(form.price)),
        userId: user.$id,            // REQUIRED column ✅
      };

        const permissions = [
          Permission.read(Role.users()),
          Permission.update(Role.user(user.$id)),
          Permission.delete(Role.user(user.$id)),
        ];

        const createdDoc = await databases.createDocument(
          DB_ID,
          LOGBOOK_ID,
          ID.unique(),
          payload,
          permissions
        );

        setRows((prev) => [docToRow(createdDoc), ...prev]);
      }

      closeModal();
    } catch (e) {
      setError(e?.message || "Save failed.");
    }
  }

  async function onDelete(id) {
    setError("");
    try {
      await databases.deleteDocument(DB_ID, LOGBOOK_ID, id);
      setRows((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setError(e?.message || "Delete failed.");
    }
  }

  // Take order (technician, only when New)
  async function takeOrder(docId) {
    if (!docId) throw new Error("Missing Appwrite document id");

    const updatedDoc = await databases.updateDocument(DB_ID, LOGBOOK_ID, docId, {
      status: "In progress",
      takenBy: currentUserName,
    });

    setRows((prev) => prev.map((r) => (r.id === docId ? docToRow(updatedDoc) : r)));
  }

  // Attachments: your UI currently uses local object URLs.
  // Real Appwrite attachments should use Storage (files) and store file IDs in DB.
  // For now we keep the UI but only store filenames in DB (optional).
  const openFilePickerForRow = (rowId) => {
    setAttachTargetId(rowId);
    fileInputRef.current?.click();
  };

  const onFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !attachTargetId) {
      e.target.value = "";
      return;
    }

    // For now store names only (upgrade later to Appwrite Storage)
    const names = files.map((f) => f.name);

    try {
      const row = rows.find((r) => r.id === attachTargetId);
      const next = [...(row?.attachments || []), ...names];

      const updatedDoc = await databases.updateDocument(DB_ID, LOGBOOK_ID, attachTargetId, {
        attachments: next,
      });

      setRows((prev) =>
        prev.map((r) => (r.id === attachTargetId ? docToRow(updatedDoc) : r))
      );
    } catch (err) {
      setError(err?.message || "Failed to attach files.");
    } finally {
      e.target.value = "";
      setAttachTargetId(null);
    }
  };

  const removeAttachment = async (rowId, attachmentName) => {
    try {
      const row = rows.find((r) => r.id === rowId);
      const next = (row?.attachments || []).filter((n) => n !== attachmentName);

      const updatedDoc = await databases.updateDocument(DB_ID, LOGBOOK_ID, rowId, {
        attachments: next,
      });

      setRows((prev) => prev.map((r) => (r.id === rowId ? docToRow(updatedDoc) : r)));
    } catch (err) {
      setError(err?.message || "Failed to remove attachment.");
    }
  };

  return (
    <div className="w-full text-slate-200">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={onFilesSelected}
      />

      {/* Header actions */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-sm text-white/70">
          {loadingRows ? "Loading logbook…" : `${rows.length} orders`}
        </div>

        <button
          onClick={openCreate}
          className="rounded-lg bg-blue-500 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-600 active:scale-95"
        >
          Create
        </button>
      </div>

      {error && (
        <div className="px-4 pt-3">
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            {error}
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="flex justify-center w-full p-4">
        <div className="w-11/12 overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur">
          <table className="w-full border-collapse">
            <thead className="bg-white/5">
              <tr className="text-sm uppercase tracking-wide">
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
                const canTake = isTechnician && String(row.status) === "New";
                const files = row.attachments || [];
                const hasFiles = files.length > 0;

                return (
                  <tr
                    key={row.id}
                    className="border-t border-white/10 text-sm whitespace-nowrap hover:bg-white/5 align-top"
                  >
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
                        {isDoctor && (
                          <button
                            onClick={() => openFilePickerForRow(row.id)}
                            className="rounded-md px-3 py-1 text-xs bg-white/10 hover:bg-white/15 w-fit"
                          >
                            Attach
                          </button>
                        )}

                        {hasFiles ? (
                          <div className="flex flex-col gap-1">
                            {files.slice(0, 3).map((name) => (
                              <div key={name} className="flex items-center gap-2">
                                <span
                                  className="text-xs text-blue-200 max-w-[180px] truncate"
                                  title={name}
                                >
                                  {name}
                                </span>

                                {isDoctor && (
                                  <button
                                    onClick={() => removeAttachment(row.id, name)}
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
                          <span className="text-xs text-white/40">No files</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3 text-right font-semibold">{row.price}</td>

                    {/* Actions */}
                    <td className="p-3">
                      <div className="flex justify-end flex-wrap gap-2">
                        {canTake && (
                          <button
                            onClick={() => takeOrder(row.id)}   // ✅ this must be Appwrite $id
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

              {!loadingRows && rows.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-white/60">
                    No orders yet. Click “Create”.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr className="border-t border-white/10 bg-white/5">
                <td colSpan={8} className="p-3 text-right font-semibold">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-white/10 backdrop-blur p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit order" : "Add new entry"}
              </h2>
              <button onClick={closeModal} className="text-white/60 hover:text-white">
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
                      className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      placeholder={label}
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm">Status</label>
                  <select
                    value={form.status}
                    onChange={onChange("status")}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                  >
                    <option className="bg-slate-900" value="New">New</option>
                    <option className="bg-slate-900" value="In progress">In progress</option>
                    <option className="bg-slate-900" value="Ready">Ready</option>
                    <option className="bg-slate-900" value="Delivered">Delivered</option>
                  </select>
                  <p className="mt-1 text-[11px] text-white/50">
                    “Take order” sets status = In progress.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-md px-4 py-2 text-sm text-white/70 hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-blue-500 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-600"
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