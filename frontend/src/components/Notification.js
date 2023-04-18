const Notification = ({ msg, resolve }) => {
  let style = {};
  if (resolve)
    style = {
      color: "green",
      fontStyle: "italic",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };

  if (!resolve)
    style = {
      color: "red",
      fontStyle: "italic",
      background: "lightgrey",
      fontSize: 20,
      borderStyle: "solid",
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };

  if (msg === null)
    style = {
      display: "none",
    };

  return (
    <div style={style} className="notification">
      {msg}
    </div>
  );
};

export default Notification;
