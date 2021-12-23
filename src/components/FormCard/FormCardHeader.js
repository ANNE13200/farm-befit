import React, { useState, useEffect } from "react";
import headerLogo from "./images/headerLogo.png";
import "./FormCardHeader.css";
import { Grid } from "@material-ui/core";
const FormCardHeader = ({ data }) => {
  const {
    lpToken,
    rewardToken,
    address,
    blockReward,
    startBlock,
    bonusEndBlock,
    bonus,
    endBlock,
    bonnumFarmersus,
  } = data;
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(async () => {
    const web3 = window.web3;
    setCurrentBlock(parseInt(await web3.eth.getBlockNumber()));
  }, []);
  return (
    <div className="cardHeaderContainer">
      <Grid container justify="space-between">
        <Grid item>
          <Grid container>
            <Grid item>
              <div className="headerLogo">
                <img src={headerLogo} height="35" />
              </div>
            </Grid>

            <Grid item>
              <div className="titleSubtitle">
                <h2>{`Farm ${data?.cardName} `}</h2>
                <p>{data?.cardName} / WBNB</p>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <div
            className="titleSubtitle"
            style={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            {currentBlock < endBlock ? <h2><span className="btn btn-success"><span className="fa fa-hourglass-half"></span> Ongoing</span></h2> : <h2><span className="btn btn-danger"><span className="fa fa-hourglass-o"></span> Ended</span></h2>}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default FormCardHeader;
