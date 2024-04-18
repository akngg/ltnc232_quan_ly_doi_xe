import React, {useState, useRef} from 'react';

const DndDisplay=({car})=>{
    const [destination, setDestination]=useState(car.arrayOfDests);

    const dragDest=useRef<number>(0)
    const dragOverDest=useRef<number>(0)

    const handleSort=()=>{
        const destClone=[...destination];
        const temp=destClone[dragDest.current];
        destClone[dragDest.current]=destClone[dragOverDest.current];
        destClone[dragOverDest.current]=temp;
        setDestination(destClone);
    }

    return (<div className='destOrder'>
            {destination.map((dest,index)=>(<div className="dragAndDrop"
            draggable
            onDragStart={()=>{dragDest.current=index}}
            onDragEnter={()=>{dragOverDest.current=index}}
            onDragEnd={handleSort}
            onDragOver={(e)=>{e.preventDefault()}}
            >
                <p>{dest}</p>
            </div>))}
        </div>)
}

export default DndDisplay;