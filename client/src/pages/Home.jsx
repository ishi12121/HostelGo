import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Container, Typography, Button } from '@mui/material';

const Home = () => {
  const { count, setCount } = useContext(AppContext);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setCount(count + 1)}>
        Count is {count}
      </Button>
    </Container>
  );
};

export default Home;
