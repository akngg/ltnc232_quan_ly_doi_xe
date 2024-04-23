import React, {useState, useRef, useEffect} from 'react';

const DndDisplay=({currentStation, arrStation, car})=>{
    const [destination, setDestination]=useState(car.arrayOfDests);
    const [totalCost, setTotalCost]=useState(0);

    const dragDest=useRef<number>(0)
    const dragOverDest=useRef<number>(0)

    const handleSort=()=>{
        const destClone=[...destination];
        const temp=destClone[dragDest.current];
        destClone[dragDest.current]=destClone[dragOverDest.current];
        destClone[dragOverDest.current]=temp;
        setDestination(destClone);
    }

    useEffect(()=>{
        car.arrayOfDests=[...destination];
        const cloneArrDistance=[Math.sqrt(((currentStation.xCoordinate-arrStation.find(station=>station.name==destination[0]).xCoordinate)**2)
        +((currentStation.yCoordinate-arrStation.find(station=>station.name==destination[0]).yCoordinate)**2)).toFixed(1)];
        for(let index=1;index<destination.length;index++){
            cloneArrDistance.push(Math.sqrt(((arrStation.find(station=>station.name==destination[index-1]).xCoordinate-arrStation.find(station=>station.name==destination[index]).xCoordinate)**2)
            +((arrStation.find(station=>station.name==destination[index-1]).yCoordinate-arrStation.find(station=>station.name==destination[index]).yCoordinate)**2)).toFixed(1));
        }
        let tempTotalCost=0;
        // setArrDistance([...cloneArrDistance]);
        if(car.class==="truck"){
            for(let index=0;index<car.arrayOfGoods.length;index++){
                let totalDistance=0;
                for(let i=0;i<destination.length;i++){
                    totalDistance+=parseFloat(cloneArrDistance[i]);
                    if (destination.indexOf(car.arrayOfGoods[index].dest)===i) break;
                }
                // parseFloat(cloneArrDistance[destination.indexOf(car.arrayOfGoods[index].dest)])
                tempTotalCost+=3*totalDistance*car.arrayOfGoods[index].weight;
                if(index+1==car.arrayOfGoods.length){
                    tempTotalCost+=3*totalDistance*(car.weight+1000);
                }
            }
        }
        else{
            // console.log("passengers");
            // console.log(car.passengers);
            // console.log(car.arrayOfPassenger.length);
            for(let index=0;index<car.arrayOfPassenger.length;index++){
                let totalDistance=0;
                for(let i=0;i<destination.length;i++){
                    totalDistance+=parseFloat(cloneArrDistance[i]);
                    if (destination.indexOf(car.arrayOfPassenger[index].dest)===i) break;
                    // console.log("test");
                }
                // parseFloat(cloneArrDistance[destination.indexOf(car.arrayOfGoods[index].dest)])
                console.log(tempTotalCost);
                if(index+1==car.arrayOfPassenger.length){
                    tempTotalCost+=3*totalDistance*(car.weight)+(3*totalDistance*1000)+2000*totalDistance;
                }
                console.log("uhhhh");
                console.log(tempTotalCost);
                console.log(car.weight);
            }
        }
        setTotalCost(Math.round(tempTotalCost));
        car.cost=Math.round(tempTotalCost);
    },[destination])

    return (<div>
        <div className='destOrder'>
            <div className="dragAndDrop">{currentStation.name}</div>
            {destination.map((dest,index)=>(<div style={{display: "flex"}}>
                <p>--{index==0 ? Math.sqrt(((currentStation.xCoordinate-arrStation.find(station=>station.name==destination[0]).xCoordinate)**2)+((currentStation.yCoordinate-arrStation.find(station=>station.name==destination[0]).yCoordinate)**2)).toFixed(1)
                : Math.sqrt(((arrStation.find(station=>station.name==destination[index-1]).xCoordinate-arrStation.find(station=>station.name==destination[index]).xCoordinate)**2)
                +((arrStation.find(station=>station.name==destination[index-1]).yCoordinate-arrStation.find(station=>station.name==destination[index]).yCoordinate)**2)).toFixed(1) }--{">"}</p>
                <div className="dragAndDrop"
                draggable
                onDragStart={()=>{dragDest.current=index}}
                onDragEnter={()=>{dragOverDest.current=index}}
                onDragEnd={handleSort}
                onDragOver={(e)=>{e.preventDefault()}}
                >
                    <p>{dest}</p>
                </div>
            </div>))}
        </div>
        <div>
            <h1>Tổng chi phí: {totalCost}đ</h1>
        </div>
    </div>)
}

export default DndDisplay;