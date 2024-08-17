import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { selectPreviousURL } from "../store/slice/cartSlice";
const LogIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const saveurl = useSelector(selectPreviousURL);

  let redirectURL = () => {
    if (saveurl.includes("cart")) {
      return navigate("/cart");
    } else {
      return navigate("/");
    }
  };

  let loginUser = (e) => {
    e.preventDefault();
    setErrors(validateUser(email, password));
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const ref = doc(db, "users", userCredential.user.uid);
        const docSanp = await getDoc(ref);
        if (docSanp.exists()) {
          if (docSanp.data().role == "admin") {
            navigate("/admin");
          } else if (docSanp.data().role == "user") {
            // navigate('/')
            redirectURL();
          }
        }
        setIsLoading(false);
        toast.success("loggedIn successfully");
        // navigate('/')
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };
  const provider = new GoogleAuthProvider();
  let LoginUsingGoogle = (e) => {
    e.preventDefault();
    setIsLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsLoading(false);
        toast.success("loggedIn successfully");
        navigate("/");
      })
      .catch((error) => {
        setIsLoading(false);
        toast.error(error.message);
      });
  };

  let validateUser = (email, password) => {
    let error = {};
    if (email == "") error.emailerr = "Email is required";
    if (password == "") error.passworderr = "Password is required";
    return error;
  };

  return (
    <>
      <div className="container col-6">
        {isLoading && <Loader />}
        <div class="card mt-5 shadow">
          <div className="card-body row">
            <div>
              <h2>Login your account</h2>
              <hr />
              <form>
                <input
                  type="text"
                  placeholder="Email"
                  required
                  className="form-control mt-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="text-danger">{errors.emailerr}</span>

                <input
                  type="password"
                  placeholder="Password"
                  required
                  className="form-control mt-3"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="text-danger">{errors.passworderr}</span>

                <div class="d-grid gap-2 mt-3">
                  <button
                    type="submit"
                    class="btn"
                    style={{ backgroundColor: "steelblue", color: "white" }}
                    onClick={loginUser}
                  >
                    Log In
                  </button>
                </div>
                <div className="mt-2">
                  <span style={{ color: "#3f3d56" }}>
                    Don't have an account? <Link to="/signup">Register</Link>
                  </span>
                </div>
                <div class="d-grid gap-2 mt-3">
                  <button
                    type="submit"
                    class="btn btn-outline-danger"
                    onClick={LoginUsingGoogle}
                  >
                    Login with Google
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LogIn;
