const Person = ({ name, number, handleClick }) => {
  return (
    <>
      <p style={{ textTransform: "capitalize" }}>
        {name} {number}
      </p>
      <button onClick={handleClick}>delete</button>
    </>
  );
};

export default Person;
