import axios from "axios";
const request = axios.create();
request.interceptors.request.use(
  (value) => value,
  (error) => error
);
request.interceptors.response.use(
  (value) => {
    if (value.meta.status !== 200 || value.code !== "0000") {
      return Promise.reject(value?.meta?.msg || "未知错误");
    }
    return value;
  },
  (error) => error
);
export default request
