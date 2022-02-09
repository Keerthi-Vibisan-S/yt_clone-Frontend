import React, { useState, useEffect } from 'react';
import * as ai from 'react-icons/ai';
import Axios from 'axios';

export default function Comments(props) {

    const d = new Date();
    const {Vid} = props;

    const auth = JSON.parse(localStorage.getItem("userSno"));
    const [comments, setComments] = useState([]);
    const[data, setData] = useState({
      Sno: auth.Sno,
      Vid: Vid,
      comment: "",
      date: d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
    });

    //Selecting all comments for a particular video
    useEffect(async () => {
      const url = `http://localhost:2022/comments/get/${Vid}`;
      let res = await Axios.get(url);
      // console.log(res.data);
      if(res.data.length == 0)
      {
        setComments([]);
      }

      else
      {
        setComments(res.data);
      }
    }, [Vid]);


    const comment = (e) => {
      e.preventDefault();
      const url = `http://localhost:2022/comments/add`;
      let res = Axios.post(url, data);
      console.log("REspo");
      res.then((data) => {
        //console.log(data);
        if(data)
        {
          setData({...data, comment:""});
          //console.log("Comment Added -----");
        }
      }).catch( err => {
        if(err)
        {
          console.log(err);
        }
      })

    } 

  return (
      <section className='px-5 py-3 border-top'>
          <p className='text-muted'>Discussion</p>

          <div className='comment-input-div'>
            <form onSubmit={(e) => comment(e)} className='w-100 d-flex justify-content-between align-items-center'>
              <img src={auth.imgurl} alt="userImage" width="32" height="32" className="rounded-circle me-2" />
              <input type="text" value={data.comment} onChange={(event) => setData({...data, comment: event.target.value})} className='w-100 comment-input' placeholder={`Chat publicly as ${auth.namez}`} />
              <button type='submit' className='btn'><ai.AiOutlineSend size={24}/></button>
            </form>
            <div className='clear-fix'></div>
          </div>
          <div className='mt-5'></div>
          
          {comments.length == 0? "No Comments Yet, be the first to Start.": comments.map((n) => {
            return(
              <div key={n.Cid} className='mt-2 border-bottom'>
                <div className='d-flex justify-content-start align-items-center'>
                  <img src={n.imgurl} alt="userImage" width="32" height="32" className="rounded-circle me-2" />
                  <p>{n.namez} <span className='text-muted ms-2'>{n.datez}</span></p>
                </div>
                  <p className='ms-4 ps-3'>{n.commentz}</p>
              </div>
            );
          })}

      </section>
  );
}
