import React from 'react';
import favicon from '../images/coterie-favicon.png';
import googleLogo from '../images/google-logo.png';
import githubLogo from '../images/github-logo.png';
import fbLogo from '../images/fb-logo.png';

const Login = (props) => {

  return (
    <div className="d-flex text-center justify-content-center login-page">
      <div className="border-light card login-card">
        <img src={favicon} className="card-img-top favicon" alt="Coterie Logo"></img>
        <div className="card-body">
          <h2 className="card-title">Sign in</h2>

          <a href={process.env.REACT_APP_API_BASE_URL+"/auth/google"}>
            <button className="btn btn-light w-100 open-sans my-3 text-muted"><img src={googleLogo} alt="Google Logo" className="pr-2"/>Continue with Google</button>
          </a>

          <a href="/">
            <button className="btn btn-light w-100 open-sans my-3 text-muted"><img src={fbLogo} alt="Facebook Logo" className="pr-2"/>Continue with Facebook</button>
          </a>
          <a href="/">
            <button className="btn btn-light w-100 open-sans my-3 text-muted"><img src={githubLogo} alt="Github Logo" className="pr-2"/>Continue with Github</button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login;