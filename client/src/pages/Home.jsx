// src/pages/Home.js
import { useEffect } from "react";
import { CircularProgress, Typography, Container } from "@mui/material";
import { useApi } from "../context/ApiContext";

const Home = () => {
  const { data, loading, error, getData } = useApi();

  useEffect(() => {
    getData("http://localhost:3030/opDetails");
  }, [getData]);
  console.log(data)
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Home Page
      </Typography>
      {loading && <CircularProgress />}
      {error && <Typography color="error">Error: {error.message}</Typography>}
      {data && (
        <Typography variant="body1">{JSON.stringify(data)}</Typography>
      )}
    </Container>
  );
};

export default Home;
