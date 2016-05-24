import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export class App extends Component {
  handleSubmit(e){
    // e.preventDefault();
    let email = this.refs.email.getDOMNode().value;
    let xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://localhost:3000/prices", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify({email: email}));
  }

  render(){
    return (
      <div className="container">
        <form style={styles.box}>
          <h3>Get Google's and Apple's stock price in your inbox!</h3>
          <div> <input placeholder="Enter email address" ref="email" name="email" style={styles.input} className="form-control input-lg"/> </div>
          <div> <input className="btn" type="submit" value="submit" onClick={this.handleSubmit.bind(this)} style={styles.btn}/> </div>
        </form>
      </div>
    );
  }
}


let styles = {
  box: {
    width: '50%',
    height: '40%',
    margin: '0 auto',
  },
  btn: {
    backgroundColor: '#ff8160',
  },

};


ReactDOM.render(
  <App/>,
  document.getElementById("app-root")
);
