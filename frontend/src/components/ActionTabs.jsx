import { useState } from "react";
import "../styles/leakDetail.css";
function ActionTabs() {


    const [activeTab, setActiveTab] = useState("cancel");



    const actions = {

        cancel: {

            title: "Cancel Subscription",

            description:
                "Stop paying for this subscription completely.",

            saving:
                "Estimated savings: $13.99/month",

            button:
                "Cancel Subscription"

        },


        cheaper: {

            title: "Switch to Cheaper Plan",

            description:
                "Keep using the service but move to a lower-cost plan.",

            saving:
                "Estimated savings: $5/month",

            button:
                "View Cheaper Plans"

        },


        deal: {

            title: "Get Better Deal",

            description:
                "Contact the provider and ask for discounts or better offers.",

            saving:
                "Possible savings: $3-$6/month",

            button:
                "Request Better Deal"

        }

    };



    return (

        <div className="action-container">


            <h2>
                Recommended Actions
            </h2>




            <div className="tabs">


                <button

                    className={
                        activeTab === "cancel"
                            ? "active-tab"
                            : ""
                    }

                    onClick={() => setActiveTab("cancel")}

                >

                    Cancel Subscription

                </button>





                <button

                    className={
                        activeTab === "cheaper"
                            ? "active-tab"
                            : ""
                    }

                    onClick={() => setActiveTab("cheaper")}

                >

                    Switch to Cheaper Plan

                </button>





                <button

                    className={
                        activeTab === "deal"
                            ? "active-tab"
                            : ""
                    }

                    onClick={() => setActiveTab("deal")}

                >

                    Get Better Deal

                </button>



            </div>






            <div className="action-card">


                <h3>

                    {actions[activeTab].title}

                </h3>




                <p>

                    {actions[activeTab].description}

                </p>




                <h4>

                    {actions[activeTab].saving}

                </h4>




                <button className="action-button">

                    {actions[activeTab].button}

                </button>



            </div>



        </div>

    );

}


export default ActionTabs;