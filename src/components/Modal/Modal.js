import React from "react";

export default function Modal(props) {
  return (
    <div
      className="modal fade"
      id="myWallet"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Connect to a wallet
            </h5>
            <button
              type="button"
              className="close"
              id="closeBtn"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <table className="table" style={{ cursor: "pointer" }}>
              <tr
                onClick={() => {
                  document.getElementById("closeBtn").click();

                  props.metamask();
                }}
              >
                <td>
                  <img src="img/icon/metamask.svg" alt="metamask" width="50" />
                </td>
                <td>
                  <p style={{ fontSize: "20px", marginTop: "5px" }}>
                    <b>
                      MetaMask -{" "}
                      <span style={{ color: "#061050" }}>Desktop</span>
                    </b>
                  </p>
                </td>
              </tr>
             
             
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
