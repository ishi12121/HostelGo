// src/context/ApiContext.js
import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async (url, params = {}, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(url, { params, headers });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const postData = useCallback(async (url, payload, params = {}, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(url, payload, { params, headers });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const patchData = useCallback(async (url, payload, params = {}, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(url, payload, { params, headers });
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteData = useCallback(async (url, params = {}, headers = {}) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(url, { params, headers });
      setData(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <ApiContext.Provider value={{ data, loading, error, getData, postData, patchData, deleteData }}>
      {children}
    </ApiContext.Provider>
  );
};
