import './Path.css';
import {collection, doc, getDoc, query} from "firebase/firestore";
import { useState } from 'react';
const Path = () =>{
    const [test, changeTest]=useState(false);
    const handleclick=(value)=>{
        changeTest(value);
    }
    return (
        <div className='Path'>
            {/* <button onClick={handleclick}>Click here</button> */}
            <select onChange={(e)=>handleclick(e.target.value)}>
                <option value={true}>True</option>
                <option value={false}>False</option>
            </select>
            {test && <><h1 className='titlePath'>Path</h1>
            <p>/Do something here...</p></>}
        </div>
    )
    // TODO
};

export default Path;