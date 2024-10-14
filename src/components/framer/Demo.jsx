import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

const CardContainer = styled(motion.div)`
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 1100px;
  margin: 20px auto;
  background-color: #fcd5ce;
`;

const ContentWrapper = styled.div`
  flex: 2;
  padding: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  grid-template-rows: auto 1fr;
  gap: 15px;
`;

const Title = styled.h2`
  grid-column: 1 / 2;
  margin: 0 0 15px;
`;

const MoreDetailsButton = styled.button`
  grid-column: 2 / 3;
  align-self: center;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  justify-self: end; /* Aligns the button to the end of its column */

  &:hover {
    background-color: #0056b3;
  }
`;

const Field = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  color: maroon;
  font-size: 19px;
`;

const Demo = ({ title, fields }) => {
  return (
    <CardContainer
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ContentWrapper>
        <Title>{title}</Title>
        <MoreDetailsButton>More Details</MoreDetailsButton>
        {fields.map((field, index) => (
          <Field key={index}>{field}</Field>
        ))}
      </ContentWrapper>
    </CardContainer>
  );
};

export default Demo;
