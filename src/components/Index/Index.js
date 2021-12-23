import React, { useState, useEffect } from "react";
import "./Index.css";
import "./pop.css";
//import ReactDOM from "react-dom";
import Modal from "react-modal";
import "../../../node_modules/awesome-react-steps/lib/css/arrows.css";
import { Arrows } from "awesome-react-steps";
import { Row, Col, Container } from "react-bootstrap";
import { FORM_GENERATOR, FORM_GENERATOR_ABI } from "../../config";
//import { mainContractAddress } from "../../utils/data";
import { useDispatch, useSelector } from "react-redux";
const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    width: "40%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "30px",
    padding: "20px",
    background: "black",
    color: "#fff",
  },
};
Modal.defaultStyles.overlay.backgroundColor = "#00000087";

// Modal.setAppElement('#yourAppElement')

export default function Index(props) {
  console.log("modal props", props);
  const dispatch = useDispatch();
  const allowanceValue = useSelector((state) => state);

  console.log("allowanceValuess", allowanceValue);
  console.log("allowanceValuesss", allowanceValue);
  const web3 = window.web3;

  const [contract, setContract] = useState();

  const [isPopUpFirstPage, setPopUpFirstPage] = useState(true);
  const [formStep, setFormStep] = useState(0);

  const [tokenAddress, setTokenAddress] = useState("");
  const [pair2Address, setPair2Address] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startBlock, setStartBlock] = useState("");
  const [multiplier, setMultiplier] = useState("");
  const [endDate, setEndDate] = useState("");
  const [expectedLiquidity, setExpectedLiquidity] = useState("");

  const [bonusEndDate, setBonusEndDate] = useState("");
  const [bonusEndBlock, setBonusEndBlock] = useState("");
  const [bonusAmount, setBonusAmount] = useState("");

  const [isDisabled, setIsDisabled] = useState(false);
  const [endBlock, setEndBlock] = useState("");

  const [modalIsOpen, setIsOpen] = React.useState(false);

  useEffect(() => {
    setIsOpen(props.isCreateFarmModalOpen);
  }, [props.isCreateFarmModalOpen]);
  useEffect(async () => {
    const web3 = window.web3;
    setStartBlock(parseInt((await web3.eth.getBlockNumber()) + 7000));
    setBonusEndBlock(parseInt((await web3.eth.getBlockNumber()) + 7100));
  }, []);
  useEffect(() => {
    setContract(props.contract);
  }, [props.contract]);

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }
  const getDisabled = async () => {
    try {
	  const currentBlock = web3.eth.getBlockNumber();
      let startValue = parseInt((await web3.eth.getBlockNumber()) + 6900);
      let response = await fetch(
        "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
          tokenAddress +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      console.log("response", response);
      let data = await response.json();

      let abi = JSON.parse(data.result);
      const contract2 = new web3.eth.Contract(abi, tokenAddress, {
        gasLimit: 3000000,
      });
      let tokenSymbol = await contract2.methods.symbol().call();
      console.log("Santosh Token Symbol",tokenSymbol);
      let decimal = await contract2.methods.decimals().call();
      let powerDecimal = Math.pow(10, decimal);
      let allowance = await contract2.methods
        .allowance(props.account, FORM_GENERATOR)
        .call();

      if (powerDecimal * expectedLiquidity < allowance * powerDecimal) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    } catch (e) {
      console.log(e);
    }
  };
  // await web3.eth.getBlockNumber()
  const verify = async () => {
    try {
      let startValue = parseInt((await web3.eth.getBlockNumber()) + 6900);
      let response = await fetch(
        "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
          tokenAddress +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      console.log("response", response);
      let data = await response.json();
      console.log("data", data);

      let abi = JSON.parse(data.result);
      const contract2 = new web3.eth.Contract(abi, tokenAddress, {
        gasLimit: 300000,
      });
      
      let allowance = await contract2.methods
        .allowance(props.account, FORM_GENERATOR)
        .call();

      // powerDecimal
      let decimal = await contract2.methods.decimals().call();
      let powerDecimal = Math.pow(10, decimal);
      dispatch({ type: "SET_ALLOWANCE", payload: allowance * powerDecimal });
      dispatch({ type: "SET_POWERDECIMAL", payload: powerDecimal });

      if (
        (bonusEndBlock - startBlock) * (multiplier * powerDecimal) <
        powerDecimal * expectedLiquidity
      ) {
        if (
          startBlock >= startValue &&
          bonusEndBlock > startBlock &&
          multiplier * powerDecimal > 1000
        ) {
          if (contract) {
            try {
              // web3.utils.toWei(approveAmount.toString(), "ether")
              let res = await contract2.methods
                .approve(FORM_GENERATOR, ( web3.utils.toWei(expectedLiquidity.toString(), "ether")))
                .send({ from: props.account })
                .on("receipt", async (receipt) => {})
                .on("error", async (error) => {
                  dispatch({
                    type: "SHOW_MESSAGE",
                    payload: {
                      body: error?.message,
                      title: "",
                      show: true,
                    },
                  });
                });
            } catch (error) {
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: error?.message,
                  title: "",
                  show: true,
                },
              });
            }
          } else {
            if (multiplier * powerDecimal > 1000) {
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: "Invalid Multiplier",
                  title: "",
                  show: true,
                },
              });
            } else {
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: "Contract is null",
                  title: "",
                  show: true,
                },
              });
            }
          }
        } else {
          if (startBlock < startValue) {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Invalid Start block",
                title: "",
                show: true,
              },
            });
          } else if (bonusEndBlock <= startBlock) {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "End block should greater then  Start block",
                title: "",
                show: true,
              },
            });
          } else if (multiplier * powerDecimal < 1000) {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Invalid multiplier",
                title: "",
                show: true,
              },
            });
          }
        }
      } else {
        dispatch({
          type: "SHOW_MESSAGE",
          payload: {
            body: "please choose correct block reward",
            title: "",
            show: true,
          },
        });
      }
    } catch (e) {
      console.log(e);
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: e?.message,
          title: "",
          show: true,
        },
      });
    }
  };
  const submitForm = async () => {
    try {
      let startValue = parseInt((await web3.eth.getBlockNumber()) + 6900);
      let response = await fetch(
        "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
          tokenAddress +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
      console.log("response", response);

      let data = await response.json();
      console.log("result ============================ 2", data);
      let abi = JSON.parse(data.result);
      // call decimal and approve (tokenAddress,ecpectedLiquidity*decimals)
      console.log("abi ============================ 2", abi);
      const contract2 = new web3.eth.Contract(abi, tokenAddress, {
        gasLimit: 3000000,
      });

      let decimal = await contract2.methods.decimals().call();
      let powerDecimal = Math.pow(10, decimal);
      console.log("powerDecimal_Santosh",powerDecimal);
      console.log((endBlock - startBlock) * (multiplier * powerDecimal));
      console.log(powerDecimal * expectedLiquidity);
      console.log("startValue", startValue);
      console.log("endBlock", endBlock);
      console.log("startBlock", startBlock);
      console.log(multiplier);
      console.log(powerDecimal);
      console.log(multiplier * powerDecimal);
      if (
        (bonusEndBlock - startBlock) * (multiplier * powerDecimal) <
        powerDecimal * expectedLiquidity
      ) {
        if (
          startBlock >= startValue &&
          bonusEndBlock > startBlock &&
          multiplier * powerDecimal > 1000
        ) {
          if (contract) {
            try {
              console.log(expectedLiquidity.toString());
              const contract3 = new web3.eth.Contract(
                FORM_GENERATOR_ABI,
                FORM_GENERATOR,
                {
                  gasLimit: 3000000,
                }
              );
              let gFee = await contract3.methods.gFees().call();

              let formCreated = await contract3.methods
                .createFarm(
                  tokenAddress,
                  web3.utils.toWei(expectedLiquidity.toString(), "ether"),
                  
                  pair2Address,
                  web3.utils.toWei(multiplier.toString(), "ether"),
                 
                  startBlock,
                  bonusEndBlock,
              
                  bonusAmount
                )
                .send({
                  from: props.account,

                  value: gFee.ethFee,
                })
                .on("error", async (error) => {
                  dispatch({
                    type: "SHOW_MESSAGE",
                    payload: {
                      body: error?.message,
                      title: "",
                      show: true,
                    },
                  });
                });
            } catch (e) {
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: e?.message,
                  title: "",
                  show: true,
                },
              });
            }
          } else {
            if (multiplier * powerDecimal > 1000) {
              
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: "Invalid Multiplier",
                  title: "",
                  show: true,
                },
              });
            } else {
              dispatch({
                type: "SHOW_MESSAGE",
                payload: {
                  body: "Contract is null",
                  title: "",
                  show: true,
                },
              });
            }
          }
        } else {
          if (startBlock < startValue) {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Invalid Start block",
                title: "",
                show: true,
              },
            });
          } else if (endBlock <= startBlock) {
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "End block should greater then  Start block",
                title: "",
                show: true,
              },
            });
          } else if (multiplier * powerDecimal < 1000) {
           
            dispatch({
              type: "SHOW_MESSAGE",
              payload: {
                body: "Invalid multiplier",
                title: "",
                show: true,
              },
            });
          }
        }
      } else {
        dispatch({
          type: "SHOW_MESSAGE",
          payload: {
            body: "please choose correct block reward",
            title: "",
            show: true,
          },
        });
      }

      console.log(
        "dataaaaa",
        tokenAddress,
        pair2Address,
        startDate,
        startBlock,
        multiplier,
        endDate,
        bonusEndBlock,
        bonusEndBlock
      );
    } catch (e) {
      console.log(e);
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: e?.message,
          title: "",
          show: true,
        },
      });
    }
  };
  const [errorTokenAddress, setErrorTokenAddress] = useState(false);
  const [errorExpectedLiquidity, setErrorExpectedLiquidity] = useState(false);

  const handleStep1Next = () => {
    if (tokenAddress === "" || expectedLiquidity === "") {
      if (tokenAddress === "") {
        setErrorTokenAddress(true);
      }
      if (expectedLiquidity === "") {
        setErrorExpectedLiquidity(true);
      }
    } else {
		 const shehzad = web3.utils.isAddress(tokenAddress);
	  if(shehzad == true) {
      setFormStep(formStep + 1);
      setErrorExpectedLiquidity(false);
      setErrorTokenAddress(false);
	  }
	  else {
		  setErrorTokenAddress(true);


	  }
    }
  };
  const [errorStartBlock, setErrorStartBlock] = useState(false);

  const handleStep2Next = () => {
    if (startBlock === "") {
      setErrorStartBlock(true);
    } else {
      setFormStep(formStep + 1);
      setErrorStartBlock(false);
    }
  };
  const [errorEndBlock, setErrorEndBlock] = useState(false);

  const handleStep5Next = () => {
    console.log();
    if (bonusEndBlock === "") {
      setErrorEndBlock(true);
    }
   if(multiplier === "") {
	     setErrorMultiplier(true);
   }
   if(bonusAmount === "") {
        setErrorBAmount(true);
      }
	else {
		setErrorMultiplier(false);
      setErrorBAmount(false);
      
      submitForm();
      setErrorEndBlock(false);
    }
  };

  const [errorMultiplier, setErrorMultiplier] = useState(false);
  const [errorBAmount, setErrorBAmount] = useState(false);
 

  const renderPart1 = () => {
    return (
      <Container style={{}}>
        <Col>
        <h1>Farm Token</h1>
          <span>
            <strong>Token Address</strong>
          </span>
          <br></br>
          <input
            type="text"
            placeholder="Enter Token Address"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
              
            }}
            value={tokenAddress}
            onChange={(t) => {
              setTokenAddress(t.target.value);
            }}
          />
          <small style={{ color: "red" }}>
            {errorTokenAddress && "Field is Required"}
          </small>
          
       
          <br></br>
          <span>
            <strong>Total amount to share amoung farmers over the entire farming period</strong>
          </span>
          <input
            type="number"
            placeholder="Amount"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
              
            }}
            value={expectedLiquidity}
            onChange={(t) => {
              setExpectedLiquidity(t.target.value);
            }}
          />
          <small style={{ color: "red" }}>
            {errorExpectedLiquidity && "Field is Required"}
          </small>
          <br></br>

          <div
            className="row"
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <button
             
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
              <a href="#/"><span className="fa fa-arrow-left"></span></a>
            </button>

            <button
              onClick={() => {
                handleStep1Next();
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
               <span className="fa fa-arrow-right"></span>
            </button>
          </div>
        </Col>
      </Container>
    );
  };
   const handleGoToStep3 = async (CStep) => {
    // pair2Address
	
    try {
      let response = await fetch(
        "https://api.bscscan.com/api?module=contract&action=getabi&address=" +
          pair2Address +
          "&apikey=FP934Q4T14QY4T1XSQT3Q7IZWVFHQAPWWI"
      );
	   console.log("Sheryar: ",response)
      let data = await response.json();
      console.log("result ============================ 2", data);
      let abi = JSON.parse(data.result);
      // call decimal and approve (tokenAddress,ecpectedLiquidity*decimals)
      console.log("abi ============================ 2", abi);
      const contract = new web3.eth.Contract(abi, pair2Address, {
        gasLimit: 3000000,
      });

      let pairsLength = await contract.methods.factory().call();

      setFormStep(CStep + 1);
    } catch (e) {
      dispatch({
        type: "SHOW_MESSAGE",
        payload: {
          body: "Invalid Factory pair",
          title: "",
          show: true,
        },
      });
    }
  };
  const renderPart2 = () => {
    return (
      <Container style={{}}>
        <Col>
        <h2>Pancakeswap Liquidity Token</h2>
          <span>
            <strong>
              {" "}
              Paste Pancakeswap v2 pair address that farmers can farm the yield
              token on
            </strong>
          </span>
          <br></br>

          <input
            type="text"
            placeholder="Enter Address"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
            }}
            value={pair2Address}
            onChange={(t) => {
              setPair2Address(t.target.value);
            }}
          />

          <br></br>

          <span>
            <strong>
              {" "}
              This MUST be a valid Pancakeswap v2 pair. The contract checks this is
              a Pancakeswap pair on farm creation. If it is not the script will
              revert.
            </strong>
          </span>

          <div
            className="row"
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <button
              onClick={() => {
                setFormStep(formStep - 1);
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
             <span className="fa fa-arrow-left"></span>
            </button>

            <button
              onClick={() => {
                handleGoToStep3(formStep);
                // setFormStep(formStep + 1);
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
               <span className="fa fa-arrow-right"></span>
            </button>
          </div>
        </Col>
      </Container>
    );
  };

  const renderPart3 = () => {
    return (
      <Container style={{}}>
        <Col>
        <h2>START BLOCK</h2>
          <span>
            <strong>
              We reccommend a start block at least 24 hours in advance to give
              people time to get ready to farm.
            </strong>
          </span>
          {/* <br></br>
          <input
            type="date"
            placeholder="Enter Date"
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 22,
              fontSize: 18,
              borderColor: "gray",
              borderWidth: 0.8,
            }}
            value={startDate}
            onChange={(t) => {
              setStartDate(t.target.value);
            }}
          /> */}
          <br></br>

          <input
            type="text"
            placeholder="Enter Block"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
            }}
            value={startBlock} // working here
            onChange={(t) => {
              setStartBlock(t.target.value);
            }}
          />
          <small style={{ color: "red" }}>
            {errorStartBlock && "Field is Required"}
          </small>
          <br></br>

          <div
            className="row"
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <button
              onClick={() => {
                setFormStep(formStep - 1);
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
               <span className="fa fa-arrow-left"></span>
            </button>

            <button
              onClick={() => {
                handleStep2Next();
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
             <span className="fa fa-arrow-right"></span>
            </button>
          </div>
        </Col>
      </Container>
    );
  };

 const rewardValue = expectedLiquidity / (bonusEndBlock - startBlock);
 const rewardToken = rewardValue/100 * 85;
 const rewardFormat = rewardToken.toPrecision(3);

  const renderPart4 = () => {
    return (
      <>
      <h2>END BLOCK TIME</h2>
        <br></br>
      <span><strong>END BLOCK</strong></span>
        <input
          type="text"
          placeholder="Block Number"
          style={{
            height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
          }}
          value={bonusEndBlock}
          onChange={(t) => {
            setBonusEndBlock(t.target.value);
          }}
        />
        <small style={{ color: "red" }}>
          {errorEndBlock && "Field is Required"}
        </small>
        <div
          className="row"
          style={{
            alignContent: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          
            <button
              onClick={() => {
                setFormStep(formStep - 1);
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
              <span className="fa fa-arrow-left"></span>
            </button>

            <button
              onClick={() => {
                setFormStep(formStep + 1);
              }}
              style={{
                padding: 8,
                flex: 1,
                
                fontSize: 24,
                paddingRight: 10,
                paddingLeft: 10,
                color: "#fff",
                fontSize: "bold",
                backgroundColor: "#edb329",
                
                height:60,
              }}
            >
              <span className="fa fa-arrow-right"></span>
            </button>
        </div>
      </>
    );
  };
  
  
  
  
   const renderPart5 = () => {
    return (
      <Container style={{}}>
        <h2>Rewards</h2>
        <Col>
          <input
            type="text"
            placeholder="Reward"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
            }}
            value={rewardFormat} 
            onChange={(t) => {
              setMultiplier(t.target.value);
            }}
          />
          <small style={{ color: "red" }}>
            {errorMultiplier && "Field is Required"}
          </small>
          <br></br>

          <span>
            <strong>
              Bonus periods start at the start block and end at the below
              specified block. For no bonus period set the multiplier to '1' and
              the bonus end block to {startBlock}
            </strong>
          </span>
          <br></br>

          <input
            type="text"
            placeholder="Multiplier (1x)"
            style={{
              height: 60,
              padding: 10,
              width: "100%",
              
              fontSize: 18,
            }}
            value={bonusAmount}
            onChange={(t) => {
              setBonusAmount(t.target.value);
            }}
          />
          <small style={{ color: "red" }}>
            {errorBAmount && "Field is Required"}
          </small>
          {/* <br></br> */}

          {/* <input
            type="date"
            placeholder="Bonus end date"
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 22,
              marginTop: 8,
              fontSize: 18,
              borderColor: "gray",
              borderWidth: 0.8,
            }}
            value={bonusEndDate}
            onChange={(t) => {
              setBonusEndDate(t.target.value);
            }}
          /> */}
          <br></br>

          {/* <input
            type="text"
            placeholder="Bonus end block"
            style={{
              padding: 10,
              width: "100%",
              borderRadius: 22,
              marginTop: 8,
              fontSize: 18,
              borderColor: "gray",
              borderWidth: 0.8,
            }}
            value={bonusEndBlock}
            onChange={(t) => {
              setBonusEndBlock(t.target.value);
            }}
          />
          <br></br> */}

          <div
            className="row"
            style={{
              alignContent: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
		  
		  <button
            onClick={() => {
              setFormStep(formStep - 1);
            }}
            style={{
              padding: 8,
              flex: 1,
              
              fontSize: 24,
              paddingRight: 10,
              paddingLeft: 10,
              color: "#fff",
              fontSize: "bold",
              backgroundColor: "#edb329",
              
              height:60,
            }}
          >
             <span className="fa fa-arrow-left"></span>
          </button>
          <button
            onClick={() => {
              verify();
            }}
            
            style={{
              flex: 1,
              padding: 8,
             
              fontSize: 18,
              paddingRight: 10,
              paddingLeft: 10,
              color: isDisabled ? "#000" : "#fff",
              fontSize: "bold",
              backgroundColor: isDisabled ? "#ece6ff" : "#edb329",
              borderWidth: 0.8,
            }}
          >
            <span className="badge badge-danger">First</span> - Approve
          </button>
          <button
            onClick={() => {
              handleStep5Next();
            }}
           
            style={{
              flex: 1,
              padding: 8,
             
              fontSize: 18,
              paddingRight: 10,
              paddingLeft: 10,
              color: "#fff",
              fontSize: "bold",
              backgroundColor:  "#edb329",
              borderWidth: 0.8,
            }}
          >
            <span className="badge badge-danger">Final</span> - Create
          </button>
		  
		  
          </div>
        </Col>
      </Container>
    );
  };


  const renderFormPart = (partNumber) => {
    switch (partNumber) {
      case 1:
        return renderPart1();
      case 2:
        return renderPart2();

      case 3:
        return renderPart3();

      case 4:
        return renderPart4();

      case 5:
        return renderPart5();
    }
  };

  const renderPart2Modal = () => {
    return (
      <div
        style={{
          marginBottom: 10,
        }}
      >
        <Arrows
          model={{
            steps: [
              { label: "STEP" },
              { label: "STEP" },
              { label: "STEP" },

              { label: "STEP" },
              { label: "FINAL" },
            ],
            current: formStep - 1,
          }}
        />
        ;{renderFormPart(formStep)}
      </div>
    );
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        shouldCloseOnOverlayClick={false}
        contentLabel="Example Modal"
      >
        <div
          className="row"
          style={{
            borderBottom: "1px #b2afaf solid",
          }}
        >
          <button
            type="button"
            className="backBtn v-btn v-btn--flat v-btn--icon v-btn--round theme--light v-size--default"
          >
            <span className="v-btn__content">
              <i
                aria-hidden="true"
                className="v-icon notranslate mdi mdi-arrow-left theme--light"
              />
            </span>
          </button>

          <div
            style={{
              textAlign: "center",
              flex: 1,
              
            }}
          >
            <h2> Launch a Farm </h2>

            <p>Current block: {startBlock}</p>
          </div>
         <button
		  onClick={() => {
                setPopUpFirstPage(true)
                setFormStep(formStep-1);
                props.onPopupClosed();
              }}
              type="button"
              className="close"
              id="closeBtn"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
           
          <button
            type="button"
            className="backBtn v-btn v-btn--flat v-btn--icon v-btn--round theme--light v-size--default"
          >
            <span className="v-btn__content">
              <i
                aria-hidden="true"
                className="v-icon notranslate mdi mdi-arrow-left theme--light"
              />
            </span>
          </button>
        </div>

        {isPopUpFirstPage  ? (
          <div className="pop_form">
            <span style={{ fontSize: 25 }}>
              Launching a farm on a uniswap pair is now incredibly simple. You
              deposit the reward token into a vault contract, set the start
              block, endblock, and bonus period -And your done!
            </span>

            <div className="caption mt-3">
              A farming contract is final. You cannot change
              <span className="font-weight-bold"> any </span> paramaters once
              initialised. There is no way to remove tokens other than farm them
              out over the set period. You cannot increase rewards either
              although you may create additional farms.
              <div className="font-weight-bold mt-3">Do not use this with</div>
              <div className="d-flex align-start">
                <i
                  aria-hidden="true"
                  className="v-icon notranslate mt-1 mr-2 mdi mdi-circle theme--light"
                  style={{ fontSize: "10px" }}
                />
                <div>
                  Rebasing tokens or any 'hack' on how a BEP20 token should
                  function.
                </div>
              </div>
              <div className="d-flex align-start">
                <i
                  aria-hidden="true"
                  className="v-icon notranslate mt-1 mr-2 mdi mdi-circle theme--light"
                  style={{ fontSize: "12px" }}
                />
                <div> Fee to sender tokens </div>
              </div>
              <div className="d-flex align-start">
                <i
                  aria-hidden="true"
                  className="v-icon notranslate mt-1 mr-2 mdi mdi-circle theme--light"
                  style={{ fontSize: "12px" }}
                />
                <div>
                  We reserve the right to delist your farm from our front end
                  app if you dont adhere to these token specifications as it
                  will affect farmers.
                </div>
              </div>
              <div className="mt-3">
                Essentially 1 token must always equal 1 token. If you send
                someone one token and they recieve less than one token you wont
                be able to generate a farm. For the rest of the 99% of normal
                BEP20 tokens with no weird transfer functions or magically
                changing balances (rebasing), this platform is for you.
              </div>
              <div className="mt-3 primary--text">
                Feel free to email Mark at email for help setting up your farm.
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPopUpFirstPage(false);
                setFormStep(1);
              }}
              className="continueBtn v-btn v-btn--block v-btn--depressed v-btn--rounded theme--light v-size--x-large primary"
             >
              <span className="v-btn__content"> Continue </span>
            </button>
          </div>
        ) : null}

        {formStep > 0 ? renderPart2Modal() : null}
      </Modal>
    );
  };

  return (
    <div>
      <center>
        <div className="jumbotron" id="ticket" style={{background: "black", opacity: "0.8"}}>
          <h1 style={{ fontWeight: "bold", color: "#fff" }}>$0.00</h1>
          <p style={{ fontWeight: "bold", color: "#fff" }}>
            Total farming Liquidity
          </p>
          <hr />

          <div className="col-sm-6"></div>

          {renderModal()}

          <div className="col-sm-6" id="creatform-div">
            {props?.mainAccountConnected ? (
              <button
                onClick={() => {
                  props.handleChangeType();
                  props.metamask();
                  setFormStep(false);
                }}
                className=" btn-primary btn-lg"
                style={{
                  background: "none",
                  outline: "none",
                  outlineStyle: "none",
                  border: "1px solid #fff",
                }}
              >
               <span className="fa fa-plus"></span> Create Farm
              </button>
            ) : (
              <button
                onClick={() => props.handleChangeType()}
                className=" btn-primary btn-lg"
                data-toggle="modal"
                data-target="#myWallet"
                style={{
                  background: "none",
                  outline: "none",
                  outlineStyle: "none",
                  border: "1px solid #fff",
                }}
              >
               <span className="fa fa-plus"></span> Create Farm
              </button>
            )}
            
          </div>
        </div>
      </center>
    </div>
  );
}
