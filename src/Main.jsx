import React, { useState, useEffect } from "react";
import "./Main.css";
import data from "./levels.json";
import { useNavigate } from "react-router-dom";
import CircleComponent from "./CircleConmponent";
import bunny from "./bugsBunny.png";
import { MdOutlineRestartAlt } from "react-icons/md";
import { AiFillYoutube, AiFillInstagram, AiFillFacebook } from "react-icons/ai";
import { CiPlay1 } from "react-icons/ci";
import { UserAuth } from "./AuthContext";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import Home from "./Home";
import { db } from "./firebase";
import {  getDocs, deleteDoc, updateDoc } from "firebase/firestore";

const BLOCK_SIZE = 150;
const PLAYER_SIZE = 50;
const JUMP_HEIGHT = 200;
const GRAVITY = 2;
let i = 0;
function Main() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [level, setLevel] = useState(0);
  const [language, setLanguage] = useState(0);

  const [blocks, setBlocks] = useState([
    { x: 300, y: 200, hit: false, isCorrect: false, option: "a" },
    { x: 600, y: 200, hit: false, isCorrect: false, option: "b" },
    { x: 900, y: 200, hit: false, isCorrect: false, option: "c" },
    { x: 1200, y: 200, hit: false, isCorrect: false, option: "d" },
  ]);
  const [jumping, setJumping] = useState(false);
  const [docId, setDocId] = useState('');

  const handleRefresh = async () => {
    // setNfts([]);
    if (user.email) {
      
      const querySnapshot = await getDocs(collection(db, user.email));
      console.log(querySnapshot.docs);
      if(querySnapshot.docs.length===0){
        try {
          const docRef = await addDoc(collection(db, user.email), {
            progress: level,
          });
    
          console.log("Document written with ID: ", docRef.id);
          // await addDoc(collection(doc(db, user.email)), {
          //   slug: slug,
          //   contractid: contract,
          // });
        } catch (error) {
          console.log(error);
        }
      }else{
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            console.log(doc.data().progress);
            setLevel(doc.data().progress);
            setDocId(doc.id)
          // tempnfts.push([doc.id, doc.data()]);
          // console.log(tempnfts);
        });
      }
      // console.log(querySnapshot.docs);
      // setNfts(tempnfts);
      // console.log(nfts);
    } else {
      console.log("no email");
    }

    // document.getElementById('ratata').innerHTML = "pancho";
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleLevelUpdate = async (e) => {
    // e.preventDefault();
    console.log({ level });
    try {
      // Get the document reference
      
      const washingtonRef = doc(db, user.email, docId);
      // Update the integer field
      await updateDoc(washingtonRef, {
        progress: level
      });

      console.log('Value updated successfully');
    } catch (error) {
      console.error('Error updating value:', error);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "ArrowLeft") {
      setPlayerPos((prevPos) => ({ ...prevPos, x: prevPos.x - 10 }));
    } else if (e.key === "ArrowRight") {
      setPlayerPos((prevPos) => ({ ...prevPos, x: prevPos.x + 10 }));
    } else if (e.key === "ArrowUp" && !jumping) {
      jump();
    }
  };

  const jump = () => {
    setJumping(true);
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
      if (jumpCount >= JUMP_HEIGHT) {
        clearInterval(jumpInterval);
        fall();
      } else {
        setPlayerPos((prevPos) => ({ ...prevPos, y: prevPos.y + 5 }));
        jumpCount += 5;
      }
    }, 10);
  };

  const fall = () => {
    let fallCount = 0;
    const fallInterval = setInterval(() => {
      if (fallCount >= JUMP_HEIGHT) {
        clearInterval(fallInterval);
        setPlayerPos((prevPos) => ({ ...prevPos, y: 0 }));
        setJumping(false);
      } else {
        setPlayerPos((prevPos) => ({ ...prevPos, y: prevPos.y - GRAVITY }));
        fallCount += GRAVITY;
      }
    }, 10);
  };

  const handleBlockCollision = (index) => {
    setBlocks((prevBlocks) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[index].hit = true;
      if (updatedBlocks[index].isCorrect) {
        setTimeout(() => {
          console.log("correct");
          const newLevel = level + 1;
          setLevel(newLevel);
        }, 1000);
      }
      return updatedBlocks;
    });
  };

  useEffect(() => {
    const handleBlockCollisions = () => {
      blocks.forEach((block, index) => {
        if (
          playerPos.x + PLAYER_SIZE > block.x &&
          playerPos.x < block.x + BLOCK_SIZE &&
          playerPos.y + PLAYER_SIZE > block.y &&
          playerPos.y < block.y + BLOCK_SIZE &&
          !block.hit
        ) {
          handleBlockCollision(index);
          i++;
          console.log(i);
        }
      });
    };

    handleBlockCollisions();

    // Add event listener for key presses
    window.addEventListener("keydown", handleKeyPress);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [playerPos, blocks]);

  useEffect(() => {
    const correctIndex = data[level].Correct;
    const options = data[level].options;
    const optionsh = data[level].optionsh;
    const optionsp = data[level].optionsp;
    console.log(correctIndex);
    i = 0;
    const updatedBlocks = blocks.map((block, index) => ({
      ...block,
      isCorrect: index === correctIndex ? true : false,
      option:
        language === 0
          ? options[index]
          : language === 1
          ? optionsh[index]
          : optionsp[index],
      hit: false,
    }));
    setBlocks(updatedBlocks);
    setPlayerPos({ x: 0, y: 0 });

    // data[level].options.map(e=>{
    //   console.log(e);

    // })
    handleLevelUpdate();
  }, [level, language]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      console.log("u r logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="signout__button" onClick={handleLogout}>Sign Out</div>
      {level === 0 && (
        <div className="start__main">
          <div className="start__logo">
            <img src={bunny} alt="" />
            BucksBunny
          </div>
          <div className="start__text">
            Learn about financial management in a fun and interactive way
          </div>
          <div className="start__button">
            <div className="button__container" onClick={() => setLevel(1)}>
              <CiPlay1 className="start__icon" />
            </div>
          </div>
        </div>
      )}
      {level >= 1 && level < data.length - 1 && (
        <div className="App">
          <div className="main__logo">
            <img src={bunny} alt="" className="logo" />
            BucksBunny
          </div>
          <div className="language__container">
            <div className="">
              <div
                className={`${language === 0 ? "language-active" : "language"}`}
                id="english"
                onClick={() => setLanguage(0)}
              >
                English
              </div>
              <p className="video__link">
                <Home videolink={"https://www.youtube.com/embed/3zZ0ugbkBZY"} />
              </p>
            </div>
            <div className="">
              <div
                className={`${language === 1 ? "language-active" : "language"}`}
                id="hindi"
                onClick={() => setLanguage(1)}
              >
                Hindi
              </div>
              <p className="video__link">
                <Home videolink={"https://www.youtube.com/embed/iLR1lVC11vk"} />
              </p>
            </div>
            <div className="">
              <div
                className={`${language === 2 ? "language-active" : "language"}`}
                id="punjabi"
                onClick={() => setLanguage(2)}
              >
                Punjabi
              </div>
              <p className="video__link">
                <Home videolink={"https://www.youtube.com/embed/Y1MOfnd-hC8"} />
              </p>
            </div>
          </div>
          <div className="content__container">
            <div className="content__content">
              {language === 0
                ? data[level].content
                : language === 1
                ? data[level].contenth
                : language === 2
                ? data[level].contentp
                : ""}
            </div>
          </div>
          <div className="question__container">
            Question:{" "}
            {language === 0
              ? data[level].question
              : language === 1
              ? data[level].questionh
              : language === 2
              ? data[level].questionp
              : ""}
          </div>
          <div className="game-container">
            <div
              className="player"
              style={{
                left: `${playerPos.x}px`,
                bottom: `${playerPos.y}px`,
              }}
            />
            <div className="main__container">
              {blocks.map((block, index) => (
                <div
                  key={index}
                  className={`block ${
                    block.hit
                      ? `${block.isCorrect ? "hit__correct" : "hit__wrong"}`
                      : ""
                  }`}
                  style={{
                    left: `${block.x}px`,
                    bottom: `${block.y}px`,
                  }}
                >
                  {block.option}
                </div>
              ))}
            </div>
          </div>

          <div className="course__container">
            <CircleComponent
              circleInFocus={level - 1}
              totalLength={data.length - 2}
            />
          </div>
        </div>
      )}
      {level === data.length - 1 && (
        <div className="start__main">
          <div className="start__logo">
            <img src={bunny} alt="" />
            BucksBunny
          </div>
          <div className="start__text">
            Thank you for completing this course. Hope you learned something
            valuable.
          </div>
          <div className="start__button">
            <div className="button__container" onClick={() => setLevel(1)}>
              <MdOutlineRestartAlt className="start__icon" />
            </div>
          </div>
          <div className="social__button">
            <AiFillFacebook className="start__icon" />
            <AiFillInstagram className="start__icon" />
            <AiFillYoutube className="start__icon" />
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
