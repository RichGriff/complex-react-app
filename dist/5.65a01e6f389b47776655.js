(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{211:function(e,t,a){"use strict";a.r(t);var n=a(0),s=a.n(n),l=a(5),c=a(2),r=a.n(c),o=a(15),i=a(3),m=a(14),u=a(103),d=a.n(u),p=a(18),f=a(16),E=a(6),b=a(10);t.default=Object(o.g)((function(e){const t=Object(n.useContext)(E.a),a=Object(n.useContext)(b.a),{id:c}=Object(o.f)(),[u,h]=Object(n.useState)(!0),[g,y]=Object(n.useState)();if(Object(n.useEffect)(()=>{const e=r.a.CancelToken.source();return async function(){try{const t=await r.a.get("/post/"+c,{cancelToken:e.token});y(t.data),h(!1)}catch(e){console.log(e)}}(),()=>{e.cancel()}},[c]),!u&&!g)return s.a.createElement(f.a,null);if(u)return s.a.createElement(l.a,{title:"..."},s.a.createElement(m.a,null));const w=new Date(g.createdDate),N=`${w.getDate()}/${w.getMonth()+1}/${w.getFullYear()}`;return s.a.createElement(l.a,{title:g.title},s.a.createElement("div",{className:"d-flex justify-content-between"},s.a.createElement("h2",null,g.title),!!t.loggedIn&&t.user.username==g.author.username&&s.a.createElement("span",{className:"pt-2"},s.a.createElement(i.b,{to:`/post/${g._id}/edit`,"data-tip":"Edit","data-for":"edit",className:"text-primary mr-2"},s.a.createElement("i",{className:"fas fa-edit"})),s.a.createElement(p.a,{id:"edit",className:"custom-tooltip"})," ",s.a.createElement("a",{onClick:async function(){if(window.confirm("Do you really want to delete this post?"))try{"Success"==(await r.a.delete("/post/"+c,{data:{token:t.user.token}})).data&&(a({type:"flashMessage",value:"Post Deleted"}),e.history.push("/profile/"+t.user.username))}catch(e){console.log(errors)}},"data-tip":"Delete","data-for":"delete",className:"delete-post-button text-danger"},s.a.createElement("i",{className:"fas fa-trash"})),s.a.createElement(p.a,{id:"delete",clasName:"custom-tooltip"})," ")),s.a.createElement("p",{className:"text-muted small mb-4"},s.a.createElement(i.b,{to:"/profile/"+g.author.username},s.a.createElement("img",{className:"avatar-tiny",src:g.author.avatar})),"Posted by ",s.a.createElement(i.b,{to:"/profile/"+g.author.username},g.author.username)," on ",N),s.a.createElement("div",{className:"body-content"},s.a.createElement(d.a,{source:g.body,allowedTypes:["paragraph","strong","emphasis","text","heading","list","listItem"]})))}))}}]);