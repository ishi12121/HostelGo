import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Container, Typography } from '@mui/material';

const About = () => {
  const { count } = useContext(AppContext);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        About Page
      </Typography>
      <Typography variant="body1">
        Current count is {count}
      </Typography>
    </Container>
  );
};

export default About;
