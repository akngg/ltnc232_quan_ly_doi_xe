import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set, child, remove } from "firebase/database";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SEND_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth= getAuth(app);
const db = getDatabase(app);
const dbRef = ref(db);

// Constant fields
const VERHICLES_REF = "vehicles";
const DRIVERS_REF = "drivers";

// PRIVATE FUNCTIONs
async function Insert(refPath, object) {
  // Generate and check unique ID
  let id;
  while (true) {
    id = Math.random().toString(16).slice(2);
    let item = await get(child(dbRef, refPath + "/" + id));
    if (!item.exists()) break;
  }
  await set(ref(db, refPath + "/" + id), object);
  return id;
}
async function Get(refPath) {
  let items = await get(child(dbRef, refPath));
  return items.val();
}
async function Update(refPath, id, object) {
  let item = await get(child(dbRef, refPath + "/" + id));
  if (!item.exists()) return false;
  else {
    await set(ref(db, refPath + "/" + id), object);
    return true;
  }
}
async function Delete(refPath, id) {
  if (id == "*") {
    await set(ref(db, refPath), null);
  } else {
    let itemRef = ref(db, refPath + "/" + id);
    remove(itemRef);
  }
}

// EXPORT FUNCTIONs
export async function VehiclesGet(id) {
  let items;
  if (id) items = await Get(VERHICLES_REF + "/" + id);
  else items = await Get(VERHICLES_REF);
  return {
    success: true,
    data: items,
  };
}
export async function VehiclesAdd(type, capacity) {
  let id = await Insert(VERHICLES_REF, {
    type: type,
    capacity: capacity,
  });
  return {
    success: true,
    data: id,
  };
}
export async function VehiclesUpdate(id, fields) {
  let success = await Update(VERHICLES_REF, id, fields);
  return {
    success: success,
  };
}
export async function VehiclesRemove(id) {
  await Delete(VERHICLES_REF, id);
  return {
    success: true,
  };
}
export async function DriversGet(id) {
  let items;
  if (id) items = await Get(DRIVERS_REF + "/" + id);
  else items = await Get(DRIVERS_REF);
  return {
    success: true,
    data: items,
  };
}
export async function DriversAdd(name, license_level) {
  let id = await Insert(DRIVERS_REF, {
    name: name,
    license_level: license_level,
  });
  return {
    success: true,
    data: id,
  };
}
export async function DriversUpdate(id, fields) {
  let success = await Update(DRIVERS_REF, id, fields);
  return {
    success: success,
  };
}
export async function DriverDelete(id) {
  await Delete(DRIVERS_REF, id);
  return {
    success: true,
  };
}
