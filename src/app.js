import React from "react";
import Button from "./components/Button";

function App() {
  const localHost = "http://localhost:3000";
  // -- server check:
  // get data from backend server
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch(localHost + "/client_test")
      .then((res) => res.json())
      .then((data) => setData(data.message));
  }, []);
  // -- sever check END

  // button functions:

  // TODO: disable button when response is overloaded
  async function send_command(command) {
    console.log("command sent!", command);
    await fetch(localHost + command).then((res) =>
      setData(`${command} returned: ${res.status}`)
    );
  }
  // button functions END

  return (
    <div class="container">
      <div class="center">
        <Button name="Start" onClick={send_command} param={"/start_video"} />
        <Button name="Stop" onClick={send_command} param={"/stop_video"} />
      </div>
      <p>{!data ? "Loading..." : data}</p>
    </div>
  );
}

export default App;
