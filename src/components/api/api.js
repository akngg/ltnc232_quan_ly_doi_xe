import * as FireBase from "../../modules/firebase";

function API_Page() {
  return (
  <div>
    <button onClick={async () => await handleClick()}>BUTTON</button>
  </div>
  );
}

async function handleClick(){
  console.log(await FireBase.DriversAdd("Nguyễn Anh Kiệt", "A1"));
  console.log(await FireBase.DriversGet());
}

export default API_Page;
