function l(){return new Promise(t=>{setTimeout(()=>{t(Array.from({length:10}).fill(0).map((a,e)=>({value:e,label:`Option ${e}`})))},1e3)})}export{l as default};
