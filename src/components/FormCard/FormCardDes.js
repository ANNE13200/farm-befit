import React from "react";
import "./FormCardDes.css";

const FormCardDes = ({ data }) => {
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
  return (
    <div className="formDescription">
      <p>Block End On: {endBlock}</p>
    </div>
  );
};

export default FormCardDes;
