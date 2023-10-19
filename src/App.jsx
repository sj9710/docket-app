import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import supabase from "./supabase";
import "bulma/css/bulma.css";
const App = () => {
  const [data, setData] = useState([]);
  const [docket, setDocket] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    hoursWorked: "",
    ratePerHour: "",
    supplier: "",
    description: "",
    poNumber: "",
  });
  const [submissions, setSubmissions] = useState([]);
  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchDocketData = async () => {
      let { data: docket, error } = await supabase.from("docket").select("*");

      if (error) console.error("Error fetching docket:", error);
      else setDocket(docket);
    };

    fetchDocketData();
  }, [formData]);

  useEffect(() => {
    fetch("src/export.xlsx")
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const workbook = XLSX.read(buffer, { type: "buffer" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const parsedData = XLSX.utils.sheet_to_json(ws, { header: 1 });

        for (let i = 1; i < parsedData.length; i++) {
          if (!parsedData[i][11] && parsedData[i - 1][1] === parsedData[i][1]) {
            parsedData[i][11] = parsedData[i - 1][11];
          }
        }

        setData(parsedData.slice(1));
      });
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "description") {
      const poNumber = data.find((row) => row[15] === value)[1];
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
        poNumber: poNumber,
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("docket").insert([formData]);

    if (error) {
      console.error("Error submitting form data:", error);
    } else {
      setModalOpen(!isModalOpen);
      setSubmissions([...submissions, formData]);
      setFormData({
        name: "",
        startTime: "",
        endTime: "",
        hoursWorked: "",
        ratePerHour: "",
        supplier: "",
        description: "",
        poNumber: "",
      });
    }
  };

  const uniqueSuppliers = [...new Set(data.map((row) => row[11]))].filter(
    Boolean
  );

  const descriptions = data
    .filter((row) => row[11] === formData.supplier)
    .map((row) => row[15]);

  return (
    <div className="container">
      <div className="section">
        <button className="button is-primary" onClick={toggleModal}>
          Open Form
        </button>
        <div className={`modal ${isModalOpen ? "is-active" : ""}`}>
          <div className="modal-background" onClick={toggleModal}></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Form</p>
              <button
                className="delete"
                aria-label="close"
                onClick={toggleModal}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <input
                  className="input"
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="time"
                  placeholder="Start Time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleFormChange}
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="time"
                  placeholder="End Time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleFormChange}
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="number"
                  placeholder="No of hours worked"
                  name="hoursWorked"
                  value={formData.hoursWorked}
                  onChange={handleFormChange}
                />
              </div>
              <div className="field">
                <input
                  className="input"
                  type="number"
                  placeholder="Rate per hour"
                  name="ratePerHour"
                  value={formData.ratePerHour}
                  onChange={handleFormChange}
                />
              </div>
              <div className="field">
                <div className="control">
                  <div className="select">
                    <select
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Supplier</option>
                      {uniqueSuppliers.map((supplier, index) => (
                        <option key={index} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <div className="control">
                  <div className="select">
                    <select
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                    >
                      <option value="">Select Description</option>
                      {descriptions.map((desc, index) => (
                        <option key={index} value={desc}>
                          {desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleSubmit}>
                Submit
              </button>
              <button className="button" onClick={toggleModal}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      </div>

      {docket.length > 0 && (
        <div className="section">
          <h2 className="title">Docket Data</h2>
          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>No of hours worked</th>
                <th>Rate per hour</th>
                <th>Supplier</th>
                <th>Description</th>
                <th>PO Number</th>
              </tr>
            </thead>
            <tbody>
              {docket.map((entry, index) => (
                <tr key={index}>
                  <td>{entry.name}</td>
                  <td>{entry.startTime}</td>
                  <td>{entry.endTime}</td>
                  <td>{entry.hoursWorked}</td>
                  <td>{entry.ratePerHour}</td>
                  <td>{entry.supplier}</td>
                  <td>{entry.description}</td>
                  <td>{entry.poNumber}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
export default App;
