import { useState } from "react";

const UserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
    // Prepare the request
    const response = await fetch("http://localhost:8000/create_user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Handle the response
    if (response.ok) {
      const result = await response.json();
      setStatus("User created successfully");
      console.log("Submitted:", result);
    } else {
      const error = await response.json();
      setStatus(`Error: ${error.detail}`);
      console.error("Error:", error);
    }
    setFormData({
      name: "",
      email: "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add User</button>
      {status && <p>{status}</p>}
    </form>
  );
};

export default UserForm;
