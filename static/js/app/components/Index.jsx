import React from "react";
import { Jumbotron, Col, Image, Clearfix } from "react-bootstrap";

function HomepageHero() {
  return (
    <Jumbotron bsClass="jumbotron indexHero">
      <Col xs={12} md={3}>
        <Image
          src="/static/pictures/cindylogo.png"
          responsive
          rounded
          thumbnail
        />
      </Col>
      <Col xs={12} md={9}>
        <h2>「Cindy」へようこそ!</h2>
        <p>
          Cindy is a MIT based open-source project aiming to build a forum of
          lateral thinking problems.
        </p>
      </Col>
      <Clearfix />
    </Jumbotron>
  );
}

export function IndexBody() {
  return (
    <div className="container">
      <HomepageHero />
    </div>
  );
}
