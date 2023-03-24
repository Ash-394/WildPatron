import React from "react";
import { useState } from "react";
import { Card, Badge, Col, Stack, Button, Row } from "react-bootstrap";

export const Campaigns = (props) => {
  const [amount, setAmmount] = useState("");
  return (
    <Row xs={1} md={3} className="g-4">
      {props.animals.map((animals) => (
        <Col key={animals.index}>
          <Card className="h-100">
            <Card.Header>
              <Stack direction="horizontal" gap={2}>
                <Badge bg="secondary" className="ms-auto">
                  {animal.index} ID
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  goal: {animal.goal}cUSD
                </Badge>

                <Badge bg="secondary" className="ms-auto">
                  {animal.totalRaised} cUSD Raised
                </Badge>
              </Stack>
            </Card.Header>

            <div className=" ratio ratio-4x3">
              <img
                src={animals.image}
                alt={animals.description}
                style={{ objectFit: "cover" }}
              />
            </div>

            <Card.Body className="d-flex  flex-column text-center">
              <Card.Text className="flex-grow-1">
                {animals.description}
              </Card.Text>

              <form>
                <div class="form-r">
                  <input
                    type="number"
                    class="form-control mt-3"
                    value={amount}
                    onChange={(e) => setAmmount(e.target.value)}
                    placeholder="enter ammount"
                  />
                 
                </div>
              </form>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
