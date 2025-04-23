import React, { useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";

function MemberPage() {
  const [members, setMembers] = useState([
    {
      id: "m1",
      Pic: "Picture path kub",
      name: "Vertin",
      role: "CEO",
      permission: "1",
    },
    {
      id: "m2",
      Pic: "Picture path kub",
      name: "Sonetto",
      role: "HR",
      permission: "2",
    },
    {
      id: "m3",
      Pic: "Picture path kub",
      name: "Lilya",
      role: "HR",
      permission: "2",
    },
    {
      id: "m4",
      Pic: "Picture path kub",
      name: "Sotheby",
      role: "HR",
      permission: "2",
    },
    {
      id: "m5",
      Pic: "Picture path kub",
      name: "Druvis III",
      role: "HR",
      permission: "2",
    },
  ]);

  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editPermission, setEditPermission] = useState("");

  const handleManageClick = (member) => {
    setEditId(member.id);
    setEditRole(member.role);
    setEditPermission(member.permission);
  };

  const handleSave = () => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === editId
          ? { ...member, role: editRole, permission: editPermission }
          : member
      )
    );
    setEditId(null);
  };

  const handleCancel = () => {
    setEditId(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Current Member ({members.length})
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Username"
                className="p-2 w-80 rounded-md border border-gray-300"
              />
              <button className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600">
                Add new member
              </button>
            </div>
          </div>

          <div className="bg-white rounded shadow overflow-hidden">
            <div className="grid grid-cols-4 px-6 py-4 bg-gray-50 font-semibold text-gray-600 text-sm">
              <div>Name</div>
              <div>Role</div>
              <div>Permission</div>
              <div className="text-right">Action</div>
            </div>

            {members.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-4 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                {/* Name + Image */}
                <div className="flex items-center space-x-4">
                  <img
                    src={member.Pic}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div className="font-medium text-gray-800">{member.name}</div>
                </div>

                {/* Role */}
                <div className="text-gray-800 font-medium">
                  {editId === member.id ? (
                    <input
                      type="text"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="border px-2 py-1 rounded w-20"
                    />
                  ) : (
                    member.role
                  )}
                </div>

                {/* Permission */}
                <div className="text-gray-800 font-medium">
                  {editId === member.id ? (
                    <select
                      value={editPermission}
                      onChange={(e) => setEditPermission(e.target.value)}
                      className="border px-2 py-1 rounded w-50"
                    >
                      <option value="1">Can view</option>
                      <option value="2">Can view and edit</option>
                    </select>
                  ) : member.permission === "1" ? (
                    "Can view"
                  ) : (
                    "Can view and edit"
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  {editId === member.id ? (
                    <>
                      <button
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 text-sm"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 text-sm"
                        onClick={() => handleManageClick(member)}
                      >
                        Manage
                      </button>
                      <button className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-800 text-sm">
                        Kick
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
              View All ({members.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default MemberPage;
