import styled from "styled-components";

const Container = styled.div`
  height: 30px;
  background-color: teal;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
`;

const Announcement = () => {
  return <Container> Fact: Beeple's "5000 Days" artwork was sold for more than $69 million at Christie's auction</Container>;
};

export default Announcement;
