import React, { useState } from "react";

function App() {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    email: "",
    phone_number: "",
    department: "",
    date_of_joining: "",
    role: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "employee_id":
        if (!value.trim()) error = "Employee ID is required.";
        break;
      case "name":
        if (!value.trim()) error = "Name is required.";
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(value)) error = "Enter a valid email.";
        break;
      case "phone_number":
        if (!/^\d{10}$/.test(value)) error = "Enter a valid 10-digit phone number.";
        break;
      case "department":
        if (!value.trim()) error = "Department is required.";
        break;
      case "date_of_joining":
        if (!value) error = "Date of joining is required.";
        break;
      case "role":
        if (!value.trim()) error = "Role is required.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate individual field
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert("Please fix the errors in the form before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addEmployee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Employee added successfully!");
        setFormData({
          employee_id: "",
          name: "",
          email: "",
          phone_number: "",
          department: "",
          date_of_joining: "",
          role: "",
        });
        setErrors({});
      } else {
        const errorResponse = await response.json();
        alert(`Error: ${errorResponse.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please check the server connection.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "10px",
          padding: "30px",
          backgroundColor: "white",
          width: "400px",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Employee Details
        </h2>
        <form onSubmit={handleSubmit}>
          {[
            { name: "employee_id", label: "Employee ID" },
            { name: "name", label: "Name" },
            { name: "email", label: "Email" },
            { name: "phone_number", label: "Phone Number" },
            { name: "department", label: "Department" },
            { name: "date_of_joining", label: "Date of Joining", type: "date" },
            { name: "role", label: "Role" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name} style={{ marginBottom: "15px" }}>
              <label style={{ marginBottom: "5px", display: "block" }}>
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                placeholder={`Enter ${label}`}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              />
              {errors[name] && (
                <span style={{ color: "red", fontSize: "12px" }}>
                  {errors[name]}
                </span>
              )}
            </div>
          ))}
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={Object.values(errors).some((error) => error)}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
