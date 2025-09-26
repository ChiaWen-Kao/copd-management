import React from 'react';
import '../css/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Image } from 'react-bootstrap';
import SideMenu from '../components/menu/SideMenu';
import TopMenu from '../components/menu/TopMenu';
import Questionnaire from './Questionnaire';

const NoSubmissionNotification = ({name}) => {
  return (
    <Row className='container'>
      {/* side Menu */}
      <Col xs={2} className='sideMenu-container'>
        <SideMenu name={name}/>
      </Col>
      {/* main content */}
      <Col xs={10}>
        <TopMenu name={name} />
        <Row>
          <Questionnaire />
        </Row>
      </Col>
    </Row>
  );
};

export default Dashboard;