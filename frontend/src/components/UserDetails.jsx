import { useState } from "react";
import useSWR from "swr";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const UserDetails = () => {
  const { data, error, isLoading, mutate } = useSWR(
    "http://localhost:8000/user_details/",
    fetcher
  );

  const [editingUser, setEditingUser] = useState(null);
  const [newName, setNewName] = useState("");

  const handleUpdate = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:8000/update_user/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setEditingUser(null);
      setNewName("");
      mutate(); // Refetch
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (email) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/delete_user/${email}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete user");
        }

        mutate(); // Refetch
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  if (error) return <div>Failed to load user details</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h3>User Details</h3>
      <ul>
        {data.data.map((user) => (
          <li key={user.email}>
            {editingUser === user.email ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="New name"
                />
                <button onClick={() => handleUpdate(user.email)}>Save</button>
                <button onClick={() => setEditingUser(null)}>Cancel</button>
              </>
            ) : (
              <>
                {user.name} - {user.email}
                <button
                  onClick={() => {
                    setEditingUser(user.email);
                    setNewName(user.name);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(user.email)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDetails;
