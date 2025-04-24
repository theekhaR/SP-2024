import React, { useEffect, useState } from "react";
import Lnavbar from "../components/L_navbar";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import { useCompanyContext } from "../components/CompanyContext.jsx";
import { useUserContext } from "../components/UserContext.jsx";

function CompanyMember() {
  const { companyID, companyInfo, companyLogoURL, userCompanyData, loading } =
    useCompanyContext();
  const { userID } = useUserContext();
  const [memberList, setMemberList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);

  useEffect(() => {
    if (!companyID) return;
    getCompanyMember().then(setMemberList);
    getPermissionList().then(setPermissionList);
  }, [companyID]);

  async function getCompanyMember() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_company_member?companyID=${companyID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const members = data.map((member, index) => ({
          userID: member.userID,
          name: member.name,
          role: member.role,
          permissionID: member.permissionID,
          permissionName: member.permissionName,
          image_url: member.userPicURL,
        }));
        return members;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  const [memberToBeAdded, setMemberToBeAdded] = useState("");

  async function addNewCompanyMember() {
    try {
      const response = await fetch(
        `http://localhost:5000/add_new_member_to_company_using_email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: memberToBeAdded,
            companyID: companyID,
          }),
        }
      );

      if (response.status === 201) {
        window.location.reload();
      }
      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (e) {
      console.log(e);
    }
  }

  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editPermission, setEditPermission] = useState("");

  const handleManageClick = (member) => {
    setEditId(member.userID);
    setEditRole(member.role);
    setEditPermission(member.permission);
  };

  async function handleSave() {
    console.log("EditID: " + editId);
    try {
      const response = await fetch(`http://localhost:5000/edit_member_detail`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID: editId,
          companyID: companyID,
          role: editRole,
          permissionID: editPermission,
        }),
      });

      if (response.status === 201) {
        setEditId(null);
        window.location.reload();
        return;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
    } catch (error) {
      console.error("Error checking user:", error);
    }
  }

  const handleCancel = () => {
    setEditId(null);
  };

  async function getPermissionList() {
    try {
      const response = await fetch(
        `http://localhost:5000/get_company_permission_list?companyID=${companyID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        // Map raw data to desired format
        const permissions = data.map((permission, index) => ({
          permissionID: permission.permissionID,
          permissionName: permission.permissionName,
        }));

        console.log("permissions :", permissions);
        return permissions;
      }

      // Unexpected error
      const data = await response.json();
      alert(data.error);
      return [];
    } catch (error) {
      console.error("Error checking user:", error);
      return [];
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <Lnavbar />
      <div className="flex flex-row">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              Current Member ({memberList.length})
            </h1>
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Add User With Email"
                className="p-2 w-80 rounded-md border border-gray-300"
                onChange={(e) => setMemberToBeAdded(e.target.value)}
              />
              <button
                className="bg-orange-500 text-white px-5 py-2 rounded hover:bg-orange-600"
                onClick={addNewCompanyMember}
              >
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

            {memberList.map((member) => (
              <div
                key={member.userID}
                className="grid grid-cols-4 items-center px-6 py-4 border-t hover:bg-gray-50"
              >
                {/* Name + Image */}
                <div className="flex items-center space-x-4">
                  <img
                    src={member.image_url}
                    alt="Profile"
                    className="w-12 h-12 object-cover rounded-full"
                  />
                  <div className="font-medium text-gray-800">{member.name}</div>
                </div>

                {/* Role */}
                <div className="text-gray-800 font-medium">
                  {editId === member.userID ? (
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
                  {editId === member.userID ? (
                    <select
                      value={editPermission}
                      onChange={(e) => setEditPermission(e.target.value)}
                      className="border px-2 py-1 rounded w-50"
                    >
                      {permissionList.map((permission) => (
                        <option
                          key={permission.permissionID}
                          value={permission.permissionID}
                        >
                          {permission.permissionName}
                        </option>
                      ))}
                    </select>
                  ) : (
                    member.permissionName || "Unknown"
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  {editId === member.userID ? (
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
              View All ({memberList.length})
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default CompanyMember;
