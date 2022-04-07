import { Container, Row, Col, Button, Form, Accordion } from "react-bootstrap";

import { useEffect, useState } from "react";

import AcItem from "./Components/AcItem";

import { v4 as uuidv4 } from "uuid";
import { onSnapshot, collection, setDoc, doc } from "firebase/firestore";
import db from "./firebase";

function App() {
  const [users, setUsers] = useState([]);
  const [fData, setFData] = useState([]);
  const [filterDate, setFilterDate] = useState(
    new Date().toISOString().substr(0, 10)
  );

  const [showModal, setShowModal] = useState({
    status: false,
    userId: "",
  });

  const [newStudent, setNewStudent] = useState("");

  const handleTextChange = (e) => {
    let filteredData = users.filter((item) => {
      if (item.name.toLowerCase().includes(e.target.value.toLowerCase())) {
        return item;
      }
    });
    setFData(filteredData);
  };

  const closeModal = () => {
    setShowModal((prev) => ({ ...prev, status: false }));
  };

  const handleAddTimeChange = (e) => {
    e.target.value != 0 &&
      setShowModal({
        status: true,
        userId: e.target.value,
      });
  };

  const handleAddTimeButton = (type) => {
    const ID = uuidv4();

    setDoc(doc(db, `timeChart/${showModal.userId}/timeDetails`, ID), {
      id: ID,
      time: new Date().toISOString(),
      type: type,
    });
    closeModal();
  };

  const addNewStudnet = () => {
    const ID = uuidv4();

    setDoc(doc(db, `timeChart`, ID), {
      id: ID,
      name: newStudent,
    });

    setNewStudent("");
  };

  useEffect(() => {
    onSnapshot(collection(db, `timeChart`), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setFData(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  }, []);

  return (
    <>
      <section className="bg-primary">
        <Container>
          <Row>
            <Col>
              <div className="d-flex justify-content-between py-5">
                <Form.Group className="w-500">
                  <Form.Select onChange={handleAddTimeChange}>
                    <option value="0">Select Student Name</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="d-flex align-items-center text-white">
                  <Form.Label className="mb-0 me-3 no-wrap">
                    Add Student
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Add Student Name"
                    value={newStudent}
                    onChange={(e) => setNewStudent(e.target.value)}
                  />
                  <Button
                    variant="outline-light"
                    className="ms-3"
                    onClick={addNewStudnet}
                  >
                    Add
                  </Button>
                </Form.Group>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <Form.Label className="mb-0 me-3 no-wrap">
                  Filter Student
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Searh Name"
                  onChange={handleTextChange}
                />
              </div>
              <div className="d-flex align-items-center">
                <Form.Label className="mb-0 me-3 no-wrap">
                  Filter Date
                </Form.Label>
                <Form.Control
                  type="date"
                  defaultValue={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Container className="mt-3">
        <Row>
          <Col>
            <div className="border p-4 rounded">
              <Accordion flush>
                {fData.map((student) => (
                  <AcItem
                    key={student.id}
                    data={student}
                    filterDate={filterDate}
                  />
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>
      </Container>
      {showModal.status && (
        <div
          className="vh-100 vw-100 position-fixed d-flex justify-content-center align-items-center"
          style={{ top: 0, left: 0, backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        >
          <div className="bg-white p-5 rounded">
            <h3 className="text-center px-5">Type of Time Note</h3>
            <div className="d-flex gap-2 mt-4 justify-content-center">
              <Button
                variant="outline-success"
                onClick={() => handleAddTimeButton("in")}
              >
                IN
              </Button>
              <Button
                variant="outline-danger"
                onClick={() => handleAddTimeButton("out")}
              >
                OUT
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
