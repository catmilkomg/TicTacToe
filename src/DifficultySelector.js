import React from 'react';

function DifficultySelector({ onChange }) {
  return (
    <div>
      <h2>Difficulty:</h2>
      <div>
        <label>
          <input type="radio" name="difficulty" value="easy" onChange={onChange} />
          Easy
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="difficulty" value="medium" onChange={onChange} />
          Medium
        </label>
      </div>
      <div>
        <label>
          <input type="radio" name="difficulty" value="hard" onChange={onChange} />
          Hard
        </label>
      </div>
    </div>
  );
}

export default DifficultySelector;
