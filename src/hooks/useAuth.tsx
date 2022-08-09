const useAuth = () => {
  return localStorage.getItem("user");
};

export default useAuth;
