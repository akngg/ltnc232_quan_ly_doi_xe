import { database, UserRegister } from "../../modules/firebase";
import { child, ref, get } from "firebase/database";

async function API_Page() {
  console.log(await UserRegister("shadommc", "Shadommc613@", "tml25092004@gmail.com", "Nguyễn Anh Kiệt"));
}
export default API_Page;
