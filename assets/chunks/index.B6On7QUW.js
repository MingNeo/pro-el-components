function t(r){return r===null||typeof r!="object"?r:Array.isArray(r)?r.map(e=>t(e)):Object.keys(r).reduce((e,n)=>(e[n]=t(r[n]),e),{})}export{t as unbind};
