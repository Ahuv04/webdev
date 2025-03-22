
class Fruits extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return (
        <div>
          <h2>Fruits:</h2>
            <NonCitrus />
            <Citrus />
        </div>
      );
    }
  };
  
  class TypesOfFood extends React.Component {
    constructor(props) {
       super(props);
    }
    render() {
      return (
        <div>
          <h1>Types of Food:</h1>
            <Fruits />
          <Vegetables />
        </div>
      );
    }
  };
  
  ReactDOM.render(<TypesOfFood />, document.getElementById('challenge-node'));
  
  // Change code below this line