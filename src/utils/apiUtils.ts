import axios from 'axios';
import handleError from './handleError';
export const SERVER_DOMAIN = 'http://192.168.111.212:84';

const getHeaders: any = () => {
  return {
    timeout: 5000,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  };
};

// HTTP GET Request - Returns Resolved or Rejected Promise
export const get = (path: string) => {
  return new Promise((resolve, reject) => {
    axios.get(`${SERVER_DOMAIN}${path}`, getHeaders())
      .then(response => { resolve(response) })
      .catch(error => { reject(handleError(error)) });
  });
};

// HTTP PATCH Request - Returns Resolved or Rejected Promise
export const patch = (path: string, data: any) => {
  return new Promise((resolve, reject) => {
    axios.patch(`${SERVER_DOMAIN}${path}`, data, getHeaders())
      .then(response => { resolve(response) })
      .catch(error => { reject(handleError(error)) });
  });
};

// HTTP POST Request - Returns Resolved or Rejected Promise
export const post = (path: string, data: any) => {
  return new Promise((resolve, reject) => {
    axios.post(`${SERVER_DOMAIN}${path}`, data, getHeaders())
      .then(response => { resolve(response) })
      .catch(error => { reject(handleError(error)) });
  });
};

// HTTP DELETE Request - Returns Resolved or Rejected Promise
export const del = (path: string) => {
  return new Promise((resolve, reject) => {
    axios.delete(`${SERVER_DOMAIN}${path}`, getHeaders())
      .then(response => { resolve(response) })
      .catch(error => { reject(handleError(error)) });
  });
};