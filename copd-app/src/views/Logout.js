import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";

const Logout = ({ show, handleClose, handleLogout, loggingOut }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Logout Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loggingOut ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
            <p className="mt-2">Logging out...</p>
          </div>
        ) : (
          <p>Are you sure you want to logout?</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!loggingOut && (
          <>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default Logout;
