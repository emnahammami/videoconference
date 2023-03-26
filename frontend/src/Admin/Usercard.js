import React from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {deleteusers} from "../redux/Action/authAction"
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { updateusers } from "../redux/Action/authAction"
import  { useState ,} from "react";

import { update } from "../redux/Action/authAction";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import { Navigate } from "react-router-dom";

const Usercard = ({ el }) => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [email, setEmail] = useState(el.email);
  const [firstname, setFirstname] = useState(el.firstname);
  const [lastname, setLastname] = useState(el.lastname);
  const [password, setPassword] = useState(el.password);
  const [birthdate, setBirthdate] = useState(el.birthdate);
  const [gender, setGender] = useState(el.gender);



  const [role, setRole] = useState(el.role);
  const [image, setImage] = useState(el.image);
  const [imagee, setImagee] = useState("");

  const handleShow = () => setShow(true);
  const handleEdit = async (e) => {
    e.preventDefault();
   

   dispatch(
      updateusers(el._id, {firstname,lastname,email,password,image,role,gender,birthdate},Navigate),  
      window.location.reload()
      
    ); handleClose()
 
  };

  const banuser = (e) => {
    e.preventDefault();
    el.isBanned="true";
    dispatch(
      updateusers(el._id, el),
    
    );

  };

  const unbanuser = (e) => {
    e.preventDefault();
    el.isBanned="false";
    dispatch(
      updateusers(el._id, el),
    
    );
  };
  
  const uploadFile = () => {
    if (imagee == null) return;
    const imageRef = ref(storage, `${imagee.name}`);
    uploadBytes(imageRef, imagee).then((snapshot) => {
      getDownloadURL(snapshot.ref);
    });
    window.alert("Uploaded successfully");
   // image.setImage(image.name);
  }; 

  return (
    <div>
      <div>
        <Card
          style={{
            width: "20rem",
            margin: " 4rem auto ",
            display: "flex",
          }}
        >
          <ListGroup variant="flush">
          <div className="photo-container">
            <img alt=""  src={`https://firebasestorage.googleapis.com/v0/b/beatbounceandscore.appspot.com/o/${el.image}?alt=media&token=894834e1-f47f-4826-b6dc-8801bcae91aa`}></img>
          </div>
            <ListGroup.Item>Username :{el.firstname}</ListGroup.Item>
            <ListGroup.Item>Lastname :{el.lastname}</ListGroup.Item>
            <ListGroup.Item>Email :{el.email}</ListGroup.Item>
            <ListGroup.Item>Role :{el.role}</ListGroup.Item>
            <ListGroup.Item
              
            >
              <Button variant="danger" className="btn-round" size="lg" onClick={() => dispatch(deleteusers(el._id))}>DELETE</Button>
              <Button variant="warning" className="btn-round" size="lg" onClick={handleShow}>edit</Button>
           
              <Button variant="danger" className="btn-round" size="lg" disabled={(el.isBanned=="true")} onClick={banuser} >Ban</Button>
              <Button variant="success"  className="btn-round" size="lg" disabled={(el.isBanned=="false")} onClick={unbanuser}>Unban</Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
        <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="Enter name"
                      onChange={(e) => setFirstname(e.target.value)}
                      value={firstname}
                    />
                   
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="name"
                      placeholder="Enter name"
                      onChange={(e) => setLastname(e.target.value)}
                      value={lastname}
                    />
                   
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="role"
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                    />
                  </Form.Group>
                 
                  <Form.Group className="mb-3">
                    <Form.Label>image</Form.Label>
                    <Form.Control
                      type="file"
                     
                      onChange={(event) => {
                        setImagee(event.target.files[0]);
                        setImage(event.target.files[0].name);
                      }}
                    
                    />
                  </Form.Group>
                  <Button className="btn-round" onClick={uploadFile}>Upload </Button>

                  
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="warning" onClick={handleEdit}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
      </div>
    </div>
  );
};

export default Usercard;