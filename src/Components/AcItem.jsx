import React, { useState, useEffect } from "react";
import { Accordion, ListGroup } from "react-bootstrap";

import { onSnapshot, collection } from "firebase/firestore";
import db from "../firebase";

function AcItem({ data, filterDate }) {
  const [initialTime, setInitialTime] = useState([]);

  const beautifyDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    onSnapshot(
      collection(db, `timeChart/${data.id}/timeDetails`),
      (snapshot) => {
        setInitialTime(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
      }
    );
  }, []);

  const filteredTimeList = initialTime
    .filter((item) => {
      if (
        new Date(item.time).toDateString() ==
        new Date(filterDate).toDateString()
      ) {
        return item;
      }
    })
    .sort((a, b) => {
      new Date(a.time)
        .toTimeString()
        .localeCompare(new Date(b.time).toTimeString());
    });

  return (
    <Accordion.Item eventKey={data.id}>
      <Accordion.Header>{data.name}</Accordion.Header>
      <Accordion.Body>
        <div className="d-flex justify-content-between gap-3">
          <ListGroup className="w-50">
            <ListGroup.Item className="bg-light text-muted fw-bold">
              In:
            </ListGroup.Item>
            {filteredTimeList.map((item) => {
              if (item.type == "in") {
                return (
                  <ListGroup.Item key={item.id}>
                    {beautifyDate(item.time)}
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
          <ListGroup className="w-50">
            <ListGroup.Item className="bg-light text-muted fw-bold">
              Out:
            </ListGroup.Item>
            {filteredTimeList.map((item) => {
              if (item.type == "out") {
                return (
                  <ListGroup.Item key={item.id}>
                    {beautifyDate(item.time)}
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default AcItem;
