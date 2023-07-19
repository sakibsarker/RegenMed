import React from 'react';
import { Row, Col, Form, Input, Button, message } from 'antd';


const Contact = () => {
  const onFinish = (values) => {
    console.log(values);
    message.success('Thank you for contacting us!');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
   <section className="map-section">
		 <Row gutter={24} style={{ height: 'calc(100vh - 64px)' }}>
      {/* <Col xs={24} md={12} style={{ height: '40%' }}>
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            <Marker position={center} />
          </GoogleMap>
        </LoadScript>
      </Col> */}
      <Col xs={24} md={12} style={{ height: '100%' }}>
        <div style={{ padding: '2rem' }}>
          <h2>Contact Us</h2>
          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input your name!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Message"
              name="message"
              rules={[
                {
                  required: true,
                  message: 'Please input your message!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
	 </section>
  );
};

export default Contact;
