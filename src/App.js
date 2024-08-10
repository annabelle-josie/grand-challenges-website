import { useState } from "react";
import { tabs } from "./content.js";
import logo from "./logo.jpeg";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";

function PageContent({ pageId }) {
  function loadPage() {
    return (
      <div dangerouslySetInnerHTML={{ __html: tabs[pageId].htmlCode }}></div>
    );
  }

  return loadPage();
}

export default function UKAI() {
  const [page, setPage] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [complete, setComplete] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [progress, setProgress] = useState(0);

  function checkProgress() {
    console.log(complete);
    var totalComplete = 0;
    for (let i = 0; i < complete.length; i++) {
      if (complete[i] == true) {
        totalComplete++;
      }
    }
    setProgress((totalComplete / complete.length) * 100);
  }

  function pageSwap(pageName) {
    setSuccessMessage("");
    checkProgress();
    setPage(pageName);
  }

  function nextButton() {
    setSuccessMessage("");
    checkProgress();
    setPage((page + 1) % 6);
  }

  function Sidebar() {
    return (
      <div className="sidebar">
        <img src={logo} className="logo" />
        <button
          className={"tablink" + (page == 0 ? " active" : "")}
          onClick={() => pageSwap(0)}
        >
          Overview
        </button>
        <button
          className={"tablink" + (page == 1 ? " active" : "")}
          onClick={() => pageSwap(1)}
        >
          Types of AI
        </button>
        <button
          className={"tablink" + (page == 2 ? " active" : "")}
          onClick={() => pageSwap(2)}
        >
          Uses of AI
        </button>
        <button
          className={"tablink" + (page == 3 ? " active" : "")}
          onClick={() => pageSwap(3)}
        >
          Pattern Prediction
        </button>
        <button
          className={"tablink" + (page == 4 ? " active" : "")}
          onClick={() => pageSwap(4)}
        >
          Dangers of AI
        </button>
        <button
          className={"tablink" + (page == 5 ? " active" : "")}
          onClick={() => pageSwap(5)}
        >
          What You Can Do
        </button>
      </div>
    );
  }

  function QuizPart({ pageId }) {
    function compeleteCalc() {
      //TODO: I think there is something wrong here?
      //It loads the first page straight away,
      //the others need submit twice
      const newValue = [false, false, false, false, false, false];
      for (let i = 0; i < complete.length; i++) {
        newValue[i] = complete[i];
      }
      newValue[pageId] = true;
      setComplete(newValue);
    }

    function handleSubmit(e) {
      e.preventDefault();

      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());

      const answer = tabs[pageId].quiz[0].answer;
      if (formJson.types == answer) {
        //console.log("correct option chosen");
        setSuccessMessage("Correct!");
        compeleteCalc();
        checkProgress();
        //console.log(complete);
        //add confetti component here
      } else {
        setSuccessMessage("Incorrect, try again!");
        //console.log("nope, wrong one");
      }
      //checkProgress();
    }

    function durationFinder() {}

    function Success() {
      if (successMessage == "Correct!") {
        return (
          <div>
            <p id="types-result">{successMessage}</p>
            <Fireworks autorun={{ speed: 3, duration: 5 }} />
          </div>
        );
      } else {
        //setComplete(false);
        return <p id="types-result">{successMessage}</p>;
      }
    }

    function loadQuiz() {
      //tabs[pageId].htmlCode
      return (
        <div className="rounded-box">
          <p>{tabs[pageId].quiz[0].question}</p>
          <form id="types-form" method="post" onSubmit={handleSubmit}>
            <label>
              <input type="radio" name="types" value="option1" />
              {tabs[pageId].quiz[0].option1}
            </label>
            <br />
            <label>
              <input type="radio" name="types" value="option2" />{" "}
              {tabs[pageId].quiz[0].option2}
            </label>
            <br />
            <label>
              <input type="radio" name="types" value="option3" />{" "}
              {tabs[pageId].quiz[0].option3}
            </label>
            <br />
            <button type="submit">Submit</button>
          </form>
          <Success />
        </div>
      );
    }

    //var pageDetials = loadQuiz();
    return loadQuiz();
  }

  function allComplete() {
    var allDone = true;
    for (let i = 0; i < complete.length; i++) {
      if (complete[i] == false) {
        allDone = false;
      }
    }
    return allDone;
  }

  function MainContent() {
    function takeEmail(e) {
      e.preventDefault();

      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());

      console.log(formJson.email);

      //Send that email somewhere??
    }

    if (allComplete()) {
      //Show end page
      //console.log("complete well done");
      //setPage(100);
      return (
        <div id="final" className="main-content">
          <h2>Congratulations!</h2>
          <p>You have completed the UKAI resource for AI Literacy.</p>
          <div className="rounded-box">
            <p>
              Please provide your email to enter the giveaway and recieve your
              certificate:
            </p>
            <form id="final-form" onSubmit={takeEmail}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div className="main-content">
          <PageContent pageId={page} />
          <div className="quiz">
            <QuizPart pageId={page} />
          </div>
          <button className="next-button" onClick={nextButton}>
            Next
          </button>
        </div>
      );
    }
  }

  var booleanTest = true;
  const [isVisible, setIsVisible] = useState(false);
  return (
    <>
      <Sidebar />
      <MainContent />

      <div id="status-bar">
        <div id="progress-bar" style={{ width: progress + "%" }}>
          {Math.round((progress / 100) * 6) + "/6"}
        </div>
      </div>
    </>
  );
}
