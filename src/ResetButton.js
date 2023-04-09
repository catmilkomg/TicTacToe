import React from 'react';

class ResetButton extends React.Component {
  render() {
    return (
      <button className="Rbutton" onClick={() => { this.props.onClick() }} >
        Reset game
      </button>
    );
  }
}

export default ResetButton;
