import React from "react";
import "../Token/token.css"
export default function Token() {

  const [list, setList] = React.useState([]);

  //
  const tokens ={
    "VEN":{symbol:"BEFIT", logo:"default", address:"0xe13B291652F1eb4CFE2824921b859C6247eA8325", price:"$0.00"},
    
  }

  React.useEffect(()=>{
    const keys = Object.keys(tokens);
    renderTable(keys)

  }, [])

  const handleOnChange = e=>{
    const toSearch = e.target.value.toLowerCase();
    const keys = Object.keys(tokens);
    let toReturn = []
    for(let i =0; i< keys.length; i++){
      if(keys[i].toLowerCase().includes(toSearch))toReturn.push(keys[i])
    }

    renderTable(toReturn);
  } 

  const renderTable = (keys) =>{
    let toRender = [];
    for(let i = 0; i< keys.length; i++){
      toRender.push(tokens[keys[i]]);
    }
    setList(toRender);
  }

  return (
    <div>
      <center>
        
        <div className="container">
        <div className="jumbotron" style={{"background":"black",padding:"20px", opacity: "0.8"}}>
          <h2 className="farmable-token">Farmable tokens</h2>
          <form>
            <input
              type="text"
              name="find"
              placeholder="Search Tokens"
              className="form-control"
              id="form-control-id"
              onChange={handleOnChange}
              style={{ background: "none", color: "#fff" }}
            />
          </form>
        
          <br />
           <table className="table table-bordered">
             <tr>
               <th style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}>Token</th>
               <th style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}>FARM</th>
               <th style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}>Price</th>
             </tr>
             {list.length > 0 ? list.map(e=><tr>

              <td style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}><img src="img/logo.png" alt="VEN" width="50" height="50"></img>{e.symbol}</td>
            
              <td style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}>{e.address}</td>
              <td style={{"background":"#fff","textAlign":"center","fontWeight":"bold"}}>{e.price}</td>
            </tr>)
              : <tr>Not Found</tr>}
             
             </table>
             </div>
             </div>
             
       
      

        
      </center>
    </div>
  );
}

// 0xF8d0e1F7E33e709604D2BBAE1145172d161e3d6c