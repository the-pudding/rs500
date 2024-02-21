import{n as w,D as Q,d as A,E as T,r as v,F as R,G as O,H as U,I as D,J as N,a as V,K as q,L as W,M as X,N as Y,O as z,P as Z,Q as tt,R as et,S as nt,T as it}from"./scheduler.aH7YQpHM.js";const F=typeof window<"u";let L=F?()=>window.performance.now():()=>Date.now(),I=F?t=>requestAnimationFrame(t):w;const p=new Set;function B(t){p.forEach(e=>{e.c(t)||(p.delete(e),e.f())}),p.size!==0&&I(B)}function G(t){let e;return p.size===0&&I(B),{promise:new Promise(n=>{p.add(e={c:t,f:n})}),abort(){p.delete(e)}}}const b=new Map;let k=0;function st(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function rt(t,e){const n={stylesheet:T(e),rules:{}};return b.set(t,n),n}function H(t,e,n,i,r,a,u,l=0){const d=16.666/i;let s=`{
`;for(let g=0;g<=1;g+=d){const m=e+(n-e)*a(g);s+=g*100+`%{${u(m,1-m)}}
`}const f=s+`100% {${u(n,1-n)}}
}`,o=`__svelte_${st(f)}_${l}`,_=Q(t),{stylesheet:c,rules:$}=b.get(_)||rt(_,t);$[o]||($[o]=!0,c.insertRule(`@keyframes ${o} ${f}`,c.cssRules.length));const h=t.style.animation||"";return t.style.animation=`${h?`${h}, `:""}${o} ${i}ms linear ${r}ms 1 both`,k+=1,o}function C(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?a=>a.indexOf(e)<0:a=>a.indexOf("__svelte")===-1),r=n.length-i.length;r&&(t.style.animation=i.join(", "),k-=r,k||at())}function at(){I(()=>{k||(b.forEach(t=>{const{ownerNode:e}=t.stylesheet;e&&A(e)}),b.clear())})}let x;function J(){return x||(x=Promise.resolve(),x.then(()=>{x=null})),x}function P(t,e,n){t.dispatchEvent(U(`${e?"intro":"outro"}${n}`))}const S=new Set;let y;function _t(){y={r:0,c:[],p:y}}function $t(){y.r||v(y.c),y=y.p}function ot(t,e){t&&t.i&&(S.delete(t),t.i(e))}function ht(t,e,n,i){if(t&&t.o){if(S.has(t))return;S.add(t),y.c.push(()=>{S.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}const K={duration:0};function mt(t,e,n){const i={direction:"in"};let r=e(t,n,i),a=!1,u,l,d=0;function s(){u&&C(t,u)}function f(){const{delay:_=0,duration:c=300,easing:$=D,tick:h=w,css:g}=r||K;g&&(u=H(t,0,1,c,_,$,g,d++)),h(0,1);const m=L()+_,E=m+c;l&&l.abort(),a=!0,O(()=>P(t,!0,"start")),l=G(j=>{if(a){if(j>=E)return h(1,0),P(t,!0,"end"),s(),a=!1;if(j>=m){const M=$((j-m)/c);h(M,1-M)}}return a})}let o=!1;return{start(){o||(o=!0,C(t),R(r)?(r=r(i),J().then(f)):f())},invalidate(){o=!1},end(){a&&(s(),a=!1)}}}function gt(t,e,n){const i={direction:"out"};let r=e(t,n,i),a=!0,u;const l=y;l.r+=1;let d;function s(){const{delay:f=0,duration:o=300,easing:_=D,tick:c=w,css:$}=r||K;$&&(u=H(t,1,0,o,f,_,$));const h=L()+f,g=h+o;O(()=>P(t,!1,"start")),"inert"in t&&(d=t.inert,t.inert=!0),G(m=>{if(a){if(m>=g)return c(0,1),P(t,!1,"end"),--l.r||v(l.c),!1;if(m>=h){const E=_((m-h)/o);c(1-E,E)}}return a})}return R(r)?J().then(()=>{r=r(i),s()}):s(),{end(f){f&&"inert"in t&&(t.inert=d),f&&r.tick&&r.tick(1,0),a&&(u&&C(t,u),a=!1)}}}function yt(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function pt(t){t&&t.c()}function wt(t,e){t&&t.l(e)}function ft(t,e,n){const{fragment:i,after_update:r}=t.$$;i&&i.m(e,n),O(()=>{const a=t.$$.on_mount.map(Z).filter(R);t.$$.on_destroy?t.$$.on_destroy.push(...a):v(a),t.$$.on_mount=[]}),r.forEach(O)}function ut(t,e){const n=t.$$;n.fragment!==null&&(X(n.after_update),v(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function ct(t,e){t.$$.dirty[0]===-1&&(tt.push(t),et(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function xt(t,e,n,i,r,a,u=null,l=[-1]){const d=Y;z(t);const s=t.$$={fragment:null,ctx:[],props:a,update:w,not_equal:r,bound:N(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(d?d.$$.context:[])),callbacks:N(),dirty:l,skip_bound:!1,root:e.target||d.$$.root};u&&u(s.root);let f=!1;if(s.ctx=n?n(t,e.props||{},(o,_,...c)=>{const $=c.length?c[0]:_;return s.ctx&&r(s.ctx[o],s.ctx[o]=$)&&(!s.skip_bound&&s.bound[o]&&s.bound[o]($),f&&ct(t,o)),_}):[],s.update(),f=!0,v(s.before_update),s.fragment=i?i(s.ctx):!1,e.target){if(e.hydrate){nt();const o=V(e.target);s.fragment&&s.fragment.l(o),o.forEach(A)}else s.fragment&&s.fragment.c();e.intro&&ot(t.$$.fragment),ft(t,e.target,e.anchor),it(),q()}z(d)}class vt{$$=void 0;$$set=void 0;$destroy(){ut(this,1),this.$destroy=w}$on(e,n){if(!R(n))return w;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}$set(e){this.$$set&&!W(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const lt="4";typeof window<"u"&&(window.__svelte||(window.__svelte={v:new Set})).v.add(lt);export{vt as S,ot as a,wt as b,pt as c,ut as d,$t as e,yt as f,_t as g,mt as h,xt as i,gt as j,ft as m,ht as t};
