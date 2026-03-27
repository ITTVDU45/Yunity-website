<!DOCTYPE html>
<html class="html no-js home page-template-default page page-id-8" lang="de-DE">
  <head>
    <meta charset="utf-8" />
    <script>
      if(navigator.userAgent.match(/MSIE|Internet Explorer/i)||navigator.userAgent.match(/Trident\/7\..*?rv:11/i)){var href=document.location.href;if(!href.match(/[?&amp;]nowprocket/)){if(href.indexOf(&#34;?&#34;)==-1){if(href.indexOf(&#34;#&#34;)==-1){document.location.href=href+&#34;?nowprocket=1&#34;}else{document.location.href=href.replace(&#34;#&#34;,&#34;?nowprocket=1#&#34;)}}else{if(href.indexOf(&#34;#&#34;)==-1){document.location.href=href+&#34;&amp;nowprocket=1&#34;}else{document.location.href=href.replace(&#34;#&#34;,&#34;&amp;nowprocket=1#&#34;)}}}}
    </script>
    <script>
      class RocketLazyLoadScripts{constructor(){this.v=&#34;1.2.4&#34;,this.triggerEvents=[&#34;keydown&#34;,&#34;mousedown&#34;,&#34;mousemove&#34;,&#34;touchmove&#34;,&#34;touchstart&#34;,&#34;touchend&#34;,&#34;wheel&#34;],this.userEventHandler=this._triggerListener.bind(this),this.touchStartHandler=this._onTouchStart.bind(this),this.touchMoveHandler=this._onTouchMove.bind(this),this.touchEndHandler=this._onTouchEnd.bind(this),this.clickHandler=this._onClick.bind(this),this.interceptedClicks=[],window.addEventListener(&#34;pageshow&#34;,t=&gt;{this.persisted=t.persisted}),window.addEventListener(&#34;DOMContentLoaded&#34;,()=&gt;{this._preconnect3rdParties()}),this.delayedScripts={normal:[],async:[],defer:[]},this.trash=[],this.allJQueries=[]}_addUserInteractionListener(t){if(document.hidden){t._triggerListener();return}this.triggerEvents.forEach(e=&gt;window.addEventListener(e,t.userEventHandler,{passive:!0})),window.addEventListener(&#34;touchstart&#34;,t.touchStartHandler,{passive:!0}),window.addEventListener(&#34;mousedown&#34;,t.touchStartHandler),document.addEventListener(&#34;visibilitychange&#34;,t.userEventHandler)}_removeUserInteractionListener(){this.triggerEvents.forEach(t=&gt;window.removeEventListener(t,this.userEventHandler,{passive:!0})),document.removeEventListener(&#34;visibilitychange&#34;,this.userEventHandler)}_onTouchStart(t){&#34;HTML&#34;!==t.target.tagName&amp;&amp;(window.addEventListener(&#34;touchend&#34;,this.touchEndHandler),window.addEventListener(&#34;mouseup&#34;,this.touchEndHandler),window.addEventListener(&#34;touchmove&#34;,this.touchMoveHandler,{passive:!0}),window.addEventListener(&#34;mousemove&#34;,this.touchMoveHandler),t.target.addEventListener(&#34;click&#34;,this.clickHandler),this._renameDOMAttribute(t.target,&#34;onclick&#34;,&#34;rocket-onclick&#34;),this._pendingClickStarted())}_onTouchMove(t){window.removeEventListener(&#34;touchend&#34;,this.touchEndHandler),window.removeEventListener(&#34;mouseup&#34;,this.touchEndHandler),window.removeEventListener(&#34;touchmove&#34;,this.touchMoveHandler,{passive:!0}),window.removeEventListener(&#34;mousemove&#34;,this.touchMoveHandler),t.target.removeEventListener(&#34;click&#34;,this.clickHandler),this._renameDOMAttribute(t.target,&#34;rocket-onclick&#34;,&#34;onclick&#34;),this._pendingClickFinished()}_onTouchEnd(){window.removeEventListener(&#34;touchend&#34;,this.touchEndHandler),window.removeEventListener(&#34;mouseup&#34;,this.touchEndHandler),window.removeEventListener(&#34;touchmove&#34;,this.touchMoveHandler,{passive:!0}),window.removeEventListener(&#34;mousemove&#34;,this.touchMoveHandler)}_onClick(t){t.target.removeEventListener(&#34;click&#34;,this.clickHandler),this._renameDOMAttribute(t.target,&#34;rocket-onclick&#34;,&#34;onclick&#34;),this.interceptedClicks.push(t),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),this._pendingClickFinished()}_replayClicks(){window.removeEventListener(&#34;touchstart&#34;,this.touchStartHandler,{passive:!0}),window.removeEventListener(&#34;mousedown&#34;,this.touchStartHandler),this.interceptedClicks.forEach(t=&gt;{t.target.dispatchEvent(new MouseEvent(&#34;click&#34;,{view:t.view,bubbles:!0,cancelable:!0}))})}_waitForPendingClicks(){return new Promise(t=&gt;{this._isClickPending?this._pendingClickFinished=t:t()})}_pendingClickStarted(){this._isClickPending=!0}_pendingClickFinished(){this._isClickPending=!1}_renameDOMAttribute(t,e,r){t.hasAttribute&amp;&amp;t.hasAttribute(e)&amp;&amp;(event.target.setAttribute(r,event.target.getAttribute(e)),event.target.removeAttribute(e))}_triggerListener(){this._removeUserInteractionListener(this),&#34;loading&#34;===document.readyState?document.addEventListener(&#34;DOMContentLoaded&#34;,this._loadEverythingNow.bind(this)):this._loadEverythingNow()}_preconnect3rdParties(){let t=[];document.querySelectorAll(&#34;script[type=rocketlazyloadscript][data-rocket-src]&#34;).forEach(e=&gt;{let r=e.getAttribute(&#34;data-rocket-src&#34;);if(r&amp;&amp;0!==r.indexOf(&#34;data:&#34;)){0===r.indexOf(&#34;//&#34;)&amp;&amp;(r=location.protocol+r);try{let i=new URL(r).origin;i!==location.origin&amp;&amp;t.push({src:i,crossOrigin:e.crossOrigin||&#34;module&#34;===e.getAttribute(&#34;data-rocket-type&#34;)})}catch(n){}}}),t=[...new Map(t.map(t=&gt;[JSON.stringify(t),t])).values()],this._batchInjectResourceHints(t,&#34;preconnect&#34;)}async _loadEverythingNow(){this.lastBreath=Date.now(),this._delayEventListeners(),this._delayJQueryReady(this),this._handleDocumentWrite(),this._registerAllDelayedScripts(),this._preloadAllScripts(),await this._loadScriptsFromList(this.delayedScripts.normal),await this._loadScriptsFromList(this.delayedScripts.defer),await this._loadScriptsFromList(this.delayedScripts.async);try{await this._triggerDOMContentLoaded(),await this._pendingWebpackRequests(this),await this._triggerWindowLoad()}catch(t){console.error(t)}window.dispatchEvent(new Event(&#34;rocket-allScriptsLoaded&#34;)),this._waitForPendingClicks().then(()=&gt;{this._replayClicks()}),this._emptyTrash()}_registerAllDelayedScripts(){document.querySelectorAll(&#34;script[type=rocketlazyloadscript]&#34;).forEach(t=&gt;{t.hasAttribute(&#34;data-rocket-src&#34;)?t.hasAttribute(&#34;async&#34;)&amp;&amp;!1!==t.async?this.delayedScripts.async.push(t):t.hasAttribute(&#34;defer&#34;)&amp;&amp;!1!==t.defer||&#34;module&#34;===t.getAttribute(&#34;data-rocket-type&#34;)?this.delayedScripts.defer.push(t):this.delayedScripts.normal.push(t):this.delayedScripts.normal.push(t)})}async _transformScript(t){if(await this._littleBreath(),!0===t.noModule&amp;&amp;&#34;noModule&#34;in HTMLScriptElement.prototype){t.setAttribute(&#34;data-rocket-status&#34;,&#34;skipped&#34;);return}return new Promise(navigator.userAgent.indexOf(&#34;Firefox/&#34;)&gt;0||&#34;&#34;===navigator.vendor?e=&gt;{let r=document.createElement(&#34;script&#34;);[...t.attributes].forEach(t=&gt;{let e=t.nodeName;&#34;type&#34;!==e&amp;&amp;(&#34;data-rocket-type&#34;===e&amp;&amp;(e=&#34;type&#34;),&#34;data-rocket-src&#34;===e&amp;&amp;(e=&#34;src&#34;),r.setAttribute(e,t.nodeValue))}),t.text&amp;&amp;(r.text=t.text),r.hasAttribute(&#34;src&#34;)?(r.addEventListener(&#34;load&#34;,e),r.addEventListener(&#34;error&#34;,e)):(r.text=t.text,e());try{t.parentNode.replaceChild(r,t)}catch(i){e()}}:e=&gt;{function r(){t.setAttribute(&#34;data-rocket-status&#34;,&#34;failed&#34;),e()}try{let i=t.getAttribute(&#34;data-rocket-type&#34;),n=t.getAttribute(&#34;data-rocket-src&#34;);i?(t.type=i,t.removeAttribute(&#34;data-rocket-type&#34;)):t.removeAttribute(&#34;type&#34;),t.addEventListener(&#34;load&#34;,function r(){t.setAttribute(&#34;data-rocket-status&#34;,&#34;executed&#34;),e()}),t.addEventListener(&#34;error&#34;,r),n?(t.removeAttribute(&#34;data-rocket-src&#34;),t.src=n):t.src=&#34;data:text/javascript;base64,&#34;+window.btoa(unescape(encodeURIComponent(t.text)))}catch(s){r()}})}async _loadScriptsFromList(t){let e=t.shift();return e&amp;&amp;e.isConnected?(await this._transformScript(e),this._loadScriptsFromList(t)):Promise.resolve()}_preloadAllScripts(){this._batchInjectResourceHints([...this.delayedScripts.normal,...this.delayedScripts.defer,...this.delayedScripts.async],&#34;preload&#34;)}_batchInjectResourceHints(t,e){var r=document.createDocumentFragment();t.forEach(t=&gt;{let i=t.getAttribute&amp;&amp;t.getAttribute(&#34;data-rocket-src&#34;)||t.src;if(i){let n=document.createElement(&#34;link&#34;);n.href=i,n.rel=e,&#34;preconnect&#34;!==e&amp;&amp;(n.as=&#34;script&#34;),t.getAttribute&amp;&amp;&#34;module&#34;===t.getAttribute(&#34;data-rocket-type&#34;)&amp;&amp;(n.crossOrigin=!0),t.crossOrigin&amp;&amp;(n.crossOrigin=t.crossOrigin),t.integrity&amp;&amp;(n.integrity=t.integrity),r.appendChild(n),this.trash.push(n)}}),document.head.appendChild(r)}_delayEventListeners(){let t={};function e(e,r){!function e(r){!t[r]&amp;&amp;(t[r]={originalFunctions:{add:r.addEventListener,remove:r.removeEventListener},eventsToRewrite:[]},r.addEventListener=function(){arguments[0]=i(arguments[0]),t[r].originalFunctions.add.apply(r,arguments)},r.removeEventListener=function(){arguments[0]=i(arguments[0]),t[r].originalFunctions.remove.apply(r,arguments)});function i(e){return t[r].eventsToRewrite.indexOf(e)&gt;=0?&#34;rocket-&#34;+e:e}}(e),t[e].eventsToRewrite.push(r)}function r(t,e){let r=t[e];Object.defineProperty(t,e,{get:()=&gt;r||function(){},set(i){t[&#34;rocket&#34;+e]=r=i}})}e(document,&#34;DOMContentLoaded&#34;),e(window,&#34;DOMContentLoaded&#34;),e(window,&#34;load&#34;),e(window,&#34;pageshow&#34;),e(document,&#34;readystatechange&#34;),r(document,&#34;onreadystatechange&#34;),r(window,&#34;onload&#34;),r(window,&#34;onpageshow&#34;)}_delayJQueryReady(t){let e;function r(t){return t.split(&#34; &#34;).map(t=&gt;&#34;load&#34;===t||0===t.indexOf(&#34;load.&#34;)?&#34;rocket-jquery-load&#34;:t).join(&#34; &#34;)}function i(i){if(i&amp;&amp;i.fn&amp;&amp;!t.allJQueries.includes(i)){i.fn.ready=i.fn.init.prototype.ready=function(e){return t.domReadyFired?e.bind(document)(i):document.addEventListener(&#34;rocket-DOMContentLoaded&#34;,()=&gt;e.bind(document)(i)),i([])};let n=i.fn.on;i.fn.on=i.fn.init.prototype.on=function(){return this[0]===window&amp;&amp;(&#34;string&#34;==typeof arguments[0]||arguments[0]instanceof String?arguments[0]=r(arguments[0]):&#34;object&#34;==typeof arguments[0]&amp;&amp;Object.keys(arguments[0]).forEach(t=&gt;{let e=arguments[0][t];delete arguments[0][t],arguments[0][r(t)]=e})),n.apply(this,arguments),this},t.allJQueries.push(i)}e=i}i(window.jQuery),Object.defineProperty(window,&#34;jQuery&#34;,{get:()=&gt;e,set(t){i(t)}})}async _pendingWebpackRequests(t){let e=document.querySelector(&#34;script[data-webpack]&#34;);async function r(){return new Promise(t=&gt;{e.addEventListener(&#34;load&#34;,t),e.addEventListener(&#34;error&#34;,t)})}e&amp;&amp;(await r(),await t._requestAnimFrame(),await t._pendingWebpackRequests(t))}async _triggerDOMContentLoaded(){this.domReadyFired=!0,await this._littleBreath(),document.dispatchEvent(new Event(&#34;rocket-DOMContentLoaded&#34;)),await this._littleBreath(),window.dispatchEvent(new Event(&#34;rocket-DOMContentLoaded&#34;)),await this._littleBreath(),document.dispatchEvent(new Event(&#34;rocket-readystatechange&#34;)),await this._littleBreath(),document.rocketonreadystatechange&amp;&amp;document.rocketonreadystatechange()}async _triggerWindowLoad(){await this._littleBreath(),window.dispatchEvent(new Event(&#34;rocket-load&#34;)),await this._littleBreath(),window.rocketonload&amp;&amp;window.rocketonload(),await this._littleBreath(),this.allJQueries.forEach(t=&gt;t(window).trigger(&#34;rocket-jquery-load&#34;)),await this._littleBreath();let t=new Event(&#34;rocket-pageshow&#34;);t.persisted=this.persisted,window.dispatchEvent(t),await this._littleBreath(),window.rocketonpageshow&amp;&amp;window.rocketonpageshow({persisted:this.persisted})}_handleDocumentWrite(){let t=new Map;document.write=document.writeln=function(e){let r=document.currentScript;r||console.error(&#34;WPRocket unable to document.write this: &#34;+e);let i=document.createRange(),n=r.parentElement,s=t.get(r);void 0===s&amp;&amp;(s=r.nextSibling,t.set(r,s));let a=document.createDocumentFragment();i.setStart(a,0),a.appendChild(i.createContextualFragment(e)),n.insertBefore(a,s)}}async _littleBreath(){Date.now()-this.lastBreath&gt;45&amp;&amp;(await this._requestAnimFrame(),this.lastBreath=Date.now())}async _requestAnimFrame(){return document.hidden?new Promise(t=&gt;setTimeout(t)):new Promise(t=&gt;requestAnimationFrame(t))}_emptyTrash(){this.trash.forEach(t=&gt;t.remove())}static run(){let t=new RocketLazyLoadScripts;t._addUserInteractionListener(t)}}RocketLazyLoadScripts.run();
    </script>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="alternate" type="application/rss+xml" title="Zenjob DE Feed" href="https://www.zenjob.com/de/feed/" />
    <script type="rocketlazyloadscript" data-rocket-type="text/javascript" id="Cookiebot" data-rocket-src="https://consent.cookiebot.com/uc.js" data-cbid="d05d8d4a-6f7e-488c-aa85-17be7d0ffe89" defer="">
    </script>
    <link rel="alternate" hreflang="de-de" href="https://www.zenjob.com/de/" />
    <link rel="alternate" hreflang="en" href="https://www.zenjob.com/en/" />
    <link rel="alternate" hreflang="x-default" href="https://www.zenjob.com/de/" />
    <script type="rocketlazyloadscript" async="" data-rocket-src="https://www.clickcease.com/monitor/stat.js">
    </script>
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <script class="flynt-inline-script">
      window.Flynt={absmartly:{experiments:[],replaceVariant:e=&gt;{const t=window.Flynt.getProps(e);window.Flynt.absmartly.experiments.push(t.experiment),window.addEventListener(&#34;flynt:absmartly&#34;,(n=&gt;{const r=e.previousElementSibling,i=n.detail,o=i-1;if(i&gt;0&amp;&amp;t.variants[o]){const n=(new window.DOMParser).parseFromString(t.variants[o],&#34;text/html&#34;);e.insertAdjacentHTML(&#34;beforebegin&#34;,n.documentElement.textContent),null==r||r.remove()}}))}},getProps:e=&gt;{let t={};try{t=JSON.parse(e.querySelector(&#39;script[type=&#34;application/json&#34;]&#39;).innerHTML)}catch(e){}return t},getRandomNumber:(e,t)=&gt;(e=window.Math.ceil(e),t=window.Math.floor(t),window.Math.floor(window.Math.random()*(t-e))+e)};
    </script>
    <script type="rocketlazyloadscript" data-cookieconsent="ignore">
      window.dataLayer = window.dataLayer || [];
                function gtag() {
                    dataLayer.push(arguments);
                    }
                gtag(&#39;consent&#39;, &#39;default&#39;, {
                ad_personalization: &#39;denied&#39;,
                ad_storage: &#39;denied&#39;,
                ad_user_data: &#39;denied&#39;,
                analytics_storage: &#39;denied&#39;,
                functionality_storage: &#39;denied&#39;,
                personalization_storage: &#39;denied&#39;,
                security_storage: &#39;granted&#39;,
                wait_for_update: 500,
                });
                gtag(&#39;set&#39;, &#39;ads_data_redaction&#39;, true);
                gtag(&#39;set&#39;, &#39;url_passthrough&#39;, false);
    </script>
    <!-- This site is optimized with the Yoast SEO Premium plugin v21.6 (Yoast SEO v21.6) - https://yoast.com/wordpress/plugins/seo/ -->
    <title>
      Zenjob | Flexible Nebenjobs für Studierende | Moderner Personaldienstleister
    </title>
    <link rel="preload" as="font" href="https://www.zenjob.com/wp-content/themes/zenjob-website-2022/dist/assets/fonts/Systemia-Extrabold.3734f697b49a6253eea0.woff2" crossorigin="" />
    <link rel="preload" as="font" href="https://www.zenjob.com/wp-content/themes/zenjob-website-2022/dist/assets/fonts/Systemia-Regular.5feaab3d8a8ec3fbefc5.woff2" crossorigin="" />
    <link rel="preload" as="font" href="https://www.zenjob.com/wp-content/themes/zenjob-website-2022/dist/assets/fonts/Systemia-Bold.2c9c96755411def5fc07.woff2" crossorigin="" />
    <meta name="description" content="Zenjob ist die Job-App für Nebenjobs &amp; Studentenjobs. Wir bringen Unternehmen, die Personal suchen &amp; motivierte Mitarbeitende zusammen." />
    <link rel="canonical" href="https://www.zenjob.com/de/" />
    <meta property="og:locale" content="de_DE" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Homepage" />
    <meta property="og:description" content="Zenjob ist die Job-App für Nebenjobs &amp; Studentenjobs. Wir bringen Unternehmen, die Personal suchen &amp; motivierte Mitarbeitende zusammen." />
    <meta property="og:url" content="https://www.zenjob.com/de/" />
    <meta property="og:site_name" content="Zenjob DE" />
    <meta property="article:publisher" content="https://www.facebook.com/zenjob/" />
    <meta property="article:modified_time" content="2026-01-30T09:51:54+00:00" />
    <meta property="og:image" content="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/favicon_260x260.png" />
    <meta property="og:image:width" content="260" />
    <meta property="og:image:height" content="260" />
    <meta property="og:image:type" content="image/png" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json" class="yoast-schema-graph">
      {&#34;@context&#34;:&#34;https://schema.org&#34;,&#34;@graph&#34;:[{&#34;@type&#34;:&#34;WebPage&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/&#34;,&#34;url&#34;:&#34;https://www.zenjob.com/de/&#34;,&#34;name&#34;:&#34;Zenjob | Flexible Nebenjobs für Studierende | Moderner Personaldienstleister&#34;,&#34;isPartOf&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#website&#34;},&#34;about&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#organization&#34;},&#34;primaryImageOfPage&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#primaryimage&#34;},&#34;image&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#primaryimage&#34;},&#34;thumbnailUrl&#34;:&#34;https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/favicon_260x260.png&#34;,&#34;datePublished&#34;:&#34;2022-06-02T16:38:07+00:00&#34;,&#34;dateModified&#34;:&#34;2026-01-30T09:51:54+00:00&#34;,&#34;description&#34;:&#34;Zenjob ist die Job-App für Nebenjobs &amp; Studentenjobs. Wir bringen Unternehmen, die Personal suchen &amp; motivierte Mitarbeitende zusammen.&#34;,&#34;breadcrumb&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#breadcrumb&#34;},&#34;inLanguage&#34;:&#34;de-DE&#34;,&#34;potentialAction&#34;:[{&#34;@type&#34;:&#34;ReadAction&#34;,&#34;target&#34;:[&#34;https://www.zenjob.com/de/&#34;]}]},{&#34;@type&#34;:&#34;ImageObject&#34;,&#34;inLanguage&#34;:&#34;de-DE&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/#primaryimage&#34;,&#34;url&#34;:&#34;https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/favicon_260x260.png&#34;,&#34;contentUrl&#34;:&#34;https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/favicon_260x260.png&#34;,&#34;width&#34;:260,&#34;height&#34;:260,&#34;caption&#34;:&#34;zenjob-logo-blue-favicon&#34;},{&#34;@type&#34;:&#34;BreadcrumbList&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/#breadcrumb&#34;,&#34;itemListElement&#34;:[{&#34;@type&#34;:&#34;ListItem&#34;,&#34;position&#34;:1,&#34;name&#34;:&#34;Home&#34;}]},{&#34;@type&#34;:&#34;WebSite&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/#website&#34;,&#34;url&#34;:&#34;https://www.zenjob.com/de/&#34;,&#34;name&#34;:&#34;Zenjob&#34;,&#34;description&#34;:&#34;Flexible Nebenjobs&#34;,&#34;publisher&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#organization&#34;},&#34;potentialAction&#34;:[{&#34;@type&#34;:&#34;SearchAction&#34;,&#34;target&#34;:{&#34;@type&#34;:&#34;EntryPoint&#34;,&#34;urlTemplate&#34;:&#34;https://www.zenjob.com/de/?s={search_term_string}&#34;},&#34;query-input&#34;:&#34;required name=search_term_string&#34;}],&#34;inLanguage&#34;:&#34;de-DE&#34;},{&#34;@type&#34;:&#34;Organization&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/#organization&#34;,&#34;name&#34;:&#34;Zenjob&#34;,&#34;url&#34;:&#34;https://www.zenjob.com/de/&#34;,&#34;logo&#34;:{&#34;@type&#34;:&#34;ImageObject&#34;,&#34;inLanguage&#34;:&#34;de-DE&#34;,&#34;@id&#34;:&#34;https://www.zenjob.com/de/#/schema/logo/image/&#34;,&#34;url&#34;:&#34;https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/ZENJOB_LOGO_TWO_RGB_BLUE_WHITE.jpg&#34;,&#34;contentUrl&#34;:&#34;https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/ZENJOB_LOGO_TWO_RGB_BLUE_WHITE.jpg&#34;,&#34;width&#34;:887,&#34;height&#34;:887,&#34;caption&#34;:&#34;Zenjob&#34;},&#34;image&#34;:{&#34;@id&#34;:&#34;https://www.zenjob.com/de/#/schema/logo/image/&#34;},&#34;sameAs&#34;:[&#34;https://www.facebook.com/zenjob/&#34;,&#34;https://www.linkedin.com/company/zenjob/&#34;,&#34;https://www.youtube.com/c/ZenjobGmbH/featured&#34;]}]}
    </script>
    <!-- / Yoast SEO Premium plugin. -->
    <link rel="dns-prefetch" href="//www.zenjob.com" />
    <style type="text/css">
      :root.html { 
	 }
    </style>
    <style id="safe-svg-svg-icon-style-inline-css">
      .safe-svg-cover{text-align:center}.safe-svg-cover .safe-svg-inside{display:inline-block;max-width:100%}.safe-svg-cover svg{height:100%;max-height:100%;max-width:100%;width:100%}
    </style>
    <link rel="stylesheet" id="Flynt/assets-css" href="https://www.zenjob.com/de/wp-content/themes/zenjob-website-2022/dist/assets/main.fd21e054cc8487b95ac3.css?ver=6.4.3" media="all" />
    <script type="rocketlazyloadscript" data-rocket-src="https://www.zenjob.com/de/wp-includes/js/jquery/jquery.min.js?ver=3.7.1" id="jquery-core-js" defer="">
    </script>
    <link rel="icon" type="image/png" href="/de/wp-content/uploads/sites/2/fbrfg/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/de/wp-content/uploads/sites/2/fbrfg/favicon.svg" />
    <link rel="shortcut icon" href="/de/wp-content/uploads/sites/2/fbrfg/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/de/wp-content/uploads/sites/2/fbrfg/apple-touch-icon.png" />
    <link rel="manifest" href="/de/wp-content/uploads/sites/2/fbrfg/site.webmanifest" />
    <meta name="google-site-verification" content="8U90c_LIb-ibbRR-P7DwrNAaWpje73YZGDTumVquPT4" />
    <meta name="facebook-domain-verification" content="hgb4p3rqq2m3656yyl1gk6fw1y3hx7" />
    <!-- Backlink Tool -->
    <meta name="ahrefs-site-verification" content="7a4290eeaf83d65f9bcd5947d01da04b5d1756dbb7611f42cc77bdb049b88aa2" />
    <script type="rocketlazyloadscript" data-rocket-type="text/javascript" data-cookieconsent="ignore">
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({&#39;gtm.start&#39;:
        new Date().getTime(),event:&#39;gtm.js&#39;});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!=&#39;dataLayer&#39;?&#39;&amp;l=&#39;+l:&#39;&#39;;j.async=true;j.src=
        &#39;https://www.googletagmanager.com/gtm.js?id=&#39;+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,&#39;script&#39;,&#39;dataLayer&#39;,&#39;GTM-P3NRZQH&#39;);
    </script>
    <link rel="icon" href="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/App-icon.svg" sizes="32x32" />
    <link rel="icon" href="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/App-icon.svg" sizes="192x192" />
    <link rel="apple-touch-icon" href="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/App-icon.svg" />
    <meta name="msapplication-TileImage" content="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/App-icon.svg" />
  </head>
  <body>
    <a rel="nofollow" href="#mainContent" class="skipLink">    Skip to main content
</a>
    <div class="pageWrapper">
      <div class="flyntComponent themeLightPurple" is="flynt-block-top-bar">
        <script type="application/json">
          null
        </script>
        <div class="container centerMaxWidthContainer">
          <div class="content">
          </div>
          <button class="closeButton" aria-label="Close">
          </button>
        </div>
      </div>
      <header class="mainHeader">
        <nav id="flynt-navigation-main" is="flynt-navigation-main" class="flyntComponent" data-status="" aria-label="Main">
          <div class="nav-desktop">
            <div class="nav-top">
              <div class="container">
                <div class="container-logo-menu">
                  <a class="logo" href="https://www.zenjob.com/de/" aria-label="Zenjob DE">                  <svg width="112" height="36" viewBox="0 0 112 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M68.7054 29.2333C68.7054 32.4307 66.3075 34.356 63.547 34.356H58.9343V29.2694H61.8028V8.34342H68.7054V29.2333Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M79.857 8.05187C85.1608 8.05191 89.4839 11.2491 89.484 17.7158C89.484 24.1826 85.3061 27.5252 79.857 27.5252C74.408 27.5252 70.1207 23.9282 70.1207 17.7158C70.1207 11.5767 74.5532 8.05187 79.857 8.05187ZM79.821 13.0661C78.1492 13.0661 77.0963 14.774 77.0963 17.7158C77.0963 20.6577 78.1863 22.548 79.821 22.548C81.4557 22.5479 82.5093 20.6587 82.5093 17.7158C82.5093 14.773 81.4928 13.0662 79.821 13.0661Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M97.8389 11.2132H98.057C99.0016 9.57853 100.71 8.30645 103.325 8.30642C107.684 8.30642 110.591 12.23 110.591 18.0067C110.591 23.7834 107.684 27.5246 103.325 27.5246C100.636 27.5245 99.0376 26.2164 98.057 24.5817V24.5827H97.8389V27.2353H90.9363V1.76746H97.8389V11.2132ZM100.674 13.285C98.494 13.285 97.8398 15.6098 97.8398 17.8986C97.8398 20.1872 98.4939 22.5114 100.637 22.5119C102.635 22.5116 103.543 20.5137 103.543 17.9346C103.543 15.5006 102.744 13.285 100.674 13.285Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8551 8.05187C34.1589 8.05191 38.482 11.176 38.482 17.6788V19.1324H25.9853C26.1666 21.5303 27.3296 22.8373 28.8551 22.8373C30.054 22.8372 30.8895 22.038 31.2892 20.6577H38.2275C37.2097 24.9449 33.4687 27.5242 28.8551 27.5243C23.5986 27.5243 19.2563 24.0388 19.1219 18.0042L19.1187 17.7158C19.1188 11.5767 23.5513 8.05187 28.8551 8.05187ZM28.8177 12.7025C27.3643 12.7026 26.3105 13.574 26.02 15.5363H31.4703C31.3251 14.0828 30.6348 12.7025 28.8177 12.7025Z" fill="#2D31FF">
                    </path>
                    <path d="M52.5405 8.05283C56.2827 8.05283 58.934 10.5962 58.934 15.7187V27.2349H52.0317V16.8807C52.0317 14.5559 51.3415 13.2116 49.5976 13.2116C47.7084 13.2116 47.1635 14.8463 47.1635 17.2444V27.2349H40.2609V8.34342H47.1635V11.0678H47.3817C48.6899 8.88817 50.47 8.05283 52.5405 8.05283Z" fill="#2D31FF">
                    </path>
                    <path d="M18.6109 12.6295L9.78299 21.8937V22.0752H18.4655V27.2337H1.39111V22.9837L10.0736 13.647V13.4288H1.82683V8.34214H18.6109V12.6295Z" fill="#2D31FF">
                    </path>
                    <path d="M68.8148 6.34632H61.6937V1.80478H68.8148V6.34632Z" fill="#2D31FF">
                    </path>
                  </svg>
</a>
                  <div class="menu">
                    <div class="first-level-container">
                      <div class="first-level-item">
                        <button class="title" type="button" aria-expanded="false" aria-controls="item-114-1">
                          <p>
                            Für Unternehmen
                          </p>
                          <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                            </path>
                          </svg>
                        </button>
                      </div>
                      <div class="first-level-item">
                        <button class="title" type="button" aria-expanded="false" aria-controls="item-114-2">
                          <p>
                            Für Jobsuchende
                          </p>
                          <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                            </path>
                          </svg>
                        </button>
                      </div>
                      <div class="first-level-item">
                        <button class="title" type="button" aria-expanded="false">
                          <a href="https://www.zenjob.com/de/ueber-uns/">                          Über uns
</a>
                        </button>
                      </div>
                      <div class="first-level-item">
                        <button class="title" type="button" aria-expanded="false">
                          <a href="https://www.zenjob.com/de/kontakt/">                          Kontakt
</a>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="options">
                  <div class="search">
                    <form class="search-form" role="search" method="get" action="https://www.zenjob.com/de/">
                      <label for="s-1907548577" class="visuallyHidden">
                        Search...
                      </label>
                      <input class="search-text" type="text" value="" name="s" id="s-1907548577" placeholder="Search..." />
                      <button class="search-submit" type="submit" value="Search" aria-label="Search">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </circle>
                          <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </path>
                        </svg>
                      </button>
                      <button class="search-toggle" type="button" data-toggle-search="" aria-label="Search">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </circle>
                          <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </path>
                        </svg>
                      </button>
                    </form>
                  </div>
                  <div class="buttons">
                    <a class="button button-light" href="https://talent.zenjob.com/signup-form" target="_blank" rel="noreferrer noopener">                    Studentenjobs
</a>
                    <a class="button button-dark" href="https://www.zenjob.com/de/personal/#signupform">                    Personal buchen
</a>
                  </div>
                  <div class="language-switch">
                    <a rel="nofollow" class="language-current">                    DE
</a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="27" viewBox="0 0 2 27" fill="none">
                      <path d="M1 1L0.999999 26" stroke="#26282D" stroke-width="2" stroke-linecap="round">
                      </path>
                    </svg>
                    <a class="language" href="https://www.zenjob.com/en/">                    EN
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-114-1" "="">
              <div class="second-level-items">
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Personal-Icon.svg" alt="icon person navigation personal finden" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/">                      Personal
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/">                    Personal finden
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/werkstudenten-finden/">                    Werkstudenten finden
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/region/">                    Personal für Ihre Region
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/">                    Arbeitgebermagazin
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/10/new-office-stroke-standard.svg" alt="Office icon" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/branchen/">                      Industrie
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/logistik/">                    Logistik
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/einzelhandel/">                    Einzelhandel
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/lebensmittel/">                    Lebensmittelhandel
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/hotellerie/">                    Hotellerie &amp; Gastronomie
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/gebaeudedienstleistungen/">                    Grün- und Graupflege
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/events/">                    Eventbranche
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/e-commerce/">                    E-Commerce
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/call-center/">                    Call Center
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/laptop-technologie-icon.svg" alt="laptop icon technology" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/" target="_blank" rel="noreferrer noopener">                      Guidelines
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/">                    Wie funktioniert es
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/">                    Buchungsplattform
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/integrationen/">                    Intergrationen (API)
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/partnerschaften/">                    Partnerschaften
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/ressourcen/">                    Info-Guideline
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Erfolgsgeschichten-Icon.svg" alt="icon star navigation case studies" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/erfolgsgeschichten/">                      Erfolgsgeschichten
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/rewe-maerkte/">                    REWE-Märkte
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/edeka-maerkte/">                    EDEKA-Märkte
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/deiters/">                    Deiters
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/spicebar/">                    Spicebar
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-114-2" "="">
              <div class="second-level-items">
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Alle-Jons-icon.svg" alt="icon briefcase navigation jobs" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/jobs/">                      Alle Jobs
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobboerse">                    Jobbörse
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/tagesjobs/">                    Tagesjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/minijobs/">                    Minijobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/nebenjobs/">                    Nebenjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                    Werkstudentenjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/region/">                    Jobs in deiner Stadt
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Phone-icon.svg" alt="icon phone navigation training" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/trainings/">                      So startest du
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/zenjob-voraussetzungen/">                    Bedingungen
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anmeldung/">                    Anmeldung
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anstellungsverhaeltnis/">                    Rechtliches
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/erster-job/">                    Erster Job
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/immatrikulationsbescheinigung-hochladen/">                    Imma- Bescheinigung
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/gastro-gesundheitszeugnis/">                    Gesundheitszeugnis
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/fuehrungszeugnis-beantragen/">                    Führungszeugnis
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/vorbereitung-sicherheitsequipment/">                    Sicherheitsequipment
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Blog-Icon.svg" alt="icon book navigation blog" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/blog/">                      Blog
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                    Sozialversicherungsnummer
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/job-quiz-welcher-job-passt-zu-mir/">                    Job-Quiz
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/einfache-jobs/">                    Einfache Jobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                    Krankmeldung schreiben mit Vorlage
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                    Imma Guide
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/geld-verdienen-app/">                    Geld verdienen mit Apps
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/steuer-id/">                    Steuer-ID
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Help-Center-Icon.svg" alt="icon text bubble navigation help center" />
                    <div class="title-arrow">
                      <a href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                      Help Center
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790727554463-Neu-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                    Neu bei Zenjob?
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/sections/4790764065055-Allgemeines-Vertrag" target="_blank" rel="nofollow noreferrer noopener">                    Allgemeines und Aktuelles
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790742605727-Zenjob-PRO-Werkstudentenjobs" target="_blank" rel="nofollow noreferrer noopener">                    Werkstudentenjobs
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790709800735-Jobben-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                    Rund um App und Jobs
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                    Weitere Themen
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-114-3" "="">
              <div class="second-level-items">
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-114-4" "="">
              <div class="second-level-items">
              </div>
            </div>
          </div>
          <div class="nav-tablet">
            <div class="nav-top">
              <div class="container">
                <div class="container-logo-menu">
                  <a class="logo" href="https://www.zenjob.com/de/" aria-label="Zenjob DE">                  <svg width="112" height="36" viewBox="0 0 112 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M68.7054 29.2333C68.7054 32.4307 66.3075 34.356 63.547 34.356H58.9343V29.2694H61.8028V8.34342H68.7054V29.2333Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M79.857 8.05187C85.1608 8.05191 89.4839 11.2491 89.484 17.7158C89.484 24.1826 85.3061 27.5252 79.857 27.5252C74.408 27.5252 70.1207 23.9282 70.1207 17.7158C70.1207 11.5767 74.5532 8.05187 79.857 8.05187ZM79.821 13.0661C78.1492 13.0661 77.0963 14.774 77.0963 17.7158C77.0963 20.6577 78.1863 22.548 79.821 22.548C81.4557 22.5479 82.5093 20.6587 82.5093 17.7158C82.5093 14.773 81.4928 13.0662 79.821 13.0661Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M97.8389 11.2132H98.057C99.0016 9.57853 100.71 8.30645 103.325 8.30642C107.684 8.30642 110.591 12.23 110.591 18.0067C110.591 23.7834 107.684 27.5246 103.325 27.5246C100.636 27.5245 99.0376 26.2164 98.057 24.5817V24.5827H97.8389V27.2353H90.9363V1.76746H97.8389V11.2132ZM100.674 13.285C98.494 13.285 97.8398 15.6098 97.8398 17.8986C97.8398 20.1872 98.4939 22.5114 100.637 22.5119C102.635 22.5116 103.543 20.5137 103.543 17.9346C103.543 15.5006 102.744 13.285 100.674 13.285Z" fill="#2D31FF">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8551 8.05187C34.1589 8.05191 38.482 11.176 38.482 17.6788V19.1324H25.9853C26.1666 21.5303 27.3296 22.8373 28.8551 22.8373C30.054 22.8372 30.8895 22.038 31.2892 20.6577H38.2275C37.2097 24.9449 33.4687 27.5242 28.8551 27.5243C23.5986 27.5243 19.2563 24.0388 19.1219 18.0042L19.1187 17.7158C19.1188 11.5767 23.5513 8.05187 28.8551 8.05187ZM28.8177 12.7025C27.3643 12.7026 26.3105 13.574 26.02 15.5363H31.4703C31.3251 14.0828 30.6348 12.7025 28.8177 12.7025Z" fill="#2D31FF">
                    </path>
                    <path d="M52.5405 8.05283C56.2827 8.05283 58.934 10.5962 58.934 15.7187V27.2349H52.0317V16.8807C52.0317 14.5559 51.3415 13.2116 49.5976 13.2116C47.7084 13.2116 47.1635 14.8463 47.1635 17.2444V27.2349H40.2609V8.34342H47.1635V11.0678H47.3817C48.6899 8.88817 50.47 8.05283 52.5405 8.05283Z" fill="#2D31FF">
                    </path>
                    <path d="M18.6109 12.6295L9.78299 21.8937V22.0752H18.4655V27.2337H1.39111V22.9837L10.0736 13.647V13.4288H1.82683V8.34214H18.6109V12.6295Z" fill="#2D31FF">
                    </path>
                    <path d="M68.8148 6.34632H61.6937V1.80478H68.8148V6.34632Z" fill="#2D31FF">
                    </path>
                  </svg>
</a>
                </div>
                <div class="options">
                  <div class="search">
                    <form class="search-form" role="search" method="get" action="https://www.zenjob.com/de/">
                      <label for="s-879818434" class="visuallyHidden">
                        Search...
                      </label>
                      <input class="search-text" type="text" value="" name="s" id="s-879818434" placeholder="Search..." />
                      <button class="search-submit" type="submit" value="Search" aria-label="Search">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </circle>
                          <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </path>
                        </svg>
                      </button>
                      <button class="search-toggle" type="button" data-toggle-search="" aria-label="Search">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </circle>
                          <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          </path>
                        </svg>
                      </button>
                    </form>
                  </div>
                  <div class="buttons">
                    <a class="button button-light" href="https://talent.zenjob.com/signup-form" target="_blank" rel="noreferrer noopener">                    Studentenjobs
</a>
                    <a class="button button-dark" href="https://www.zenjob.com/de/personal/#signupform">                    Personal buchen
</a>
                  </div>
                  <div class="language-switch">
                    <a rel="nofollow" class="language-current">                    DE
</a>
                    <svg xmlns="http://www.w3.org/2000/svg" width="2" height="27" viewBox="0 0 2 27" fill="none">
                      <path d="M1 1L0.999999 26" stroke="#26282D" stroke-width="2" stroke-linecap="round">
                      </path>
                    </svg>
                    <a class="language" href="https://www.zenjob.com/en/">                    EN
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-top-menu">
              <div class="first-level-container">
                <div class="first-level-item">
                  <button class="title" type="button" aria-expanded="false" aria-controls="item-491-1">
                    <p>
                      Für Unternehmen
                    </p>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                </div>
                <div class="first-level-item">
                  <button class="title" type="button" aria-expanded="false" aria-controls="item-491-2">
                    <p>
                      Für Jobsuchende
                    </p>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                </div>
                <div class="first-level-item">
                  <a class="title" href="https://www.zenjob.com/de/ueber-uns/">                  Über uns
</a>
                </div>
                <div class="first-level-item">
                  <a class="title" href="https://www.zenjob.com/de/kontakt/">                  Kontakt
</a>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-491-1">
              <div class="second-level-items">
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Personal-Icon.svg" alt="icon person navigation personal finden" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/">                      Personal
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/">                    Personal finden
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/werkstudenten-finden/">                    Werkstudenten finden
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/region/">                    Personal für Ihre Region
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/">                    Arbeitgebermagazin
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/10/new-office-stroke-standard.svg" alt="Office icon" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/branchen/">                      Industrie
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/logistik/">                    Logistik
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/einzelhandel/">                    Einzelhandel
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/lebensmittel/">                    Lebensmittelhandel
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/hotellerie/">                    Hotellerie &amp; Gastronomie
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/gebaeudedienstleistungen/">                    Grün- und Graupflege
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/events/">                    Eventbranche
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/e-commerce/">                    E-Commerce
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/call-center/">                    Call Center
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/laptop-technologie-icon.svg" alt="laptop icon technology" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/" target="_blank" rel="noreferrer noopener">                      Guidelines
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/">                    Wie funktioniert es
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/">                    Buchungsplattform
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/integrationen/">                    Intergrationen (API)
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/partnerschaften/">                    Partnerschaften
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/ressourcen/">                    Info-Guideline
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Erfolgsgeschichten-Icon.svg" alt="icon star navigation case studies" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/erfolgsgeschichten/">                      Erfolgsgeschichten
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/rewe-maerkte/">                    REWE-Märkte
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/edeka-maerkte/">                    EDEKA-Märkte
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/deiters/">                    Deiters
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/spicebar/">                    Spicebar
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-491-2">
              <div class="second-level-items">
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Alle-Jons-icon.svg" alt="icon briefcase navigation jobs" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/jobs/">                      Alle Jobs
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobboerse">                    Jobbörse
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/tagesjobs/">                    Tagesjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/minijobs/">                    Minijobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/nebenjobs/">                    Nebenjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                    Werkstudentenjobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/region/">                    Jobs in deiner Stadt
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Phone-icon.svg" alt="icon phone navigation training" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/trainings/">                      So startest du
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/zenjob-voraussetzungen/">                    Bedingungen
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anmeldung/">                    Anmeldung
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anstellungsverhaeltnis/">                    Rechtliches
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/erster-job/">                    Erster Job
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/jobs/immatrikulationsbescheinigung-hochladen/">                    Imma- Bescheinigung
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/gastro-gesundheitszeugnis/">                    Gesundheitszeugnis
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/fuehrungszeugnis-beantragen/">                    Führungszeugnis
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/trainings/vorbereitung-sicherheitsequipment/">                    Sicherheitsequipment
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Blog-Icon.svg" alt="icon book navigation blog" />
                    <div class="title-arrow">
                      <a href="https://www.zenjob.com/de/blog/">                      Blog
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                    Sozialversicherungsnummer
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/job-quiz-welcher-job-passt-zu-mir/">                    Job-Quiz
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/einfache-jobs/">                    Einfache Jobs
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                    Krankmeldung schreiben mit Vorlage
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                    Imma Guide
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/geld-verdienen-app/">                    Geld verdienen mit Apps
</a>
                    <a class="third-level-title" href="https://www.zenjob.com/de/blog/steuer-id/">                    Steuer-ID
</a>
                  </div>
                </div>
                <div class="second-level-column">
                  <div class="second-level-title">
                    <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Help-Center-Icon.svg" alt="icon text bubble navigation help center" />
                    <div class="title-arrow">
                      <a href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                      Help Center
</a>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </div>
                  </div>
                  <div class="third-level-items">
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790727554463-Neu-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                    Neu bei Zenjob?
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/sections/4790764065055-Allgemeines-Vertrag" target="_blank" rel="nofollow noreferrer noopener">                    Allgemeines und Aktuelles
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790742605727-Zenjob-PRO-Werkstudentenjobs" target="_blank" rel="nofollow noreferrer noopener">                    Werkstudentenjobs
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790709800735-Jobben-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                    Rund um App und Jobs
</a>
                    <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                    Weitere Themen
</a>
                  </div>
                </div>
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-491-3">
              <div class="second-level-items">
              </div>
            </div>
            <div class="nav-bottom --isHidden" id="item-491-4">
              <div class="second-level-items">
              </div>
            </div>
          </div>
          <div class="nav-mobile">
            <div class="nav-top">
              <a class="logo" href="https://www.zenjob.com/de/" aria-label="Zenjob DE">              <svg width="112" height="36" viewBox="0 0 112 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M68.7054 29.2333C68.7054 32.4307 66.3075 34.356 63.547 34.356H58.9343V29.2694H61.8028V8.34342H68.7054V29.2333Z" fill="#2D31FF">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M79.857 8.05187C85.1608 8.05191 89.4839 11.2491 89.484 17.7158C89.484 24.1826 85.3061 27.5252 79.857 27.5252C74.408 27.5252 70.1207 23.9282 70.1207 17.7158C70.1207 11.5767 74.5532 8.05187 79.857 8.05187ZM79.821 13.0661C78.1492 13.0661 77.0963 14.774 77.0963 17.7158C77.0963 20.6577 78.1863 22.548 79.821 22.548C81.4557 22.5479 82.5093 20.6587 82.5093 17.7158C82.5093 14.773 81.4928 13.0662 79.821 13.0661Z" fill="#2D31FF">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M97.8389 11.2132H98.057C99.0016 9.57853 100.71 8.30645 103.325 8.30642C107.684 8.30642 110.591 12.23 110.591 18.0067C110.591 23.7834 107.684 27.5246 103.325 27.5246C100.636 27.5245 99.0376 26.2164 98.057 24.5817V24.5827H97.8389V27.2353H90.9363V1.76746H97.8389V11.2132ZM100.674 13.285C98.494 13.285 97.8398 15.6098 97.8398 17.8986C97.8398 20.1872 98.4939 22.5114 100.637 22.5119C102.635 22.5116 103.543 20.5137 103.543 17.9346C103.543 15.5006 102.744 13.285 100.674 13.285Z" fill="#2D31FF">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8551 8.05187C34.1589 8.05191 38.482 11.176 38.482 17.6788V19.1324H25.9853C26.1666 21.5303 27.3296 22.8373 28.8551 22.8373C30.054 22.8372 30.8895 22.038 31.2892 20.6577H38.2275C37.2097 24.9449 33.4687 27.5242 28.8551 27.5243C23.5986 27.5243 19.2563 24.0388 19.1219 18.0042L19.1187 17.7158C19.1188 11.5767 23.5513 8.05187 28.8551 8.05187ZM28.8177 12.7025C27.3643 12.7026 26.3105 13.574 26.02 15.5363H31.4703C31.3251 14.0828 30.6348 12.7025 28.8177 12.7025Z" fill="#2D31FF">
                </path>
                <path d="M52.5405 8.05283C56.2827 8.05283 58.934 10.5962 58.934 15.7187V27.2349H52.0317V16.8807C52.0317 14.5559 51.3415 13.2116 49.5976 13.2116C47.7084 13.2116 47.1635 14.8463 47.1635 17.2444V27.2349H40.2609V8.34342H47.1635V11.0678H47.3817C48.6899 8.88817 50.47 8.05283 52.5405 8.05283Z" fill="#2D31FF">
                </path>
                <path d="M18.6109 12.6295L9.78299 21.8937V22.0752H18.4655V27.2337H1.39111V22.9837L10.0736 13.647V13.4288H1.82683V8.34214H18.6109V12.6295Z" fill="#2D31FF">
                </path>
                <path d="M68.8148 6.34632H61.6937V1.80478H68.8148V6.34632Z" fill="#2D31FF">
                </path>
              </svg>
</a>
              <div class="container-lang-menu">
                <div class="language-switch">
                  <a rel="nofollow" class="language-current">                  DE
</a>
                  <svg xmlns="http://www.w3.org/2000/svg" width="2" height="27" viewBox="0 0 2 27" fill="none">
                    <path d="M1 1L0.999999 26" stroke="#26282D" stroke-width="2" stroke-linecap="round">
                    </path>
                  </svg>
                  <a class="language" href="https://www.zenjob.com/en/">                  EN
</a>
                </div>
                <button type="button" class="toggle-menu" aria-expanded="false" aria-controls="nav-mobile-panel" aria-label="Navigation menu">
                  <span class="lines">                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M39.5 33L8.5 33M39.5 24H17.5152M39.5 15L8.5 15" stroke="#000" stroke-width="4" stroke-linecap="round">
                    </path>
                  </svg>
</span>
                  <span class="cross --isHidden">                  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.74985 9.99255L37.886 38.1287" stroke="#000" stroke-width="4" stroke-linecap="round">
                    </path>
                    <path d="M38.2502 9.87128L10.114 38.0074" stroke="#000" stroke-width="4" stroke-linecap="round">
                    </path>
                  </svg>
</span>
                </button>
              </div>
            </div>
            <div class="nav-cta">
              <div class="buttons">
                <a class="button button-light" href="https://talent.zenjob.com/signup-form" target="_blank" rel="noreferrer noopener">                Studentenjobs
</a>
                <a class="button button-dark" href="https://www.zenjob.com/de/personal/#signupform">                Personal buchen
</a>
              </div>
            </div>
            <div id="nav-mobile-panel" class="nav-menu-items --isHidden">
              <div class="first-level-item">
                <button class="title" type="button" aria-expanded="false" aria-controls="item--1">
                  <p>
                    Für Unternehmen
                  </p>
                  <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                    </path>
                  </svg>
                </button>
                <div class="second-level-items --isHidden">
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Personal-Icon.svg" alt="icon person navigation personal finden" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/personal/">                        Personal
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/">                      Personal finden
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/werkstudenten-finden/">                      Werkstudenten finden
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/region/">                      Personal für Ihre Region
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/">                      Arbeitgebermagazin
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/10/new-office-stroke-standard.svg" alt="Office icon" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/personal/branchen/">                        Industrie
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/logistik/">                      Logistik
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/einzelhandel/">                      Einzelhandel
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/lebensmittel/">                      Lebensmittelhandel
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/hotellerie/">                      Hotellerie &amp; Gastronomie
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/gebaeudedienstleistungen/">                      Grün- und Graupflege
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/events/">                      Eventbranche
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/e-commerce/">                      E-Commerce
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/call-center/">                      Call Center
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/laptop-technologie-icon.svg" alt="laptop icon technology" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/" target="_blank" rel="noreferrer noopener">                        Guidelines
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/">                      Wie funktioniert es
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/">                      Buchungsplattform
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/buchungsplattform/integrationen/">                      Intergrationen (API)
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/partnerschaften/">                      Partnerschaften
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/ressourcen/">                      Info-Guideline
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Erfolgsgeschichten-Icon.svg" alt="icon star navigation case studies" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/erfolgsgeschichten/">                        Erfolgsgeschichten
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/rewe-maerkte/">                      REWE-Märkte
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/edeka-maerkte/">                      EDEKA-Märkte
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/deiters/">                      Deiters
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/spicebar/">                      Spicebar
</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="first-level-item">
                <button class="title" type="button" aria-expanded="false" aria-controls="item--2">
                  <p>
                    Für Jobsuchende
                  </p>
                  <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                    </path>
                  </svg>
                </button>
                <div class="second-level-items --isHidden">
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Alle-Jons-icon.svg" alt="icon briefcase navigation jobs" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/jobs/">                        Alle Jobs
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobboerse">                      Jobbörse
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/tagesjobs/">                      Tagesjobs
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/minijobs/">                      Minijobs
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/nebenjobs/">                      Nebenjobs
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                      Werkstudentenjobs
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/region/">                      Jobs in deiner Stadt
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Phone-icon.svg" alt="icon phone navigation training" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/trainings/">                        So startest du
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/zenjob-voraussetzungen/">                      Bedingungen
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anmeldung/">                      Anmeldung
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/anstellungsverhaeltnis/">                      Rechtliches
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/erster-job/">                      Erster Job
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/jobs/immatrikulationsbescheinigung-hochladen/">                      Imma- Bescheinigung
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/trainings/gastro-gesundheitszeugnis/">                      Gesundheitszeugnis
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/trainings/fuehrungszeugnis-beantragen/">                      Führungszeugnis
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/trainings/vorbereitung-sicherheitsequipment/">                      Sicherheitsequipment
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Blog-Icon.svg" alt="icon book navigation blog" />
                      <div class="title-arrow">
                        <a href="https://www.zenjob.com/de/blog/">                        Blog
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                      Sozialversicherungsnummer
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/job-quiz-welcher-job-passt-zu-mir/">                      Job-Quiz
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/einfache-jobs/">                      Einfache Jobs
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                      Krankmeldung schreiben mit Vorlage
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                      Imma Guide
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/geld-verdienen-app/">                      Geld verdienen mit Apps
</a>
                      <a class="third-level-title" href="https://www.zenjob.com/de/blog/steuer-id/">                      Steuer-ID
</a>
                    </div>
                  </div>
                  <div class="second-level-item">
                    <button class="second-level-title" aria-expanded="false">
                      <img class="img-icon lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/Help-Center-Icon.svg" alt="icon text bubble navigation help center" />
                      <div class="title-arrow">
                        <a href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                        Help Center
</a>
                        <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                          </path>
                        </svg>
                      </div>
                    </button>
                    <div class="third-level-items --isHidden">
                      <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790727554463-Neu-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                      Neu bei Zenjob?
</a>
                      <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/sections/4790764065055-Allgemeines-Vertrag" target="_blank" rel="nofollow noreferrer noopener">                      Allgemeines und Aktuelles
</a>
                      <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790742605727-Zenjob-PRO-Werkstudentenjobs" target="_blank" rel="nofollow noreferrer noopener">                      Werkstudentenjobs
</a>
                      <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de/categories/4790709800735-Jobben-bei-Zenjob" target="_blank" rel="nofollow noreferrer noopener">                      Rund um App und Jobs
</a>
                      <a class="third-level-title" href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noreferrer noopener">                      Weitere Themen
</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="first-level-item">
                <a class="title" href="https://www.zenjob.com/de/ueber-uns/">                Über uns
</a>
              </div>
              <div class="first-level-item">
                <a class="title" href="https://www.zenjob.com/de/kontakt/">                Kontakt
</a>
              </div>
              <div class="search">
                <form class="search-form" role="search" method="get" action="https://www.zenjob.com/de/">
                  <label for="s-1382319111" class="visuallyHidden">
                    Search...
                  </label>
                  <input class="search-text" type="text" value="" name="s" id="s-1382319111" placeholder="Search..." />
                  <button class="search-submit" type="submit" value="Search" aria-label="Search">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      </circle>
                      <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                    </svg>
                  </button>
                  <button class="search-toggle" type="button" data-toggle-search="" aria-label="Search">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="20.8535" cy="22.2426" r="7.85355" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      </circle>
                      <path d="M26.375 28.125L31.7643 33.611" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      </path>
                    </svg>
                  </button>
                </form>
              </div>
              <div class="additional-space">
              </div>
            </div>
          </div>
        </nav>
      </header>
      <main id="mainContent" class="mainContent" aria-label="Content">
        <div class="flyntComponent" is="flynt-header-dual">
          <div class="parentContainer">
            <div class="backgroundContainer">
              <div class="backgroundContainer-left">
              </div>
              <div class="backgroundContainer-right">
              </div>
            </div>
            <div class="contentContainer centerMaxWidthContainer">
              <div class="left-side">
                <div class="content">
                  <h1 class="title">
                    <div class="titleMain">
                      Personal,
                    </div>
                    <div class="titleHightlighted">
                      personalisiert.
                    </div>
                  </h1>
                  <div class="content-inner">
                    <p style="text-align: center">
                      Buchen Sie Aushilfen oder Werkstudierende digital – flexibel, verlässlich und genau dann, wenn Sie sie brauchen.
                    </p>
                  </div>
                  <div class="content-button">
                    <a class="button" href="https://www.zenjob.com/de/personal/">                    Zur Personallösung
</a>
                  </div>
                </div>
                <figure class="figure">
                  <img class="figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-1380x0-c-default.png" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTM4MCcgaGVpZ2h0PSc4MTYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PC9zdmc+" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-1630x0-c-default.png 1630w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-1536x0-c-default.png 1536w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-1380x0-c-default.png 1380w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-1080x0-c-default.png 1080w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-960x0-c-default.png 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-680x0-c-default.png 680w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professioneller-mann-blau-laptop-laechelt-510x0-c-default.png 510w" data-sizes="auto" alt="Ein professionell gekleideter Mann in Blau sitzt lächelnd vor einem Laptop." />
                </figure>
              </div>
              <div class="right-side">
                <div class="content">
                  <h1 class="title">
                    <div class="titleMain">
                      Dein Einsatz.
                    </div>
                    <div class="titleHightlighted">
                      Dein Job.
                    </div>
                  </h1>
                  <div class="content-inner">
                    <p style="text-align: center">
                      Du bringst den Einsatz. Wir bringen die Jobs, die zu deinem Leben passen – praktisch, fair und per App.
                    </p>
                  </div>
                  <div class="content-button">
                    <a class="button" href="https://www.zenjob.com/de/jobs">                    Zum Jobangebot
</a>
                  </div>
                </div>
                <figure class="figure">
                  <img class="figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-1380x0-c-default.png" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMTM4MCcgaGVpZ2h0PSc4MzYnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PC9zdmc+" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-1630x0-c-default.png 1630w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-1536x0-c-default.png 1536w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-1380x0-c-default.png 1380w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-1080x0-c-default.png 1080w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-960x0-c-default.png 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-680x0-c-default.png 680w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/student-blauer-hintergrund-gruenes-handy-kassiererin-im-supermarkt-510x0-c-default.png 510w" data-sizes="auto" alt="" />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent " is="flynt-block-banner">
          <div class=" backgroundBranded ">
            <div class="banner banner-mobile--top backgroundBranded fullWidth centerMaxWidthContainer">
              <img class="image desktop lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-desktop-500x0-c-default.png" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzIwOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-desktop-1920x0-c-default.png 1920w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-desktop-1320x0-c-default.png 1320w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-desktop-1280x0-c-default.png 1280w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-desktop-1035x0-c-default.png 1035w" data-sizes="auto" alt="zenjob-job-boerse-banner-desktop" />
              <img class="image mobile lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-mobile-500x0-c-default.png" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzI5OScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-mobile-860x0-c-default.png 860w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-mobile-760x0-c-default.png 760w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-mobile-500x0-c-default.png 500w,
            https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/abo-job-boerse-banner-mobile-375x0-c-default.png 375w" data-sizes="auto" alt="zenjob-job-boerse-banner-mobile" />
              <div class="content content-top">
                <div class="text">
                  <h2 class="h3" style="text-align: center">
                    Zeit ist Geld. Literally.
                  </h2>
                  <p class="text-medium text-brand text-white" style="text-align: center">
                    Mit unserer Jobbörse kannst du gezielt nach Jobs in deiner Nähe filtern und dich mit nur wenigen Klicks bewerben. Jetzt ausprobieren!
                  </p>
                </div>
                <div class="button-center">
                  <a class="button" href="https://www.zenjob.com/de/jobboerse">                  Zur Jobbörse
</a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing containedImage " is="flynt-block-text-image-alt">
          <div class="container centerMaxWidthContainer">
            <div class="box box--imageLeft box--mobileImageTop">
              <div class="box-inner box-inner--content">
                <h2>
                  When work is good, life gets better.
                </h2>
                <p class="text-medium">
                  Wer arbeiten will oder Personal braucht, soll beides einfach finden. Mit Zenjob läuft’s – flexibel, verlässlich und genau dann, wenn’s passt. So können Studierende sich auf ihr Studium konzentrieren und Unternehmen auf ihr Tagesgeschäft.
                </p>
              </div>
              <div class="box-inner box-inner--image">
                <figure class="figure">
                  <img class="figure-image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzc1JyBoZWlnaHQ9JzMzMycgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-640x0-c-default.jpg" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-375x0-c-default.jpg 375w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-480x0-c-default.jpg 480w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-640x0-c-default.jpg 640w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-768x0-c-default.jpg 768w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-960x0-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-young-male-student-greeting-location-manager-flexible-staff-1170x0-c-default.jpg 1170w" data-sizes="auto" loading="lazy" width="512" height="455" alt="graphics-young-male-student-greeting-location-manager-flexible-staff" />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing containedImage " is="flynt-block-text-image-alt">
          <div class="container centerMaxWidthContainer">
            <div class="box box--imageRight box--mobileImageTop">
              <div class="box-inner box-inner--content">
                <h2>
                  Wenn der Job zum Leben passt – und die Person zur Aufgabe.
                </h2>
                <p class="text-medium">
                  Unternehmen geben in unserer Online-Buchungsplattform an, wann und wo sie Unterstützung brauchen. Studierende finden passende Schichten direkt in ihrer Studentenjobs App – und bewerben sich, wenn’s für sie passt. Unsere Matching-KI übernimmt den Rest. Schnell. Fair. Verlässlich.
                  <br />
                  Weil gute Arbeit für alle einfach sein sollte.
                </p>
              </div>
              <div class="box-inner box-inner--image">
                <figure class="figure">
                  <img class="figure-image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzc1JyBoZWlnaHQ9JzMzMycgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-640x0-c-default.jpg" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-375x0-c-default.jpg 375w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-480x0-c-default.jpg 480w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-640x0-c-default.jpg 640w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-768x0-c-default.jpg 768w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-960x0-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/professionell-frau-laptop-zenjob-cwa-screenshot-unternehmen-1170x0-c-default.jpg 1170w" data-sizes="auto" loading="lazy" width="512" height="455" alt="Eine Frau sitzt vor einem Laptop, hält einen Stift in der Hand und zeigt einen Screenshot der Zenjob Company Web App." />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing themeBrandLight " is="flynt-grid-image-text">
          <script type="application/json">
            {&#34;options&#34;:{&#34;a11y&#34;:{&#34;nextSlideMessage&#34;:&#34;Next Slide&#34;,&#34;prevSlideMessage&#34;:&#34;Previous Slide&#34;,&#34;firstSlideMessage&#34;:&#34;This is the first slide&#34;,&#34;lastSlideMessage&#34;:&#34;This is the last slide&#34;,&#34;paginationBulletMessage&#34;:&#34;Go to slide {{index}}&#34;}}}
          </script>
          <div class="container centerMaxWidthContainer">
            <div class="preContent">
              <h3 class="h2" style="text-align: center">
                Eine dynamische Plattform für Nebenjobs und Aushilfen
              </h3>
            </div>
            <ul class="grid grid--columns3">
              <li class="grid-item">
                <div class="content">
                  <figure class="figure figure--icon">
                    <img class="image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-kalender-mit-person.svg" alt="Icon eines Kalenders mit einer Person – Termin oder Einsatzplanung" />
                  </figure>
                  <div class="content-inner ">
                    <h3 class="text-accent" style="text-align: center">
                      +40.000 Zenjobber
                    </h3>
                    <p class="text-medium" style="text-align: center">
                      bessern mit guter Arbeit ihr Konto auf.
                    </p>
                  </div>
                </div>
              </li>
              <li class="grid-item">
                <div class="content">
                  <figure class="figure figure--icon">
                    <img class="image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/zenjob-app-icon-illustration.svg" alt="Icon handy mit drei koffern" />
                  </figure>
                  <div class="content-inner ">
                    <h3 class="text-accent" style="text-align: center">
                      60.000 Jobs
                    </h3>
                    <p class="text-medium" style="text-align: center">
                      erscheinen jeden Monat in unserer App
                    </p>
                  </div>
                </div>
              </li>
              <li class="grid-item">
                <div class="content">
                  <figure class="figure figure--icon">
                    <img class="image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzM3NScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-desktop-mobile-person-sternebewertung.svg" alt="Illustratives Icon von Desktop und Mobilgerät mit einer Person und Sternebewertungen auf dem Bildschirm" />
                  </figure>
                  <div class="content-inner ">
                    <h3 class="text-accent" style="text-align: center">
                      100% digital
                    </h3>
                    <p class="text-medium" style="text-align: center">
                      Bewerbung und Buchung per Klick
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="flyntComponent componentSpacing containedImage themeBrandedLight" is="flynt-block-text-image-alt">
          <div class="container centerMaxWidthContainer">
            <div class="box box--imageRight box--mobileImageTop">
              <div class="box-inner box-inner--content">
                <h2>
                  Alles drin. Alles digital. Ihre Zenjob Buchungsplattform.
                </h2>
                <p class="text-medium">
                  Ob Aushilfe buchen, Schicht beenden oder Zeiten prüfen – mit unserer Plattform behalten Sie alles im Blick. Schnell, übersichtlich und genau dann, wenn es zählt. So wird jede Schicht ein Erfolg.
                  <br />
                  Alles an einem Ort. Für alle, die Personalplanung einfach und effizient halten wollen.
                </p>
                <p>
                  <a class="button" href="https://www.zenjob.com/de/buchungsplattform/">                  Mehr erfahren
</a>
                </p>
              </div>
              <div class="box-inner box-inner--image">
                <figure class="figure">
                  <img class="figure-image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzc1JyBoZWlnaHQ9JzMyNicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-640x0-c-default.jpg" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-375x0-c-default.jpg 375w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-480x0-c-default.jpg 480w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-640x0-c-default.jpg 640w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-768x0-c-default.jpg 768w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-960x0-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/Mehr-Flexibilitaet-und-weniger-Aufwand-1-1170x0-c-default.jpg 1170w" data-sizes="auto" loading="lazy" width="512" height="445" alt="Frau bucht sich talents über die Zenjob Plattform" />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing themeGreyLight" is="flynt-list-icons-alt">
          <div class="container centerMaxWidthContainer">
            <div class="preContent">
              <h4 style="text-align: left">
                Für jeden Bedarf die passende Lösung
              </h4>
              <p style="text-align: left">
                Ob kleines Café oder Großunternehmen – Zenjob passt sich Ihren Bedürfnissen an. Unsere Plattform bietet flexible Modelle für spontane Aushilfen, langfristige Einsätze und persönliche Betreuung. Einfach, effizient und genau so, wie Sie’s brauchen.
              </p>
            </div>
            <ul class="items items--columns3">
              <li class="item item--iconLeft item--alignLeft themeDefault">
                <div class="item-content">
                  <div class="item-title">
                    <figure class="figure item-icon">
                      <img class="figure-image item-iconImage lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-person-haken-illustration.svg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzM0NicgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-person-haken-illustration.svg 600w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-person-haken-illustration.svg 300w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-person-haken-illustration.svg 200w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/icon-person-haken-illustration.svg 100w" data-sizes="auto" alt="Illustratives Icon mit einer Person und Haken" />
                    </figure>
                    <h3 class="item-titleText">
                      FLEX
                    </h3>
                  </div>
                  <div class="item-description">
                    <h3>
                      Ad-hoc-Personal auf Knopfdruck
                    </h3>
                    <p class="text-dark">
                      Unsere Lösung für punktuellen Personalbedarf. Ideal, wenn es schnell gehen muss – für Lager, Gastro, Einzelhandel und mehr z.B. bei Urlaub oder Krankheit.
                    </p>
                    <ul>
                      <li class="text-dark">
                        Einzelschichten in wenigen Klicks buchen
                      </li>
                      <li class="text-dark">
                        Besetzung mit 3 Stunden Vorlauf
                      </li>
                      <li class="text-dark">
                        Keine Mindestabnahme
                      </li>
                      <li class="text-dark">
                        100 % digitaler Self-Service
                      </li>
                      <li class="text-dark">
                        Einsatzbereite Aushilfen mit Erfahrung
                      </li>
                    </ul>
                    <p>
                      <a class="button" href="https://www.zenjob.com/de/personal/#signupform">                      Jetzt mit FLEX starten
</a>
                    </p>
                  </div>
                </div>
              </li>
              <li class="item item--iconLeft item--alignLeft themeDefault">
                <div class="item-content">
                  <div class="item-title">
                    <figure class="figure item-icon">
                      <img class="figure-image item-iconImage lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Shift-managemebt.svg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzI4NCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Shift-managemebt.svg 600w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Shift-managemebt.svg 300w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Shift-managemebt.svg 200w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Shift-managemebt.svg 100w" data-sizes="auto" alt="Schichtmanagement Icon" />
                    </figure>
                    <h3 class="item-titleText">
                      TEMP
                    </h3>
                  </div>
                  <div class="item-description">
                    <h3>
                      Strukturierte Unterstützung auf Abruf
                    </h3>
                    <p class="text-dark">
                      Für Unternehmen mit regelmäßigem Bedarf. Wir besetzen Ihre Schichten mit vertrauten Zenjobbern – effizient, zuverlässig und strategisch.
                    </p>
                    <ul class="text-dark">
                      <li>
                        Wiederkehrende Aushilfen für gleichbleibende Qualität
                      </li>
                      <li>
                        Flexible Buchung von Schichten im Self-Service
                      </li>
                      <li>
                        Persönliche Betreuung bei Bedarf
                      </li>
                      <li>
                        Optimiertes Matching durch smarte Algorithmen
                      </li>
                    </ul>
                    <p>
                      <a class="button" href="https://www.zenjob.com/de/personal/#signupform">                      Gespräch vereinbaren
</a>
                    </p>
                  </div>
                </div>
              </li>
              <li class="item item--iconLeft item--alignLeft themeDefault">
                <div class="item-content">
                  <div class="item-title">
                    <figure class="figure item-icon">
                      <img class="figure-image item-iconImage lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Short-term-staff-booking.svg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzAwJyBoZWlnaHQ9JzI4NCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Short-term-staff-booking.svg 600w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Short-term-staff-booking.svg 300w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Short-term-staff-booking.svg 200w,
                    https://www.zenjob.com/de/wp-content/uploads/sites/2/2025/07/Short-term-staff-booking.svg 100w" data-sizes="auto" alt="Icon kurzfrisitge Besetzung" />
                    </figure>
                    <h3 class="item-titleText">
                      PRO
                    </h3>
                  </div>
                  <div class="item-description">
                    <h3>
                      Werkstudierende, die mitdenken
                    </h3>
                    <p class="text-dark">
                      Langfristige Unterstützung durch motivierte Studierende – für Projekte, Backoffice oder Kundenservice.
                    </p>
                    <ul class="text-dark">
                      <li>
                        Werkstudierende für 3 bis 18 Monate
                      </li>
                      <li>
                        Bis zu 20 Stunden pro Woche flexibel einsetzbar
                      </li>
                      <li>
                        Direktvermittlung möglich
                      </li>
                      <li>
                        Skill-basiertes Matching
                      </li>
                      <li>
                        Optional mit persönlicher Betreuung
                      </li>
                    </ul>
                    <p>
                      <a class="button" href="https://www.zenjob.com/de/personal/werkstudenten-finden/#signup">                      Personal anfragen
</a>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div is="flynt-reusable-component">
          <div class="flyntComponent " is="flynt-slider-logos">
            <script type="application/json">
              {&#34;options&#34;:{&#34;a11y&#34;:{&#34;nextSlideMessage&#34;:&#34;Next Slide&#34;,&#34;prevSlideMessage&#34;:&#34;Previous Slide&#34;,&#34;firstSlideMessage&#34;:&#34;This is the first slide&#34;,&#34;lastSlideMessage&#34;:&#34;This is the last slide&#34;,&#34;paginationBulletMessage&#34;:&#34;Go to slide {{index}}&#34;}}}
            </script>
            <div class="spacing">
              <div class="container centerMaxWidthContainer">
                <div class="preContent">
                  <p style="text-align: center">
                    Über 1000 Unternehmen wissen: Gute Arbeit beginnt mit Zenjob.
                  </p>
                </div>
              </div>
              <div class="container container--slider centerMaxWidthContainer">
                <div data-slider="" class="swiper-container slider" data-slider="">
                  <div class="swiper-wrapper slider-inner" data-slider-item="">
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/2560px-Hertz_Logo-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/2560px-Hertz_Logo-1.png" alt="zenjob logo hertz customer" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/2560px-Zara_Logo-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/2560px-Zara_Logo-1.png" alt="zenjob customer - zara" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Alnatura-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Alnatura-1.png" alt="Zenjob customer - Alnatura" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/download-2-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/download-2-1.png" alt="zenjob customer - mister spex" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/hellofresh.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/hellofresh.png" alt="zenjob customer - hellofresh" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/logo_motel_ONE.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/logo_motel_ONE.png" alt="logo_motel_one" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <!--?xml version="1.0" encoding="UTF-8"?-->
                        <svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" version="1.1" id="layer" x="0px" y="0px" viewBox="0 0 652 652" style="enable-background:new 0 0 652 652;" space="preserve">
                          <g>
                            <path d="M309.9,330c-0.8-1.9-1.4-4-2-6.5c-0.6-2.5-1.4-4.9-2.3-7.3c-0.9-2.3-2-4.2-3.4-5.9c-1.4-1.5-3.2-2.3-5.4-2.3 c-4.2,0-7.9,3.1-11,9.1c-3.1,6-4.8,15.2-4.8,27.1c0,14.4,2.9,25.2,8.7,32.8c5.7,7.6,13.5,11.3,23,11.3c5.4,0,10.5-1.4,15-4 c4.6-2.8,9.1-7.6,12.5-14.8l1.4,3.4c-3.2,12.2-9.1,22-17,28.3c-7.9,6.3-17.6,9.4-29.2,9.4c-6.8,0-13.1-1.2-19-3.7 c-6-2.5-11.1-5.9-15.8-10.4c-4.5-4.5-8-9.9-10.8-16.1c-2.6-6.2-4-13.3-4-21c0-7.9,1.4-15.2,4.2-21.8s6.7-12.5,11.6-17.5 c4.9-4.9,10.8-8.8,17.6-11.6c6.8-2.8,14.2-4.2,22.3-4.2c6.2,0,11.6,0.6,16.1,2c4.6,1.4,8.4,3.1,11.4,5.3c3.1,2.2,5.4,4.5,7,7.3 c1.5,2.6,2.3,5.4,2.3,8c0,3.7-1.2,7-3.9,9.6c-2.6,2.6-6,4-10.5,4C317,340.3,312.4,336.8,309.9,330z">
                            </path>
                            <path d="M393.4,410.4c-7.7,0-15-1.4-21.7-4c-6.7-2.8-12.4-6.5-17.2-11.3c-4.8-4.8-8.5-10.4-11.3-16.7c-2.8-6.3-4-13.3-4-20.6 c0-7.3,1.4-14.2,4.3-20.7s6.8-12.2,11.8-17c4.9-4.8,10.7-8.7,17.3-11.4c6.7-2.9,13.6-4.3,20.9-4.3c8,0,15.3,1.4,22.1,4.2 c6.7,2.8,12.4,6.5,17.2,11.3c4.8,4.8,8.4,10.4,11.1,16.7c2.6,6.5,4,13.3,4,20.7c0,7-1.4,13.8-4,20.3c-2.8,6.5-6.5,12.1-11.4,17 c-4.9,4.9-10.7,8.8-17.2,11.8C408.3,409,401.2,410.4,393.4,410.4z M376.1,356.6c0,15.6,1.5,27.8,4.5,36.7s7.3,13.3,12.7,13.3 c2.2,0,4.2-0.8,6.2-2.2c2-1.4,3.9-4,5.4-7.6c1.5-3.7,2.8-8.7,3.7-15c0.9-6.3,1.4-14.4,1.4-24.1c0-15.9-1.5-28.2-4.6-36.8 c-3.1-8.7-7.4-12.8-13-12.8c-2.2,0-4.2,0.8-6.2,2.3s-3.7,4.2-5.1,7.9c-1.5,3.7-2.8,8.7-3.7,15C376.6,339.3,376.1,347.1,376.1,356.6 z">
                            </path>
                            <g>
                              <path d="M574.9,287.1c1.9,1.9,4,3.4,6.7,4.5c2.6,1.1,5.3,1.5,7.9,1.5c6,0,11-2,15-6c4-4,6-8.8,6-14.2c0-5.9-2-10.8-6-14.8 c-4-4-9-6-15-6c-2.8,0-5.4,0.5-7.9,1.5c-2.6,1.1-4.8,2.5-6.7,4.5c-1.9,1.9-3.4,4-4.5,6.7s-1.7,5.3-1.7,8.2c0,2.8,0.6,5.3,1.7,7.7 C571.5,283.1,573,285.3,574.9,287.1z">
                              </path>
                              <path d="M612,400.7c-2.8-2.2-4-6-4-11.4v-56.5l0.5-27.7l-1.7-0.6L558,317.8v2.2c1.7-0.2,3.4,0,5.1,0.5s3.2,1.2,4.5,2.3 s2.3,2.6,3.2,4.6c0.9,2,1.2,4.6,1.2,7.7v53.4c0,2.6-0.2,5.4-1.2,7.9c-0.8,1.7-4.2,6.3-7.9,6.3s-6.8-3.6-8-6.3 c-1.1-2.3-1.2-5.4-1.2-7.9c0-0.3,0-56.1,0-56.1c0-9.3-2.5-16.2-7.6-21c-4.9-4.6-11.6-7-19.6-7c-7.3,0-14.1,1.9-20.3,5.4 c-6.2,3.7-11.4,7.9-15.9,12.5v-17.3l-1.7-0.6l-47.8,13.3v2.2c1.7-0.2,3.4,0,5.1,0.5c1.7,0.5,3.2,1.2,4.5,2.3 c1.2,1.1,2.3,2.6,3.2,4.6c0.9,2,1.2,4.6,1.2,7.7v54.3c0,5.4-1.2,9.3-3.7,11.4c-2.5,2.2-5.3,3.4-8.4,3.7v2.2H500v-2 c-2.9-0.3-5.1-1.5-7-3.7c-1.7-2.2-2.6-6-2.6-11.8v-62.2c2.3-2,4.8-3.7,7.3-4.9c2.6-1.2,5.1-2,7.7-2c3.7,0,6.7,1.2,8.8,3.9 c2.2,2.6,3.2,6.5,3.2,11.9v53.4c0,5.7-0.8,9.7-2.3,11.8c-1.5,2.2-4,3.4-7.3,3.7v2H560h3.2h57.1v-2.2 C617.7,404.1,614.8,402.8,612,400.7z">
                              </path>
                            </g>
                            <path d="M255.3,389.4c-3.7,5.3-6.8,6.7-9.7,6.7c-4.2,0-6.2-2.9-6.2-8.7v-49c0-10.4-3.6-18.6-10.8-24.9c-7.3-6.2-18.3-9.4-33.3-9.4 c-14.2,0-24.7,2.3-31.6,6.8c-7,4.5-10.4,10.1-10.4,16.4c0,4.2,1.4,7.6,4,10.1c2.8,2.6,6,3.9,9.9,3.9c3.1,0,6.2-0.9,9.3-2.8 c2.9-1.9,5.3-5.1,7-9.7c0.9-2.8,1.7-5.4,2-7.9c0.3-2.6,0.8-4.8,1.2-6.8c0.5-2,1.2-3.6,2.3-4.8s2.8-1.9,5.3-1.9 c2.9,0,5.3,1.4,6.8,4.3s2.3,8,2.3,15.8v18.9c-11,2.9-20.1,6-27.4,9.1c-7.1,3.1-12.8,6.3-17.2,9.6c-4.2,3.2-7.1,6.8-8.8,10.4 c-1.7,3.6-2.5,7.4-2.5,11.4c0,3.9,0.8,7.3,2.2,10.1c1.2,2.6,3.1,4.8,5.1,6.7c-3.6-0.5-7.3-1.4-8.8-2.9c-2.3-2.5-4-4.9-4-11.8V233 l-1.9-0.5l-30.9,7.9c-5.9-1.5-11.9-2.3-18.3-2.3c-6.3,0-12.7,1.1-19,3.4c-6.3,2.3-12.2,5.9-17.5,10.5c-5.3,4.8-9.6,10.8-12.8,18.3 c-3.4,7.4-5.3,16.2-5.4,26.3v4.5v2.2H20.3v6.3h15.8v78.3c0,5.6-1.1,9.6-3.4,12.2c-2.2,2.6-5.1,4.2-8.7,4.5v1.9h59.9v-1.9 c-3.6-0.3-6.5-1.9-8.7-4.5c-2.2-2.5-3.4-6.5-3.4-12.2c0,0,0-78.1,0-78.3h20.4v-6.3H71.7c0-0.8-0.2-1.5-0.2-2.2l-0.5-4.5 c-0.8-5.4-1.5-10.7-2.5-15.8c-0.9-4.9-1.4-10.2-1.4-15.8c0-6,1.5-11.1,4.5-15.2c2.9-4,7.7-6.2,14.2-6.2c2.9,0,5.7,0.6,8.4,2 c2.5,1.4,4.6,3.2,6.5,5.4c1.9,2.3,3.2,4.9,4.2,7.9c0.9,2.9,1.5,6.2,1.5,9.7v119.7c0,5.4-1.2,9.7-3.6,11.9c-2.3,2.2-4.9,3.4-7.9,3.7 v2h63.7c1.5,0.9,3.2,1.7,4.9,2.3c2.9,0.9,6.2,1.5,9.4,1.5c5.4,0,11-1.2,16.7-3.9c5.7-2.6,10.8-6.2,15.3-10.8c1.5,4.9,4,9,7.7,11.3 c3.6,2.3,7.9,3.4,13.1,3.4c6.5,0,12.2-1.5,17.5-4.6c4.8-2.8,8.2-6,13.5-14.2L255.3,389.4z M193.7,395.3c-3.6,0-6.7-1.4-9.3-4 c-2.6-2.6-3.9-6.8-3.9-12.5c0-2.5,0.3-4.9,0.9-7.6c0.6-2.6,1.7-5.1,3.4-7.6c1.7-2.5,4-4.9,7-7.3s6.8-4.3,11.4-6.2v33.6 c0,2.8,0.2,5.3,0.6,7.7C200.9,394,197.5,395.3,193.7,395.3z">
                            </path>
                          </g>
                        </svg>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/fed-ex-logo.jpg.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/fed-ex-logo.jpg" alt="Fed Ex Logo" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <img class="slider-logo-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Edeka-Logo.wine_.png" alt="Edeka Logo" />
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/logo-premier-inn-testimonial-big.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/05/logo-premier-inn-testimonial-big.png" alt="logo premier inn testimonial" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <img class="slider-logo-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2024/03/70a609691fa249382bb92a4cd970d7ae.png" alt="REWE logo" />
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Cinemaxx_Logo.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Cinemaxx_Logo.png" alt="Cinemaxx Logo" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/NDR_Dachmarke-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/NDR_Dachmarke-1.png" alt="NDR_Dachmarke logo" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <!--?xml version="1.0" encoding="UTF-8"?-->
                        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_2" data-name="Layer 2" viewBox="0 0 448.5 137.17">
                          <defs>
                            <style>
                              .cls-1 { fill: #e30613; } .cls-1, .cls-2 { stroke-width: 0px; } .cls-2 { fill: #005ca9; }
                            </style>
                          </defs>
                          <g id="layer">
                            <g id="Vordergrund">
                              <path class="cls-1" d="m288.5,43.97c1.7-5.1-5.6-6.3-7.7-.8l-5.1,14.3c-3.8,10.1-15.5,5.6-13.9,1l1.4-4.2c-18.3,17.2-22.3,6-22.5,2.4-11.3,14.5-29.2,4.8-16.1-16.4,7.7-12.6,20.4-12.7,21.8-3.3l.9-2.5c1.8-5.1,13.6-5.9,13.4-.7-.1,1.3-.5,3.1-.5,3.1l-3,8.1c-7.3,16.9,6.9,7.7,9.4-.5l3.5-10c1.8-5.1,13.6-5.9,13.4-.7-.1,1.3-.7,3.1-.7,3.1,0,0,8-9.2,16.1-5.9,2.9,1.2,3.5,4.5,2.8,6.7l-2.8,7.3c-7.3,16.9,7.1,7.7,9.6-.5l12.7-36.3c-10.1,6.3-22.5,11.8-34.7,11.7-12.7-.3-22-10-27.5-10.5-9.4-.9-16.1,3.4-15.9-.3.1-2.9,7.7-5.9,17.2-7.6,23.7-4.2,31.2,6.2,48,6.6,5.9.1,16-10.1,27-7.7,7.1,1.6,8.4,8-.3,8.5l-10.4,28.6c25.4-21.1,34.3,14.7,6.4,5.8-2.1,15.7,13.9,14.3,18.2,7.6,4.7-23.7,33.9-24.2,33.9-13,0,10.6-12.3,10.6-17.8,5.9-6,10.6,7.1,13,12.1,11.1,9.3-3.4,5.1,3.9-4.5,7.2-11.5,4.1-21.8,1-22.8-7.5-7.1,7.3-24,17.2-31.3-1.7l-1.7,4.8c-3.8,10.1-15.5,5.6-13.9,1l1.4-4.2c-10.5,11.4-25.4,13.4-20.7,0l4.6-10.5Zm-161.1,6.5c4.7-24.2,33.9-24.2,33.9-13.1s-12.3,10.6-17.8,5.9c-8.1,13.2,18.3,18.5,23.6-1.6l3.7-10.1h-3.3c-1,0-2-.7-2-1.7s.9-1.7,2-1.7h4.5l1.7-4.8c1.7-4.6,4.6-6.2,8.5-6.2,8,.1,6.2,3.9,5.1,6.7l-1.6,4.3h3.4c.9,0,2,.7,2,1.7s-.9,1.7-2,1.7h-4.6l-4.8,13.2c-7.3,16.9,9,7.7,11.7-.5l3.5-10c1.8-5.1,13.6-5.9,13.4-.7-.1,1.3-.7,3.1-.7,3.1,0,0,6.4-8.6,12.1-6.2,5.4,2.4,2.1,9.4-.4,14.3-1.2,2.2-6.3,2.2-7.2,1.4-.5-.5-.5-1.6-.3-2.4,1.7-5.1-4.5-6.3-6.4-.8l-5.1,14.3c-3.8,10.1-15.5,5.6-13.9,1l1.4-4.2c-12.6,11.5-25.4,13.4-25.4,0-11.7,12.4-32.2,12.4-34.2,0-7.3,8.3-29.2,16.5-25.7-.9-26.5,26.2-54.6-2.8-24.8-37,20-22.9,59.4-19.3,53.2-2.2-1.4,4.1-4.2,6.7-9.2,5.9-8.1-1.3-7.9-8.4-4.6-15.3-24.4-4.7-47.4,36.7-27.5,44.6,9.3,3.7,15.6-4.3,18.6-13.9h-7.7c-1.2,0-3.8-.8-3.8-2.6s2-2.6,3.8-2.6h18.2c4.7,0,5.4,1.7,4.3,4.5l-3.8,10.2c-5.1,13.7,4.6,10.6,8.2,5.7Zm26.9-15.8c-3.7,0-5.6,2.5-8.4,5.5,13.9,4.9,13.6-5.5,8.4-5.5Zm84-12.8c0-2.4,2-4.3,4.3-4.3s4.3,2,4.3,4.3-2,4.3-4.3,4.3c-2.4,0-4.3-1.9-4.3-4.3Zm131.9,19.4c1,.3,2.1.4,3.1.4,7.6.3,6.4-6.8,2.2-6.7-3.8.3-5.9,2.9-8.1,5.6,1,.3,1.9.4,2.8.7Zm-119.7-19.4c0-2.4,2-4.3,4.3-4.3s4.3,2,4.3,4.3-2,4.3-4.3,4.3c-2.5,0-4.3-1.9-4.3-4.3Zm-15,28c5.6,2.9,12.4-10.7,6.7-13.6-5.6-2.7-12.4,10.8-6.7,13.6Z">
                              </path>
                              <g>
                                <path class="cls-2" d="m118.5,135.57h18.1c-.9-.5-1.3-9.3-.9-26.3,4.3,0,10,.1,17.2.5v-10.7c-7.2.4-12.8.5-17.2.5,0-5.5.1-10.9.4-16.2,7.6-.1,15.6.3,24,1.2v-11.8h-41.6c1.3,28.2,1.6,31.9,0,62.8Z">
                                </path>
                                <path class="cls-2" d="m83.8,71.37c-15.5,0-27.9,14.7-27.9,32.9s12.4,32.9,27.9,32.9,27.9-14.7,27.9-32.9-12.5-32.9-27.9-32.9Zm9.4,36.7c0,10.2-4.2,18.5-9.4,18.5s-9.4-8.3-9.4-18.5v-7.9c0-10.2,4.2-18.5,9.4-18.5s9.4,8.3,9.4,18.5v7.9Z">
                                </path>
                                <path class="cls-2" d="m31.4,72.87c.5,8.1.8,16.4.9,24.9-4.8.3-9.8.3-15.1,0,.1-8.4.4-16.8.9-24.9H0c1.6,10.9,1.6,31.8,0,62.8h18.1c-.5-9.4-.9-18.7-.9-27.8,5.1-.1,10.1-.1,15.1,0-.1,9-.4,18.3-.9,27.8h18.1c-1.6-30.9-1.6-51.9,0-62.8h-18.1Z">
                                </path>
                                <path class="cls-2" d="m314.7,72.87h-16.6c.8,1.4,1.4,3,2.1,4.5-3,11.8-9.8,31.2-20.3,58.3h13.5c1-3.8,3.7-12.7,3.7-12.7,6-.1,11.9-.1,17.8,0,1,4.2,2.2,8.4,3.3,12.6h18.1c-11.4-30.9-18-54.6-20.2-62.8l-1.4.1h0Zm-14.6,40.1c2.1-6.4,4.2-12.6,6.4-18.9,2,6,3.8,12.4,5.6,18.7-4,.3-7.9.3-12,.2Z">
                                </path>
                                <path class="cls-2" d="m376.8,72.87c.8,11.8,1,24,.9,36.6-11-16.9-19.3-29.1-22.5-36.6h-13.5c1.6,10.9,1.6,31.8,0,62.8h13.5c-.8-12.7-1-25.2-.9-37.3,8,12.1,16,24.5,22.7,37.3h14.3c-1.6-30.9-1.6-51.9,0-62.8h-14.5Z">
                                </path>
                                <path class="cls-2" d="m448.5,72.87h-14.3c.8,11.8,1,24,.9,36.6-11-16.9-19.3-29.1-22.7-36.6h-13.5c1.6,10.9,1.6,31.8,0,62.8h13.5c-.8-12.7-1-25.2-.9-37.3,8,12.1,16,24.5,22.7,37.3h14.3c-1.6-31-1.6-52,0-62.8Z">
                                </path>
                                <path class="cls-2" d="m255.3,72.87c-1.8,7.1-6.2,18.2-12.7,33.5-6.3-15.3-10.5-26.5-12.3-33.5h-20.4c1.6,10.9,1.6,31.8,0,62.8h13.5c-.9-14.9-1.2-29.5-.8-43.5,4.8,11.5,9.3,23.3,13.8,35.4h9.8c4.1-10.9,8.3-21.6,12.7-32,.3,13-.1,26.3-.9,40.2h18.1c-1.6-30.9-1.6-51.9,0-62.8l-20.8-.1h0Z">
                                </path>
                                <path class="cls-2" d="m164.1,135.57h18.1c-.9-.5-1.3-9.3-.9-26.3,4.3,0,10,.1,17.2.5v-10.7c-7.2.4-12.8.5-17.2.5,0-5.5.1-10.9.4-16.2,7.6-.1,15.6.3,24,1.2v-11.8h-41.5c1.1,28.2,1.3,31.9-.1,62.8Z">
                                </path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <img class="slider-logo-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/dussmann-logo.png" alt="Dussmann Logo" />
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <!--?xml version="1.0" encoding="UTF-8"?-->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 507 121.68">
                          <defs>
                            <style>
                              .cls-1{fill:#ff441e;}.cls-2{fill:#0ab2dc;}.cls-3{fill:gray;}
                            </style>
                          </defs>
                          <g id="Layer_2" data-name="Layer 2">
                            <g id="Layer_1-2" data-name="Layer 1">
                              <path id="Icon_awesome-dashcube" data-name="Icon awesome-dashcube" class="cls-1" d="M95,121.68a27.65,27.65,0,0,0,27.19-27.87V25.36c0-15-12-25.36-27.19-25.36H27.23C12,0,0,10.31,0,25.36v96.32Zm-3.31-65V83.51a9.66,9.66,0,0,1-9.54,9.71H40.17a9.75,9.75,0,0,1-9.67-9.71V40.93a9.85,9.85,0,0,1,9.67-9.8v0H81.65a10,10,0,0,1,10,10h15.26Z">
                              </path>
                              <path class="cls-2" d="M178.11,93.44c-.58,4.2-3.26,5.6-6.76,5.6H169.6c-4.31,0-7.45-1.75-7.45-7.93V19.46c0-.47,2.91-1.87,6.29-1.87,4.78,0,10.13,2.57,10.13,13.17v19a21.42,21.42,0,0,1,18.3-9.32c15.38,0,26.21,11.53,26.21,29.71,0,17.71-10.72,30.06-26.33,30.06-8.85,0-15.38-4.54-18.29-10.13Zm14.8-39.84c-7,0-11.89,3.61-14.34,9.32V74C178.81,81.68,185,87,192.79,87c8.74,0,14.56-6.76,14.56-16.78S201.41,53.6,192.91,53.6Z">
                              </path>
                              <path class="cls-2" d="M218,87.39c0-4.2,4.55-6.88,5-6.53,3.85,4.31,10.37,7.69,18.76,7.69,6.41,0,9.91-2.21,9.91-5.83,0-4.42-4.55-5.24-12.12-6.87-7.81-1.63-19.92-4.19-19.92-17,0-11.07,9-18.41,23.65-18.41,11.53,0,18.64,3.15,21.55,7.57a8.35,8.35,0,0,1,1.4,4.66c0,4.32-5,7.23-5.24,6.88a22.58,22.58,0,0,0-16.66-7.69c-6.3,0-9.68,2.33-9.68,5.94,0,4.08,4.43,4.9,12.12,6.64,8,1.75,20.86,4.31,20.86,17.13,0,11.42-9.09,18.29-25,18.29-9,0-15.5-1.74-19.58-4.31C219.76,93.33,218,90.53,218,87.39Z">
                              </path>
                              <path class="cls-2" d="M274.48,54.53h-4.54c-4.78,0-6.88-2.1-6.88-6.06v-1c0-3.73,2.1-5.71,6.88-5.71h4.66v-3c0-15.73,7.8-21.79,19.57-21.79,5.36,0,9.09,1.29,11.42,3a7.33,7.33,0,0,1,3,5.95c0,4-3.26,7-3.5,6.64a11.92,11.92,0,0,0-7.8-3c-4.78,0-7,2.68-7,9.2v3h7.34c4.77,0,6.87,2.1,6.87,6.06v.93c0,3.85-2.1,5.83-6.87,5.83h-6.76v36.7c0,6.06-2.91,7.81-7.22,7.81h-1.75c-4.2,0-7.46-1.87-7.46-7.81Z">
                              </path>
                              <path class="cls-3" d="M351,22.76h4.69a8.83,8.83,0,0,1,4.78,1A3.5,3.5,0,0,1,362,26.87a3.61,3.61,0,0,1-.83,2.44,3.92,3.92,0,0,1-2.4,1.24v.12c2.52.43,3.78,1.76,3.78,4a4.27,4.27,0,0,1-1.5,3.48,6.43,6.43,0,0,1-4.21,1.25H351Zm1.93,7.11h3.18a5.16,5.16,0,0,0,2.94-.64,2.48,2.48,0,0,0,.9-2.16,2.21,2.21,0,0,0-1-2,6.29,6.29,0,0,0-3.18-.62h-2.84Zm0,1.64v6.21h3.46a5,5,0,0,0,3-.77,2.88,2.88,0,0,0,1-2.44,2.58,2.58,0,0,0-1-2.27,5.54,5.54,0,0,0-3.17-.73Z">
                              </path>
                              <path class="cls-3" d="M367,26.92V35a3.26,3.26,0,0,0,.69,2.27,2.83,2.83,0,0,0,2.17.75A3.55,3.55,0,0,0,372.71,37a5.39,5.39,0,0,0,.9-3.49V26.92h1.89V39.37h-1.56l-.27-1.67h-.1A3.88,3.88,0,0,1,372,39.11a5.37,5.37,0,0,1-2.35.49,4.75,4.75,0,0,1-3.4-1.08,4.6,4.6,0,0,1-1.13-3.45V26.92Zm.11-3.37a1.09,1.09,0,0,1,.3-.86,1.08,1.08,0,0,1,.72-.26,1.16,1.16,0,0,1,.75.26,1.32,1.32,0,0,1,0,1.7,1.08,1.08,0,0,1-.75.28,1,1,0,0,1-.72-.28A1.09,1.09,0,0,1,367.1,23.55Zm4.33,0a1.09,1.09,0,0,1,.3-.86,1.08,1.08,0,0,1,.72-.26,1.15,1.15,0,0,1,.74.26,1.32,1.32,0,0,1,0,1.7,1.07,1.07,0,0,1-.74.28,1,1,0,0,1-.72-.28A1.09,1.09,0,0,1,371.43,23.55Z">
                              </path>
                              <path class="cls-3" d="M384.59,26.69a7.4,7.4,0,0,1,1.49.14l-.26,1.75a6,6,0,0,0-1.36-.17,3.35,3.35,0,0,0-2.59,1.22,4.51,4.51,0,0,0-1.07,3.06v6.68h-1.89V26.92h1.56l.22,2.31h.09a5.4,5.4,0,0,1,1.67-1.88A3.73,3.73,0,0,1,384.59,26.69Z">
                              </path>
                              <path class="cls-3" d="M398.58,33.13A6.85,6.85,0,0,1,397,37.89a5.38,5.38,0,0,1-4.23,1.71,5.54,5.54,0,0,1-3-.79,5.17,5.17,0,0,1-2-2.25,7.81,7.81,0,0,1-.7-3.43,6.82,6.82,0,0,1,1.52-4.74,5.38,5.38,0,0,1,4.22-1.7A5.27,5.27,0,0,1,397,28.43,6.88,6.88,0,0,1,398.58,33.13Zm-9.49,0a6,6,0,0,0,1,3.64,3.79,3.79,0,0,0,5.62,0,5.91,5.91,0,0,0,1-3.65,5.76,5.76,0,0,0-1-3.6,3.37,3.37,0,0,0-2.83-1.24,3.33,3.33,0,0,0-2.8,1.22A5.91,5.91,0,0,0,389.09,33.13Z">
                              </path>
                              <path class="cls-3" d="M409.33,36A3.11,3.11,0,0,1,408,38.65a6.09,6.09,0,0,1-3.64,1,7.8,7.8,0,0,1-3.86-.79V37.06a8.73,8.73,0,0,0,1.93.72,8.16,8.16,0,0,0,2,.26,4.55,4.55,0,0,0,2.27-.47,1.56,1.56,0,0,0,.8-1.44,1.54,1.54,0,0,0-.64-1.24,9.81,9.81,0,0,0-2.45-1.22A13.51,13.51,0,0,1,402,32.54a3.32,3.32,0,0,1-1.08-1.1,2.75,2.75,0,0,1-.36-1.46,2.81,2.81,0,0,1,1.23-2.41,5.84,5.84,0,0,1,3.4-.88,9.86,9.86,0,0,1,3.93.82L408.4,29a9.1,9.1,0,0,0-3.39-.77,3.94,3.94,0,0,0-2,.42,1.31,1.31,0,0,0-.68,1.16,1.41,1.41,0,0,0,.26.85,2.4,2.4,0,0,0,.82.67,17.33,17.33,0,0,0,2.18.92,8,8,0,0,1,3,1.63A2.85,2.85,0,0,1,409.33,36Z">
                              </path>
                              <path class="cls-3" d="M417.08,39.6a5.74,5.74,0,0,1-4.36-1.68,6.53,6.53,0,0,1-1.59-4.67,7.24,7.24,0,0,1,1.48-4.79,4.92,4.92,0,0,1,4-1.77,4.71,4.71,0,0,1,3.7,1.54,5.9,5.9,0,0,1,1.37,4.06v1.2h-8.58a4.91,4.91,0,0,0,1.11,3.32,3.81,3.81,0,0,0,3,1.14,10,10,0,0,0,4-.84v1.68a9.24,9.24,0,0,1-1.89.62A10.21,10.21,0,0,1,417.08,39.6Zm-.51-11.33a3.08,3.08,0,0,0-2.39,1,4.49,4.49,0,0,0-1.06,2.7h6.51a4.13,4.13,0,0,0-.79-2.73A2.81,2.81,0,0,0,416.57,28.27Z">
                              </path>
                              <path class="cls-3" d="M430,26.69a7.47,7.47,0,0,1,1.49.14l-.26,1.75a6.06,6.06,0,0,0-1.36-.17,3.35,3.35,0,0,0-2.59,1.22,4.51,4.51,0,0,0-1.07,3.06v6.68h-1.89V26.92h1.56l.21,2.31h.09a5.6,5.6,0,0,1,1.67-1.88A3.76,3.76,0,0,1,430,26.69Z">
                              </path>
                              <path class="cls-3" d="M435.93,39.37l-4.72-12.45h2l2.68,7.38A34.89,34.89,0,0,1,437,37.67h.09a25.33,25.33,0,0,1,.79-2.5c.44-1.26,1.44-4,3-8.25h2l-4.72,12.45Z">
                              </path>
                              <path class="cls-3" d="M444.12,23.55a1.25,1.25,0,0,1,.32-.95,1.19,1.19,0,0,1,1.58,0,1.25,1.25,0,0,1,.33.95,1.22,1.22,0,0,1-.33.94,1.14,1.14,0,0,1-1.58,0A1.26,1.26,0,0,1,444.12,23.55Zm2.05,15.82h-1.89V26.92h1.89Z">
                              </path>
                              <path class="cls-3" d="M454.56,39.6a5.33,5.33,0,0,1-4.19-1.67,6.89,6.89,0,0,1-1.48-4.71,7,7,0,0,1,1.51-4.82,5.4,5.4,0,0,1,4.29-1.71,8.47,8.47,0,0,1,1.79.2,5.71,5.71,0,0,1,1.41.45l-.58,1.6a9.88,9.88,0,0,0-1.36-.41,6.19,6.19,0,0,0-1.31-.17c-2.53,0-3.79,1.62-3.79,4.84a5.72,5.72,0,0,0,.92,3.52A3.22,3.22,0,0,0,454.52,38a8.34,8.34,0,0,0,3.19-.67V39A6.84,6.84,0,0,1,454.56,39.6Z">
                              </path>
                              <path class="cls-3" d="M465.34,39.6A5.74,5.74,0,0,1,461,37.92a6.53,6.53,0,0,1-1.59-4.67,7.24,7.24,0,0,1,1.48-4.79,4.93,4.93,0,0,1,4-1.77,4.7,4.7,0,0,1,3.7,1.54,5.9,5.9,0,0,1,1.37,4.06v1.2h-8.58a4.91,4.91,0,0,0,1.11,3.32,3.83,3.83,0,0,0,3,1.14,10,10,0,0,0,4-.84v1.68a9.24,9.24,0,0,1-1.89.62A10.21,10.21,0,0,1,465.34,39.6Zm-.51-11.33a3.08,3.08,0,0,0-2.39,1,4.42,4.42,0,0,0-1.05,2.7h6.51a4.13,4.13,0,0,0-.8-2.73A2.81,2.81,0,0,0,464.83,28.27Z">
                              </path>
                              <path class="cls-3" d="M477.3,35.07a4.46,4.46,0,0,1,.79-2.62,8.43,8.43,0,0,1,2.83-2.29,13.92,13.92,0,0,1-1.31-1.64,5.85,5.85,0,0,1-.55-1.16,3.77,3.77,0,0,1-.21-1.25A3.31,3.31,0,0,1,480,23.45a4.63,4.63,0,0,1,3.1-.95,4.2,4.2,0,0,1,2.9.95,3.37,3.37,0,0,1,1,2.64,3.6,3.6,0,0,1-.77,2.24,8.87,8.87,0,0,1-2.56,2.09l4.63,4.44a5.5,5.5,0,0,0,1-1.65,14.12,14.12,0,0,0,.65-2.08h1.9a10.85,10.85,0,0,1-2.32,4.93L493,39.37h-2.6l-2.1-2a8.73,8.73,0,0,1-2.73,1.73,8.86,8.86,0,0,1-3.09.52,5.46,5.46,0,0,1-3.79-1.21A4.24,4.24,0,0,1,477.3,35.07Zm5.18,2.84A6.29,6.29,0,0,0,487,36.16l-5-4.82a10.13,10.13,0,0,0-1.78,1.28,3.41,3.41,0,0,0-.78,1.08,3.45,3.45,0,0,0-.25,1.32,2.66,2.66,0,0,0,.88,2.11A3.42,3.42,0,0,0,482.48,37.91Zm-1.76-11.84a2.86,2.86,0,0,0,.41,1.49,9.45,9.45,0,0,0,1.39,1.71,7.38,7.38,0,0,0,2-1.57,2.57,2.57,0,0,0,.58-1.67,1.86,1.86,0,0,0-.59-1.42,2.17,2.17,0,0,0-1.56-.55,2.44,2.44,0,0,0-1.64.54A1.85,1.85,0,0,0,480.72,26.07Z">
                              </path>
                              <path class="cls-3" d="M352.94,67.29H351V50.68h9.25V52.4h-7.32v6.07h6.88v1.72h-6.88Z">
                              </path>
                              <path class="cls-3" d="M369.8,67.29l-.37-1.77h-.09a5.13,5.13,0,0,1-1.86,1.58,5.58,5.58,0,0,1-2.31.42,4.14,4.14,0,0,1-2.9-1,3.47,3.47,0,0,1-1-2.71c0-2.52,2-3.83,6-4l2.11-.06v-.78a3.17,3.17,0,0,0-.63-2.16,2.58,2.58,0,0,0-2-.7,8.2,8.2,0,0,0-3.52,1l-.58-1.45a9.21,9.21,0,0,1,2-.78,8.69,8.69,0,0,1,2.2-.29,4.75,4.75,0,0,1,3.3,1,4.12,4.12,0,0,1,1.07,3.17v8.5ZM365.54,66a3.84,3.84,0,0,0,2.77-1,3.6,3.6,0,0,0,1-2.71V61.17l-1.89.08a6.71,6.71,0,0,0-3.24.7,2.11,2.11,0,0,0-1,1.92,2,2,0,0,0,.62,1.56A2.59,2.59,0,0,0,365.54,66Z">
                              </path>
                              <path class="cls-3" d="M379.48,67.52a5.31,5.31,0,0,1-4.18-1.67,6.84,6.84,0,0,1-1.49-4.71,7,7,0,0,1,1.51-4.82,5.4,5.4,0,0,1,4.29-1.71,8.47,8.47,0,0,1,1.79.2,5.71,5.71,0,0,1,1.41.45l-.58,1.6a8.36,8.36,0,0,0-1.36-.41,6.12,6.12,0,0,0-1.31-.17c-2.53,0-3.79,1.62-3.79,4.84a5.79,5.79,0,0,0,.92,3.52,3.22,3.22,0,0,0,2.75,1.23,8.34,8.34,0,0,0,3.19-.67v1.67A6.81,6.81,0,0,1,379.48,67.52Z">
                              </path>
                              <path class="cls-3" d="M393.52,67.29V59.24a3.27,3.27,0,0,0-.69-2.28,2.83,2.83,0,0,0-2.17-.75,3.56,3.56,0,0,0-2.87,1.07,5.42,5.42,0,0,0-.9,3.5v6.51H385V49.61h1.89V55a11.9,11.9,0,0,1-.09,1.61h.11a3.9,3.9,0,0,1,1.58-1.42,5.24,5.24,0,0,1,2.35-.52,4.85,4.85,0,0,1,3.43,1.09,4.57,4.57,0,0,1,1.14,3.45v8.12Z">
                              </path>
                              <path class="cls-3" d="M406.73,63.89a3.11,3.11,0,0,1-1.29,2.68,6.11,6.11,0,0,1-3.64,1,7.8,7.8,0,0,1-3.86-.79V65a8.73,8.73,0,0,0,1.93.72,8.16,8.16,0,0,0,2,.26,4.55,4.55,0,0,0,2.27-.47,1.63,1.63,0,0,0,.16-2.68,9.74,9.74,0,0,0-2.46-1.22,13.68,13.68,0,0,1-2.47-1.13,3.45,3.45,0,0,1-1.09-1.1,2.85,2.85,0,0,1-.36-1.46,2.82,2.82,0,0,1,1.24-2.41,5.84,5.84,0,0,1,3.4-.88,9.86,9.86,0,0,1,3.93.82L405.8,57a9.11,9.11,0,0,0-3.4-.77,3.92,3.92,0,0,0-2,.42,1.31,1.31,0,0,0-.68,1.16,1.47,1.47,0,0,0,.25.85,2.45,2.45,0,0,0,.83.67,16.67,16.67,0,0,0,2.18.92,8,8,0,0,1,3,1.63A2.85,2.85,0,0,1,406.73,63.89Z">
                              </path>
                              <path class="cls-3" d="M414.48,67.52a5.74,5.74,0,0,1-4.36-1.68,6.53,6.53,0,0,1-1.59-4.67A7.24,7.24,0,0,1,410,56.38a4.92,4.92,0,0,1,4-1.77,4.71,4.71,0,0,1,3.7,1.54,5.9,5.9,0,0,1,1.37,4.06v1.2h-8.58a4.91,4.91,0,0,0,1.11,3.32,3.81,3.81,0,0,0,3,1.14,10,10,0,0,0,4-.84v1.68a9.45,9.45,0,0,1-1.89.62A10.21,10.21,0,0,1,414.48,67.52ZM414,56.19a3.11,3.11,0,0,0-2.4,1,4.54,4.54,0,0,0-1.05,2.7H417a4.13,4.13,0,0,0-.79-2.73A2.81,2.81,0,0,0,414,56.19Z">
                              </path>
                              <path class="cls-3" d="M423.55,60.92A22.79,22.79,0,0,1,425,59.1l4-4.26h2.24l-5,5.3,5.39,7.15h-2.28L425,61.41l-1.42,1.22v4.66h-1.86V49.61h1.86V59c0,.41,0,1.06-.09,1.93Z">
                              </path>
                              <path class="cls-3" d="M439,54.61a7.47,7.47,0,0,1,1.49.14l-.26,1.75a6.06,6.06,0,0,0-1.36-.17,3.35,3.35,0,0,0-2.59,1.22,4.46,4.46,0,0,0-1.07,3.06v6.68h-1.89V54.84h1.56l.21,2.31h.09a5.5,5.5,0,0,1,1.67-1.88A3.76,3.76,0,0,1,439,54.61Z">
                              </path>
                              <path class="cls-3" d="M447.5,67.52a5.72,5.72,0,0,1-4.36-1.68,6.53,6.53,0,0,1-1.6-4.67A7.24,7.24,0,0,1,443,56.38a4.91,4.91,0,0,1,4-1.77,4.71,4.71,0,0,1,3.7,1.54,5.9,5.9,0,0,1,1.36,4.06v1.2H443.5a4.86,4.86,0,0,0,1.11,3.32,3.79,3.79,0,0,0,2.95,1.14,10.05,10.05,0,0,0,4-.84v1.68a9.66,9.66,0,0,1-1.89.62A10.27,10.27,0,0,1,447.5,67.52ZM447,56.19a3.09,3.09,0,0,0-2.39,1,4.54,4.54,0,0,0-1,2.7h6.51a4.13,4.13,0,0,0-.79-2.73A2.82,2.82,0,0,0,447,56.19Z">
                              </path>
                              <path class="cls-3" d="M458.73,66a6.24,6.24,0,0,0,1-.07,4.88,4.88,0,0,0,.73-.16v1.45a3.15,3.15,0,0,1-.9.24,6.17,6.17,0,0,1-1.07.1q-3.61,0-3.62-3.81V56.3h-1.78v-.9l1.78-.79.8-2.66h1.09v2.89h3.61V56.3h-3.61v7.33a2.56,2.56,0,0,0,.53,1.73A1.88,1.88,0,0,0,458.73,66Z">
                              </path>
                              <path class="cls-3" d="M470,67.29l-.38-1.77h-.09a5.13,5.13,0,0,1-1.86,1.58,5.55,5.55,0,0,1-2.31.42,4.14,4.14,0,0,1-2.9-1,3.47,3.47,0,0,1-1-2.71c0-2.52,2-3.83,6-4l2.11-.06v-.78a3.17,3.17,0,0,0-.63-2.16,2.57,2.57,0,0,0-2-.7,8.16,8.16,0,0,0-3.52,1l-.58-1.45a8.94,8.94,0,0,1,2-.78,8.75,8.75,0,0,1,2.2-.29,4.72,4.72,0,0,1,3.3,1,4.12,4.12,0,0,1,1.07,3.17v8.5ZM465.74,66a3.83,3.83,0,0,0,2.76-1,3.6,3.6,0,0,0,1-2.71V61.17l-1.89.08a6.71,6.71,0,0,0-3.24.7,2.1,2.1,0,0,0-1,1.92,1.94,1.94,0,0,0,.62,1.56A2.59,2.59,0,0,0,465.74,66Z">
                              </path>
                              <path class="cls-3" d="M480.38,54.61a7.47,7.47,0,0,1,1.49.14l-.26,1.75a6.08,6.08,0,0,0-1.37-.17,3.32,3.32,0,0,0-2.58,1.22,4.47,4.47,0,0,0-1.08,3.06v6.68H474.7V54.84h1.55l.22,2.31h.09a5.5,5.5,0,0,1,1.67-1.88A3.76,3.76,0,0,1,480.38,54.61Z">
                              </path>
                              <path class="cls-3" d="M483.45,51.46a1.24,1.24,0,0,1,.32-.94,1.19,1.19,0,0,1,1.58,0,1.52,1.52,0,0,1,0,1.89,1.14,1.14,0,0,1-1.58,0A1.27,1.27,0,0,1,483.45,51.46Zm2.05,15.83h-1.89V54.84h1.89Z">
                              </path>
                              <path class="cls-3" d="M496.57,67.29l-.37-1.77h-.09a5.13,5.13,0,0,1-1.86,1.58,5.61,5.61,0,0,1-2.31.42,4.13,4.13,0,0,1-2.9-1A3.47,3.47,0,0,1,488,63.85c0-2.52,2-3.83,6-4l2.11-.06v-.78a3.17,3.17,0,0,0-.63-2.16,2.58,2.58,0,0,0-2-.7,8.2,8.2,0,0,0-3.52,1l-.58-1.45a9.21,9.21,0,0,1,2-.78,8.69,8.69,0,0,1,2.2-.29,4.75,4.75,0,0,1,3.3,1A4.12,4.12,0,0,1,498,58.79v8.5ZM492.31,66a3.84,3.84,0,0,0,2.77-1,3.6,3.6,0,0,0,1-2.71V61.17l-1.89.08A6.71,6.71,0,0,0,491,62a2.09,2.09,0,0,0-1,1.92,2,2,0,0,0,.62,1.56A2.59,2.59,0,0,0,492.31,66Z">
                              </path>
                              <path class="cls-3" d="M505.3,66a6,6,0,0,0,1-.07,5.06,5.06,0,0,0,.74-.16v1.45a3.15,3.15,0,0,1-.9.24,6.28,6.28,0,0,1-1.08.1c-2.4,0-3.61-1.27-3.61-3.81V56.3h-1.78v-.9l1.78-.79.8-2.66h1.09v2.89h3.61V56.3H503.3v7.33a2.51,2.51,0,0,0,.53,1.73A1.88,1.88,0,0,0,505.3,66Z">
                              </path>
                              <path class="cls-3" d="M358.31,86.51H364v8.08a17.68,17.68,0,0,1-2.68.63,19.73,19.73,0,0,1-3.16.22,7.65,7.65,0,0,1-5.88-2.25,8.83,8.83,0,0,1-2.1-6.28,9.54,9.54,0,0,1,1-4.54,7,7,0,0,1,3-3,9.72,9.72,0,0,1,4.57-1,12.54,12.54,0,0,1,5,1L363,81a11.16,11.16,0,0,0-4.33-1,6.19,6.19,0,0,0-4.74,1.81,7,7,0,0,0-1.7,5,7.14,7.14,0,0,0,1.64,5.1,6.31,6.31,0,0,0,4.82,1.74,14.67,14.67,0,0,0,3.38-.4V88.24h-3.72Z">
                              </path>
                              <path class="cls-3" d="M383,95.21v-8.1a3.32,3.32,0,0,0-.64-2.23,2.44,2.44,0,0,0-2-.75,3.15,3.15,0,0,0-2.6,1,4.79,4.79,0,0,0-.85,3.11v6.95H375v-8.1a3.32,3.32,0,0,0-.64-2.23,2.45,2.45,0,0,0-2-.75,3.07,3.07,0,0,0-2.59,1.07,5.72,5.72,0,0,0-.83,3.48v6.53h-1.88V82.76h1.53l.31,1.7H369A3.76,3.76,0,0,1,370.52,83a4.57,4.57,0,0,1,2.17-.51c1.95,0,3.22.71,3.82,2.12h.09a4,4,0,0,1,1.61-1.55,5,5,0,0,1,2.41-.57,4.22,4.22,0,0,1,3.17,1.09,4.85,4.85,0,0,1,1,3.47v8.12Z">
                              </path>
                              <path class="cls-3" d="M393.93,82.56a4.6,4.6,0,0,1,3.81,1.67A7.33,7.33,0,0,1,399.1,89a7.36,7.36,0,0,1-1.37,4.77,4.61,4.61,0,0,1-3.8,1.7,5.37,5.37,0,0,1-2.22-.45A4.14,4.14,0,0,1,390,93.61h-.14l-.4,1.6h-1.35V77.53H390v4.3c0,1,0,1.82-.09,2.59H390A4.46,4.46,0,0,1,393.93,82.56Zm-.27,1.57a3.28,3.28,0,0,0-2.78,1.11A6.23,6.23,0,0,0,390,89a6.27,6.27,0,0,0,.87,3.76,3.34,3.34,0,0,0,2.81,1.13,2.9,2.9,0,0,0,2.59-1.27,6.49,6.49,0,0,0,.85-3.64,6.22,6.22,0,0,0-.85-3.62A3,3,0,0,0,393.66,84.13Z">
                              </path>
                              <path class="cls-3" d="M414.71,95.21h-1.93V87.39H404v7.82H402.1V78.6H404v7.07h8.75V78.6h1.93Z">
                              </path>
                              <rect class="cls-3" x="328.25" y="16.89" width="1" height="83.31">
                              </rect>
                            </g>
                          </g>
                        </svg>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/logo-1.png.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/logo-1.png" alt="buchpartner logo" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <picture class="slider-logo-image lazyload">
                          <source type="image/webp" srcset="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/catering-kluhcatering.jpg.webp" />
                          <img src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/catering-kluhcatering.jpg" alt="logo-klueh-catering-customer" />
                        </picture>
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 100">
                        <img class="slider-logo-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/tier-logo.png" alt="TIER Logo" />
                      </figure>
                    </div>
                    <div class="swiper-slide slider-item">
                      <figure class="slider-logo" style="--slider-logos-size: 50">
                        <img class="slider-logo-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/2022/06/Tesla-Logo.png" alt="Tesla Logo" />
                      </figure>
                    </div>
                  </div>
                </div>
                <div class="slider-pagination">
                  <button type="button" data-slider-button="prev" class="slider-button slider-button--prev">
                    <svg xmlns="http://www.w3.org/2000/svg" space="preserve" viewBox="0 0 324.8 179.1">
                      <path d="M161.7 0c-5.5.1-10.8 2.3-14.9 6.1L6.8 140.5C1 146.1-1.3 154.3.6 162.1c1.9 7.8 7.9 13.9 15.6 16.2 7.7 2.2 16 .2 21.8-5.3L162.4 53.4l124.4 119.5c5.8 5.5 14.1 7.6 21.8 5.3 7.7-2.2 13.6-8.4 15.6-16.2 1.9-7.8-.4-16-6.2-21.6L178 6.1C173.6 2 167.8-.2 161.7 0z">
                      </path>
                    </svg>
                  </button>
                  <button type="button" data-slider-button="next" class="slider-button slider-button--next">
                    <svg xmlns="http://www.w3.org/2000/svg" space="preserve" viewBox="0 0 324.8 179.1">
                      <path d="M161.7 0c-5.5.1-10.8 2.3-14.9 6.1L6.8 140.5C1 146.1-1.3 154.3.6 162.1c1.9 7.8 7.9 13.9 15.6 16.2 7.7 2.2 16 .2 21.8-5.3L162.4 53.4l124.4 119.5c5.8 5.5 14.1 7.6 21.8 5.3 7.7-2.2 13.6-8.4 15.6-16.2 1.9-7.8-.4-16-6.2-21.6L178 6.1C173.6 2 167.8-.2 161.7 0z">
                      </path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing " is="flynt-block-text-image-alt">
          <div class="container centerMaxWidthContainer">
            <div class="box box--imageLeft box--mobileImageTop">
              <div class="box-inner box-inner--content">
                <h3>
                  Praktische Nebenjobs für Studierende – du willst arbeiten, wir machen’s möglich
                </h3>
                <p>
                  <strong>                  Ein guter Studentenjob ist die halbe Miete. Oder auch die ganze.
</strong>
                </p>
                <p>
                  Mit der Zenjob App findest du praktische Studentenjobs, die in deinen Alltag passen – ob Tagesjob, Wochenendschicht oder Werkstudierendenstelle. Einfach App öffnen, Schichten wählen und jobben. Für alle, die nicht nur arbeiten müssen – sondern wollen.
                </p>
              </div>
              <div class="box-inner box-inner--image">
                <figure class="figure">
                  <img class="figure-image lazyload" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMzc1JyBoZWlnaHQ9JzIxMScgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-640x0-c-default.jpg" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-375x0-c-default.jpg 375w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-480x0-c-default.jpg 480w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-640x0-c-default.jpg 640w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-768x0-c-default.jpg 768w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-960x0-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2025/07/graphics-microsoft-branded-background-with-smiling-young-woman-1920x1080-1-1-1170x0-c-default.jpg 1170w" data-sizes="auto" loading="lazy" width="1920" height="1080" alt="graphics-microsoft-branded-background-with-smiling-young-woman" />
                </figure>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing " is="flynt-block-map">
          <div class="container centerMaxWidthContainer">
            <div class="box box--mapRight">
              <div class="box-inner box-inner--content">
                <h3 class="h2 centered">
                  Gute Arbeit. In über 40 Städten.
                </h3>
                <p class="text-dark" style="text-align: left">
                  Zenjob verbindet Studierende und Unternehmen in ganz Deutschland – für Jobs und Einsätze, die auf beiden Seiten funktionieren.
                </p>
              </div>
              <div class="box-inner box-inner--map">
                <div class="map_wrapper" id="map_wrapper_14758">
                  <div class="map_box" style="max-width:2000px">
                    <div class="map_aspect_ratio" style="padding-top:100%">
                      <div class="map_container">
                        <div class="map_render map_loading" id="map_14758">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing themeGreyLight" is="flynt-block-accordion">
          <div class="container centerMaxWidthContainer">
            <div class="preContent">
              <h2 style="text-align: center">
                FAQ: Häufig gestellte Fragen zu Zenjob
              </h2>
            </div>
            <div class="content">
              <ul class="accordion themeDefault">
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-1">
                    <span class="panel-trigger--title">                    Was ist Zenjob?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-1">
                    <div class="panel-inner">
                      <p>
                        Zenjob ist ein Personaldienstleister für Nebenjobs, der Unternehmen mit studentischen Aushilfen verbindet. Unternehmen bieten wir eine Online-Buchungsplattform, auf der sie mit wenigen Klicks Aushilfen auf Tagesbasis anfordern können, um ihre Kernbelegschaft bei Bedarf mit zusätzlichem Personal zu ergänzen. Studierenden bieten wir eine mobile App, auf der sie die entsprechenden Tagesjobs unserer Unternehmen sehen können, für die sie geeignet sind. Mit nur wenigen Klicks können sich unsere Zenjobber auf die Jobs bewerben, die am besten in ihren Alltag passen, um so neben ihrem Studium Geld zu verdienen, wie es ihnen am besten passt.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-2">
                    <span class="panel-trigger--title">                    Wie funktioniert Zenjob?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-2">
                    <div class="panel-inner">
                      <p>
                        Unternehmen geben ihren Personalbedarf in ihrer Online-Buchungsplattform an. Geeignete Zenjobber sehen die entsprechenden Tagesjobs in ihrer mobilen App und bewerben sich proaktiv auf diejenigen, die ihnen am besten in den Studienalltag passen. Unsere KI-gestützte Software wählt die am besten passende Person aus und schickt ihr einen digitalen Arbeitsvertrag für den gebuchten Job, den sie direkt auf dem Handy unterschreibt. Unsere studentischen Aushilfen arbeiten bei unseren Unternehmen im Rahmen einer kurzfristigen Beschäftigung. Wir überlassen sie für die Dauer ihrer gebuchten Schichten bei den jeweiligen Unternehmen, wo sie ihre tatsächliche Arbeit verrichten. Zenjob übernimmt die gesamte Personalverwaltung für unsere Zenjobber. So funktioniert Zenjob für Unternehmen und so funktioniert es für Studierende.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-3">
                    <span class="panel-trigger--title">                    Wer kann bei Zenjob arbeiten?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-3">
                    <div class="panel-inner">
                      <p>
                        Bei Zenjob können sich nur Personen anmelden, die mindestens 18 Jahre alt und in Vollzeit an einer staatlich anerkannten Hochschule eingeschrieben sind. Für die Anmeldung brauchen sie einen gültigen Personalausweis oder Reisepass, ggfs. einen gültigen Aufenthaltstitel und Arbeitserlaubnis in Deutschland, eine gültige Immatrikulationsbescheinigung, eine deutsche oder europäische Krankenversicherung, eine deutsche Steuer- und Sozialversicherungsnummer und einen Wohnsitz in Deutschland. Außerdem müssen sie für fast jeden Job über gute Deutschkenntnisse verfügen, nur in wenigen Fällen genügen Englischkenntnisse.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-4">
                    <span class="panel-trigger--title">                    Welche Jobs gibt es bei Zenjob?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-4">
                    <div class="panel-inner">
                      <p>
                        Zenjob bietet in erster Linie Tagesjobs für Student*innen im Rahmen einer kurzfristigen Beschäftigung an. Darüber hinaus gibt es auch Werkstudentenjobs, bei denen Studierende mehrere Monate lang bei einem Unternehmen arbeiten. Bei Zenjob gibt es Jobs als Kassierer*in, Lagerhelfer*in, Verkäufer*in, Warenverräumer*in, Fahrer*in, Küchenhilfe, Baraushilfe, Kellner*in und vieles mehr.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-5">
                    <span class="panel-trigger--title">                    In welchen Branchen ist Zenjob tätig?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-5">
                    <div class="panel-inner">
                      <p>
                        Wir helfen Unternehmen dabei, Schichten in verschiedenen Branchen schnell zu besetzen, darunter Einzelhandel, Lebensmittelhandel, Logistik, E-Commerce, Hotellerie, Gastronomie, Event und weiteren Dienstleistungen.
                      </p>
                    </div>
                  </div>
                </li>
                <li class="panel">
                  <button class="panel-trigger" type="button" aria-expanded="false" aria-controls="content-6">
                    <span class="panel-trigger--title">                    Wo kann man Zenjob nutzen?
</span>
                    <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                      </path>
                    </svg>
                  </button>
                  <div class="panel-content  --isHidden" id="content-6">
                    <div class="panel-inner">
                      <p>
                        Zenjob verbindet Studierende und Unternehmen in ganz Deutschland. Wir sind in über 40 deutschen Städten als Personaldienstleister aktiv. Falls eine Stadt noch nicht dabei sein sollte, können Unternehmen diese anfragen.
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="postContent">
              <h3 style="text-align: center">
                Links zu häufig gestellten Fragen
              </h3>
              <p style="text-align: center">
                <strong>                <a href="https://www.zenjob.com/de/jobs/tagesjobs/">                Tagesjobs
</a>
                •
                <a href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                Werkstudentenjobs
</a>
                •
                <a href="https://www.zenjob.com/de/personal/hotellerie/">                Hospitality
</a>
                •
                <a href="https://www.zenjob.com/de/personal/einzelhandel/">                Einzelhandel
</a>
                •
                <a href="https://www.zenjob.com/de/personal/logistik/">                Logistik
</a>
                •
                <a href="https://www.zenjob.com/de/personal/e-commerce/">                E-Commerce
</a>
                •
                <a href="https://www.zenjob.com/de/personal/events/">                Event
</a>
</strong>
              </p>
            </div>
          </div>
        </div>
        <div class="flyntComponent componentSpacing " is="flynt-grid-posts">
          <script type="application/json">
            {&#34;options&#34;:{&#34;a11y&#34;:{&#34;nextSlideMessage&#34;:&#34;Next Slide&#34;,&#34;prevSlideMessage&#34;:&#34;Previous Slide&#34;,&#34;firstSlideMessage&#34;:&#34;This is the first slide&#34;,&#34;lastSlideMessage&#34;:&#34;This is the last slide&#34;,&#34;paginationBulletMessage&#34;:&#34;Go to slide {{index}}&#34;}}}
          </script>
          <div class="container centerMaxWidthContainer">
            <div class="preContent">
              <h3 class="h2 centered" style="text-align: center">
                Genieße das Leben ohne Extra-Stress
              </h3>
              <p style="text-align: center">
                Im Zenjob Blog zeigen wir dir, wie du das Leben in vollen Zügen genießen kannst, ohne deinem Arbeits- und Studienalltag Stress hinzuzufügen.
              </p>
            </div>
            <div class="slider swiper-container" data-slider="">
              <div class="grid swiper-wrapper">
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2023/09/unseen-studio-s9CC2SKySJM-unsplash-376x188-c-default.jpg 376w" data-sizes="auto" alt="Wo finde ich meine Immatrikulationsbescheinigung? – Ein Guide für Studierende" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                        Wo finde ich meine Immatrikulationsbescheinigung? – Ein Guide für Studierende
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/immatrikulationsbescheinigung/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2020/10/student-ueberpruefung-ihrer-sozialversicherungsnummer-zufrieden-376x188-c-default.jpg 376w" data-sizes="auto" alt="Wo finde ich eigentlich meine Sozialversicherungsnummer?" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                        Wo finde ich eigentlich meine Sozialversicherungsnummer?
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/steuer-id/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/steuerid-376x188-c-default.jpg 376w" data-sizes="auto" alt="Steuer-ID: Was ist das und wo finde ich sie?" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/steuer-id/">                        Steuer-ID: Was ist das und wo finde ich sie?
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/steuer-id/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/beste-nebenjobs/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/iStock-1210182374_Easy-Resize.com_-376x188-c-default.jpg 376w" data-sizes="auto" alt="Das sind die beliebtesten Nebenjobs neben Studium und Beruf" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/beste-nebenjobs/">                        Das sind die beliebtesten Nebenjobs neben Studium und Beruf
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/beste-nebenjobs/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/verdienst/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2022/06/verdienst-nebenjob_Easy-Resize.com_-376x188-c-default.jpg 376w" data-sizes="auto" alt="Hoher Verdienst: Das sind die bestbezahlten Nebenjobs in Deutschland" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/verdienst/">                        Hoher Verdienst: Das sind die bestbezahlten Nebenjobs in Deutschland
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/verdienst/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
                <div class="grid-item swiper-slide">
                  <article class="post">
                    <a class="post-link" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                    <figure class="figure">
                      <img class="post-image figure-image lazyload" src="https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-876x438-c-default.jpg" srcset="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nODc2JyBoZWlnaHQ9JzQzOCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48L3N2Zz4=" data-srcset="
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-1050x525-c-default.jpg 1050w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-960x480-c-default.jpg 960w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-752x376-c-default.jpg 752w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-600x300-c-default.jpg 600w,
                https://www.zenjob.com/de/wp-content/uploads/sites/2/resized/2024/10/Hero-Pic-min-1-376x188-c-default.jpg 376w" data-sizes="auto" alt="Krankmeldung schreiben mit Vorlage: So geht es richtig" />
                    </figure>
</a>
                    <div class="post-inner">
                      <h3 class="post-title h6">
                        <a href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                        Krankmeldung schreiben mit Vorlage: So geht es richtig
</a>
                      </h3>
                      <p class="post-excerpt">
                      </p>
                      <a class="button post-readMore" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                      Lies mehr
</a>
                    </div>
                  </article>
                </div>
              </div>
              <div class="pagination" data-slider-dots="">
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer class="mainFooter">
        <div class="flyntComponent themeGreyLight" is="flynt-navigation-footer">
          <div class="container centerMaxWidthContainer container-navigation">
            <nav class="navigation" aria-label="Footer">
              <div class="nav-desktop">
                <div class="menu menu-main">
                  <div class="first-level-container">
                    <button class="title">
                      <p class="h4 menu-title">
                        Jobsuchende
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/">                        Für Jobsuchende
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/teilnahmebedingungen-loyalty-programm/">                        Teilnahmebedingungen für GoodWork Perks
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://talent.zenjob.com/signup-form?_ga=2.123742344.306586205.1661758583-311121729.1656426051" target="_blank">                        Anmeldeformular
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/datenschutz-talents/">                        Datenschutz Zenjobber
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/">                        Blog
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobboerse">                        Jobbörse
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/ferienjobs/">                        Ferienjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/minijobs/">                        Minijobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/nebenjobs/">                        Nebenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/studentenjobs/">                        Studentenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                        Werkstudentenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/">                        Zenjobber Trainings
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/erster-job/">                        Erster Job
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/onboarding-zenjob-app/">                        Onboarding Zenjob App
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/zenjob-voraussetzungen/">                        Zenjob Voraussetzungen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/service/">                        Service-Training
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/service/dresscode/">                        Dresscode für Servicejobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/gastro-gesundheitszeugnis/">                        Gastro-Training / Gesundheitszeugnis
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/vorbereitung-sicherheitsequipment/">                        Sicherheitsequipment
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/fuehrungszeugnis-beantragen/">                        Führungszeugnis Guide
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/anstellungsverhaeltnis/">                        Anstellungsverhältnis
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/region/">                        Jobs in deiner Nähe
</a>
                      </div>
                    </div>
                  </div>
                  <div class="first-level-container">
                    <button class="title">
                      <p class="h4 menu-title">
                        Unternehmen
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/">                        Für Unternehmen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/">                        Wie funktioniert es
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/ressourcen/">                        Ressourcen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/">                        Arbeitgebermagazin
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/buchungsplattform/">                        Zenjob Buchungsplattform
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/buchungsplattform/integrationen/">                        PDL und SAAS Partnerprogramm
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/">                        Übersicht Erfolgsgeschichten
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/rewe-maerkte/">                        REWE-Märkte
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/edeka-breidohrs/">                        Edeka-Breidohr&#39;s
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/deiters/">                        Deiters
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/spicebar/">                        Spicebar
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/branchen/">                        Branchen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/call-center/">                        Call Center
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/e-commerce/">                        E-Commerce
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/einzelhandel/">                        Einzelhandel
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/events/">                        Eventbranche
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/hotellerie/">                        Hotellerie &amp; Gastronomie
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/lebensmittel/">                        Lebensmittel
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/logistik/">                        Logistik
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/gebaeudedienstleistungen/">                        Grün- und Graupflege
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/region/">                        Personal in Ihrer Region
</a>
                      </div>
                    </div>
                  </div>
                  <div class="first-level-container">
                    <button class="title">
                      <p class="h4 menu-title">
                        Neueste Beiträge
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/arbeitsmarktprognosen-q2/">                        Arbeitsmarktprognosen Q2/2025
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                        Sozialversicherungsnummer
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/11-uni-essentials/">                        Deine perfekten 11 Uni Essentials
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/generation-z-bei-der-arbeit/">                        Gen Z  Studie 2024
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/steuer-id/">                        Steuer-ID
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/beste-nebenjobs/">                        Unsere beliebtesten Jobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                        Krankmeldung mit Vorlage schreiben
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/verdienst/">                        Unsere bestbezahlten Jobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/semesterferien-arbeiten/">                        In den Semesterferien arbeiten
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/wettbewerbsverbot/">                        Wettbewerbsverbot
</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nav-mobile">
                <div class="menu menu-main">
                  <div class="first-level-container">
                    <button class="title" aria-expanded="true">
                      <p class="h4 menu-title">
                        Jobsuchende
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/">                        Für Jobsuchende
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/teilnahmebedingungen-loyalty-programm/">                        Teilnahmebedingungen für GoodWork Perks
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://talent.zenjob.com/signup-form?_ga=2.123742344.306586205.1661758583-311121729.1656426051" target="_blank">                        Anmeldeformular
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/datenschutz-talents/">                        Datenschutz Zenjobber
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/">                        Blog
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobboerse">                        Jobbörse
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/ferienjobs/">                        Ferienjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/minijobs/">                        Minijobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/nebenjobs/">                        Nebenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/studentenjobs/">                        Studentenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/werkstudentenjobs/">                        Werkstudentenjobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/">                        Zenjobber Trainings
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/erster-job/">                        Erster Job
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/onboarding-zenjob-app/">                        Onboarding Zenjob App
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/zenjob-voraussetzungen/">                        Zenjob Voraussetzungen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/service/">                        Service-Training
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/service/dresscode/">                        Dresscode für Servicejobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/gastro-gesundheitszeugnis/">                        Gastro-Training / Gesundheitszeugnis
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/vorbereitung-sicherheitsequipment/">                        Sicherheitsequipment
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/trainings/fuehrungszeugnis-beantragen/">                        Führungszeugnis Guide
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/anstellungsverhaeltnis/">                        Anstellungsverhältnis
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/jobs/region/">                        Jobs in deiner Nähe
</a>
                      </div>
                    </div>
                  </div>
                  <div class="first-level-container">
                    <button class="title" aria-expanded="true">
                      <p class="h4 menu-title">
                        Unternehmen
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/">                        Für Unternehmen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/wie-funktioniert-zenjob/">                        Wie funktioniert es
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/ressourcen/">                        Ressourcen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/">                        Arbeitgebermagazin
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/buchungsplattform/">                        Zenjob Buchungsplattform
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/buchungsplattform/integrationen/">                        PDL und SAAS Partnerprogramm
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/">                        Übersicht Erfolgsgeschichten
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/rewe-maerkte/">                        REWE-Märkte
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/edeka-breidohrs/">                        Edeka-Breidohr&#39;s
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/deiters/">                        Deiters
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/erfolgsgeschichten/spicebar/">                        Spicebar
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/branchen/">                        Branchen
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/call-center/">                        Call Center
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/e-commerce/">                        E-Commerce
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/einzelhandel/">                        Einzelhandel
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/events/">                        Eventbranche
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/hotellerie/">                        Hotellerie &amp; Gastronomie
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/lebensmittel/">                        Lebensmittel
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/logistik/">                        Logistik
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/gebaeudedienstleistungen/">                        Grün- und Graupflege
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/personal/region/">                        Personal in Ihrer Region
</a>
                      </div>
                    </div>
                  </div>
                  <div class="first-level-container">
                    <button class="title" aria-expanded="true">
                      <p class="h4 menu-title">
                        Neueste Beiträge
                      </p>
                      <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                        </path>
                      </svg>
                    </button>
                    <div class="first-level-menu">
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/arbeitsmarktprognosen-q2/">                        Arbeitsmarktprognosen Q2/2025
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/sozialversicherungsnummer/">                        Sozialversicherungsnummer
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/11-uni-essentials/">                        Deine perfekten 11 Uni Essentials
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/arbeitgebermagazin/generation-z-bei-der-arbeit/">                        Gen Z  Studie 2024
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/steuer-id/">                        Steuer-ID
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/beste-nebenjobs/">                        Unsere beliebtesten Jobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/krankmeldung-nach-muster/">                        Krankmeldung mit Vorlage schreiben
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/verdienst/">                        Unsere bestbezahlten Jobs
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/semesterferien-arbeiten/">                        In den Semesterferien arbeiten
</a>
                      </div>
                      <div class="menu-item">
                        <a class="first-level-title" href="https://www.zenjob.com/de/blog/wettbewerbsverbot/">                        Wettbewerbsverbot
</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
            <div class="options">
              <div class="first-level-container">
                <div class="title">
                  <p class="h4">
                    Zenjob
                  </p>
                  <svg width="17" height="11" viewBox="0 0 17 11" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16.221.555a1.455 1.455 0 0 0-2.056-.001L8.5 6.207 2.835.554A1.455 1.455 0 0 0 .779 2.612L8.5 10.334l7.721-7.722a1.455 1.455 0 0 0 0-2.057Z" fill="currentColor">
                    </path>
                  </svg>
                </div>
                <div class="links-container first-level-menu">
                  <div class="menu-item">
                    <a class="first-level-title" href="https://www.zenjob.com/de/ueber-uns/" target="_blank" rel="noopener noreferrer">                    Über uns
</a>
                  </div>
                  <div class="menu-item">
                    <a class="first-level-title" href="https://career.zenjob.com/en/" target="_blank" rel="noopener noreferrer">                    Karriere
</a>
                  </div>
                  <div class="menu-item">
                    <a class="first-level-title" href="https://www.zenjob.com/de/presse/" target="_blank" rel="noopener noreferrer">                    Presse
</a>
                  </div>
                  <div class="menu-item">
                    <a class="first-level-title" href="https://www.zenjob.com/de/kontakt/" target="_blank" rel="noopener noreferrer">                    Kontakt
</a>
                  </div>
                  <div class="menu-item">
                    <a class="first-level-title" href="https://zenjob.zendesk.com/hc/de" target="_blank" rel="nofollow noopener noreferrer">                    Support - Zenjobber
</a>
                  </div>
                  <div class="menu-item">
                    <a class="first-level-title" href="https://service.zenjob.com/s/?language=de" target="_blank" rel="nofollow noopener noreferrer">                    Support - Unternehmen
</a>
                  </div>
                </div>
              </div>
              <div class="socials stroke">
                <div class="icons-list">
                  <a href="https://www.instagram.com/zenjob_de/" target="_blank" rel="nofollow noopener noreferrer" aria-label="Zenjob Instagram">                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32Z" fill="#2d31ff" stroke="white" stroke-width="0.0963696" stroke-miterlimit="10">
                    </path>
                    <path d="M23.3213 12.999C25.3219 12.999 26.9442 14.6205 26.9443 16.6211V23.4238C26.9443 25.4244 25.3219 27.0459 23.3213 27.0459H16.5195C14.5189 27.0459 12.8965 25.4244 12.8965 23.4238V16.6211C12.8966 14.6205 14.519 12.999 16.5195 12.999H23.3213ZM19.9209 16.3711C17.9039 16.3711 16.2686 18.0065 16.2686 20.0234L16.2734 20.2109C16.3682 22.0781 17.8653 23.5752 19.7324 23.6699L19.9209 23.6748C21.8746 23.6746 23.4694 22.1403 23.5674 20.2109L23.5723 20.0234C23.5723 18.0695 22.038 16.4738 20.1084 16.376L19.9209 16.3711ZM19.9209 17.3594C21.3921 17.3596 22.585 18.5522 22.585 20.0234C22.5846 21.4943 21.3918 22.6873 19.9209 22.6875C18.4498 22.6875 17.2572 21.4944 17.2568 20.0234C17.2568 18.5521 18.4496 17.3594 19.9209 17.3594ZM24.0605 15.1787C23.5943 15.1787 23.2159 15.5562 23.2158 16.0225C23.2158 16.4888 23.5942 16.8672 24.0605 16.8672C24.5267 16.867 24.9043 16.4887 24.9043 16.0225C24.9042 15.5563 24.5267 15.1789 24.0605 15.1787Z" fill="white">
                    </path>
                  </svg>
</a>
                  <a href="https://www.linkedin.com/company/zenjob/" target="_blank" rel="nofollow noopener noreferrer" aria-label="Zenjob Linkedin">                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32Z" fill="#2d31ff" stroke="white" stroke-width="0.0963696" stroke-miterlimit="10">
                    </path>
                    <path d="M13.2174 13.9808C13.2174 13.5443 13.3701 13.1842 13.6757 12.9005C13.9812 12.6168 14.3784 12.475 14.8672 12.475C15.3473 12.475 15.7358 12.6146 16.0326 12.894C16.3381 13.182 16.4908 13.5574 16.4908 14.02C16.4908 14.4391 16.3424 14.7882 16.0456 15.0676C15.7401 15.3556 15.3386 15.4997 14.841 15.4997H14.8279C14.3478 15.4997 13.9594 15.3556 13.6626 15.0676C13.3658 14.7795 13.2174 14.4172 13.2174 13.9808ZM13.3876 25.4379V16.6912H16.2944V25.4379H13.3876ZM17.905 25.4379H20.8118V20.5539C20.8118 20.2484 20.8467 20.0127 20.9166 19.8468C21.0388 19.55 21.2243 19.299 21.473 19.0939C21.7218 18.8888 22.0339 18.7862 22.4093 18.7862C23.3869 18.7862 23.8758 19.4453 23.8758 20.7634V25.4379H26.7826V20.4229C26.7826 19.131 26.4771 18.1512 25.866 17.4834C25.255 16.8156 24.4475 16.4817 23.4437 16.4817C22.3176 16.4817 21.4403 16.9662 20.8118 17.9351V17.9613H20.7987L20.8118 17.9351V16.6912H17.905C17.9224 16.9705 17.9312 17.8391 17.9312 19.2969C17.9312 20.7546 17.9224 22.8017 17.905 25.4379Z" fill="white">
                    </path>
                  </svg>
</a>
                  <a href="https://www.youtube.com/c/ZenjobGmbH/featured" target="_blank" rel="nofollow noopener noreferrer" aria-label="Zenjob YouTube">                  <svg width="39" height="40" viewBox="0 0 39 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.5 32.5C27.1274 32.5 32.5 27.1274 32.5 20.5C32.5 13.8726 27.1274 8.5 20.5 8.5C13.8726 8.5 8.5 13.8726 8.5 20.5C8.5 27.1274 13.8726 32.5 20.5 32.5Z" fill="#2d31ff" stroke="white" stroke-width="0.0963696" stroke-miterlimit="10">
                    </path>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.5072 14.3247C19.0779 14.1235 21.6605 14.1235 24.2312 14.3247L25.9581 14.4598C26.9199 14.535 27.7068 15.2559 27.8658 16.2075C28.2636 18.5885 28.2636 21.0191 27.8658 23.4001C27.7068 24.3517 26.9199 25.0726 25.9581 25.1479L24.2312 25.283C21.6605 25.4841 19.0779 25.4841 16.5072 25.283L14.7803 25.1479C13.8185 25.0726 13.0316 24.3517 12.8726 23.4001C12.4748 21.0191 12.4748 18.5885 12.8726 16.2075C13.0316 15.2559 13.8185 14.535 14.7803 14.4598L16.5072 14.3247ZM18.8278 21.7075V17.9001C18.8278 17.7204 19.0239 17.6094 19.178 17.7019L22.3508 19.6056C22.5005 19.6954 22.5005 19.9123 22.3508 20.0021L19.178 21.9058C19.0239 21.9982 18.8278 21.8872 18.8278 21.7075Z" fill="white">
                    </path>
                  </svg>
</a>
                  <a href="https://www.facebook.com/zenjob/" target="_blank" rel="nofollow noopener noreferrer" aria-label="Zenjob Facebook">                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 20.0733C32 13.4054 26.6274 8 20 8C13.3726 8 8 13.4054 8 20.0733C8 26.0995 12.3882 31.0943 18.125 32V23.5633H15.0781V20.0733H18.125V17.4134C18.125 14.3875 19.9165 12.7161 22.6576 12.7161C23.9705 12.7161 25.3438 12.952 25.3438 12.952V15.9231H23.8306C22.3399 15.9231 21.875 16.8538 21.875 17.8086V20.0733H25.2031L24.6711 23.5633H21.875V32C27.6118 31.0943 32 26.0995 32 20.0733Z" fill="#2d31ff">
                    </path>
                  </svg>
</a>
                  <a href="https://www.tiktok.com/@zenjob" target="_blank" rel="nofollow noopener noreferrer" aria-label="Zenjob Tiktok">                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.2031 31.8047C27.8305 31.8047 33.2031 26.4321 33.2031 19.8047C33.2031 13.1773 27.8305 7.80469 21.2031 7.80469C14.5757 7.80469 9.20312 13.1773 9.20312 19.8047C9.20312 26.4321 14.5757 31.8047 21.2031 31.8047Z" fill="#2d31ff" stroke="white" stroke-width="0.0963696" stroke-miterlimit="10">
                    </path>
                    <path d="M24.1577 12.7178L23.7947 12.1738H21.5981V17.0732L21.5906 21.8589C21.5944 21.8944 21.5981 21.9335 21.5981 21.9691C21.5981 23.1673 20.5728 24.145 19.308 24.145C18.0431 24.145 17.0178 23.1708 17.0178 21.9691C17.0178 20.7709 18.0431 19.7931 19.308 19.7931C19.5699 19.7931 19.8244 19.8394 20.0601 19.9176V17.5283C19.8169 17.4892 19.5662 17.4679 19.308 17.4679C16.6997 17.4714 14.5742 19.4909 14.5742 21.9726C14.5742 24.4543 16.6997 26.4738 19.3117 26.4738C21.9237 26.4738 24.0492 24.4543 24.0492 21.9726V16.2804C24.9959 17.1799 26.2196 18.0581 27.5742 18.339V15.8964C26.1036 15.2777 24.6404 13.4502 24.1577 12.7178Z" fill="white">
                    </path>
                  </svg>
</a>
                </div>
              </div>
              <div class="language-switch">
                <a rel="nofollow" class="language-current">                DE
</a>
                <svg xmlns="http://www.w3.org/2000/svg" width="2" height="27" viewBox="0 0 2 27" fill="none">
                  <path d="M1 1L0.999999 26" stroke="#26282D" stroke-width="2" stroke-linecap="round">
                  </path>
                </svg>
                <a class="language" href="https://www.zenjob.com/en/">                EN
</a>
              </div>
              <div class="app-buttons">
                <a href="https://apps.apple.com/app/id1141020680?mt=8" id="appdlFooter-ios" class="app-buttons-link app-button-link--apple" title="Zenjob in Apple Store" aria-label="Follow Zenjob onZenjob in Apple Store" rel="nofollow noopener noreferrer" target="_blank">                <svg width="155" height="52" viewBox="0 0 155 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_949_545)">
                    <path d="M141.896 0.428878H12.5929C12.1216 0.428878 11.656 0.428878 11.1859 0.431449C10.7924 0.434019 10.402 0.441487 10.0047 0.447772C9.14167 0.457928 8.28062 0.533858 7.4291 0.6749C6.57876 0.819013 5.75507 1.09071 4.98587 1.48079C4.21761 1.87418 3.51563 2.38534 2.9054 2.99574C2.29196 3.60442 1.78061 4.30798 1.39101 5.07935C1.00034 5.84919 0.729449 6.67414 0.587691 7.52571C0.444586 8.37621 0.367579 9.23652 0.357363 10.0989C0.345435 10.493 0.344176 10.8884 0.337891 11.2825V40.9916C0.344176 41.3907 0.345435 41.7773 0.357363 42.1765C0.367582 43.0389 0.444589 43.8991 0.587691 44.7496C0.729058 45.6017 0.999966 46.4271 1.39101 47.1972C1.78043 47.9661 2.29185 48.6668 2.9054 49.2721C3.51332 49.8852 4.21575 50.3967 4.98587 50.7871C5.75506 51.1782 6.57867 51.4515 7.4291 51.5979C8.28077 51.7378 9.14172 51.8137 10.0047 51.8251C10.402 51.8339 10.7924 51.8389 11.1859 51.8389C11.6559 51.8414 12.1216 51.8414 12.5929 51.8414H141.896C142.358 51.8414 142.827 51.8414 143.289 51.8389C143.681 51.8389 144.082 51.8339 144.474 51.8251C145.335 51.8143 146.195 51.7384 147.044 51.5979C147.898 51.4505 148.724 51.1773 149.497 50.7871C150.267 50.3965 150.968 49.885 151.576 49.2721C152.188 48.6644 152.7 47.9642 153.094 47.1972C153.483 46.4265 153.751 45.6012 153.89 44.7496C154.034 43.899 154.113 43.0389 154.129 42.1765C154.134 41.7773 154.134 41.3907 154.134 40.9916C154.144 40.5246 154.144 40.0602 154.144 39.5857V12.6858C154.144 12.2151 154.144 11.7482 154.134 11.2825C154.134 10.8884 154.134 10.493 154.129 10.0989C154.113 9.23639 154.034 8.37628 153.89 7.52566C153.75 6.67458 153.482 5.84969 153.094 5.0793C152.301 3.53316 151.043 2.27462 149.497 1.48068C148.724 1.09154 147.898 0.819922 147.044 0.674784C146.195 0.533121 145.335 0.457165 144.474 0.447592C144.082 0.44132 143.681 0.433788 143.289 0.431282C142.827 0.428711 142.358 0.428711 141.896 0.428711V0.428878Z" fill="#A6A6A6">
                    </path>
                    <path d="M11.1921 50.717C10.8005 50.717 10.4184 50.712 10.0298 50.7032C9.22494 50.6927 8.42194 50.6227 7.6274 50.4936C6.88653 50.366 6.16883 50.1286 5.49797 49.7894C4.83326 49.4529 4.22699 49.0117 3.70238 48.4827C3.17019 47.9599 2.72711 47.3536 2.39071 46.6878C2.0506 46.0176 1.81523 45.2992 1.69278 44.5577C1.56056 43.761 1.48901 42.9554 1.47878 42.1478C1.47063 41.8767 1.45996 40.9742 1.45996 40.9742V11.2827C1.45996 11.2827 1.47132 10.394 1.47884 10.1329C1.48864 9.32662 1.55977 8.52224 1.6916 7.72673C1.81427 6.9832 2.04983 6.26278 2.39012 5.59041C2.72528 4.92502 3.1659 4.31824 3.69489 3.7936C4.22329 3.26398 4.8315 2.82052 5.49734 2.47941C6.16666 2.14122 6.883 1.90554 7.62237 1.78027C8.41952 1.6499 9.22531 1.57941 10.033 1.5694L11.1928 1.55371H143.283L144.456 1.57003C145.257 1.57954 146.055 1.6494 146.845 1.77901C147.592 1.90585 148.316 2.14318 148.992 2.48317C150.326 3.17062 151.412 4.25822 152.096 5.59354C152.431 6.26127 152.663 6.97582 152.784 7.71292C152.918 8.51496 152.992 9.32567 153.008 10.1386C153.012 10.5026 153.012 10.8936 153.012 11.2827C153.022 11.7647 153.022 12.2234 153.022 12.686V39.5859C153.022 40.0528 153.022 40.5085 153.012 40.9679C153.012 41.3858 153.012 41.7687 153.006 42.1628C152.992 42.9612 152.918 43.7575 152.787 44.5452C152.667 45.292 152.433 46.0159 152.093 46.6916C151.754 47.3502 151.313 47.9513 150.787 48.4727C150.262 49.0045 149.655 49.4483 148.989 49.7869C148.314 50.1288 147.591 50.367 146.845 50.4936C146.05 50.6233 145.247 50.6934 144.442 50.7032C144.066 50.712 143.672 50.717 143.289 50.717L141.896 50.7195L11.1921 50.717Z" fill="black">
                    </path>
                    <path d="M32.1735 26.5215C32.1873 25.4487 32.4723 24.3968 33.0019 23.4637C33.5314 22.5306 34.2884 21.7467 35.2024 21.1848C34.6218 20.3555 33.8558 19.6731 32.9653 19.1917C32.0748 18.7103 31.0843 18.4431 30.0725 18.4115C27.9142 18.1849 25.8217 19.703 24.7219 19.703C23.6007 19.703 21.9073 18.434 20.0838 18.4715C18.9043 18.5096 17.7548 18.8526 16.7473 19.467C15.7398 20.0815 14.9086 20.9465 14.3347 21.9777C11.8489 26.2814 13.7031 32.6065 16.0843 36.0854C17.2756 37.7889 18.668 39.6917 20.4899 39.6242C22.2727 39.5503 22.9385 38.4874 25.0905 38.4874C27.2226 38.4874 27.8473 39.6242 29.7061 39.5813C31.6191 39.5503 32.8244 37.8703 33.974 36.1506C34.83 34.9368 35.4887 33.5953 35.9256 32.1758C34.8142 31.7057 33.8658 30.9189 33.1985 29.9134C32.5313 28.9079 32.1748 27.7282 32.1735 26.5215Z" fill="white">
                    </path>
                    <path d="M28.6631 16.1237C29.7061 14.8716 30.22 13.2621 30.0956 11.6372C28.502 11.8046 27.03 12.5662 25.9728 13.7703C25.456 14.3586 25.0601 15.0429 24.8079 15.7842C24.5556 16.5256 24.452 17.3094 24.5028 18.0908C25.2999 18.099 26.0884 17.9262 26.8091 17.5855C27.5297 17.2448 28.1636 16.745 28.6631 16.1237Z" fill="white">
                    </path>
                    <path d="M54.7097 35.3122H48.6258L47.1648 39.6263H44.5879L50.3505 23.6653H53.0278L58.7904 39.6263H56.1695L54.7097 35.3122ZM49.2559 33.3215H54.0784L51.7011 26.32H51.6346L49.2559 33.3215Z" fill="white">
                    </path>
                    <path d="M71.236 33.8084C71.236 37.4247 69.3005 39.748 66.3797 39.748C65.6398 39.7867 64.904 39.6163 64.2564 39.2562C63.6089 38.8961 63.0758 38.361 62.7183 37.7121H62.663V43.4759H60.2744V27.9894H62.5865V29.9249H62.6304C63.0044 29.2791 63.5465 28.7467 64.1989 28.3844C64.8514 28.0222 65.5899 27.8436 66.3358 27.8676C69.2892 27.8676 71.236 30.2023 71.236 33.8084ZM68.7809 33.8084C68.7809 31.4525 67.5633 29.9035 65.7056 29.9035C63.8806 29.9035 62.653 31.4851 62.653 33.8084C62.653 36.1531 63.8806 37.7234 65.7056 37.7234C67.5633 37.7234 68.7809 36.1858 68.7809 33.8084Z" fill="white">
                    </path>
                    <path d="M84.0436 33.8084C84.0436 37.4246 82.1081 39.748 79.1873 39.748C78.4474 39.7867 77.7116 39.6163 77.064 39.2562C76.4165 38.8961 75.8835 38.361 75.5259 37.712H75.4707V43.4759H73.082V27.9894H75.3941V29.9249H75.438C75.812 29.279 76.354 28.7467 77.0065 28.3844C77.659 28.0222 78.3974 27.8436 79.1433 27.8676C82.0968 27.8676 84.0436 30.2023 84.0436 33.8084ZM81.5885 33.8084C81.5885 31.4525 80.3709 29.9035 78.5133 29.9035C76.6882 29.9035 75.4606 31.4851 75.4606 33.8084C75.4606 36.1531 76.6882 37.7234 78.5133 37.7234C80.371 37.7234 81.5885 36.1858 81.5885 33.8084H81.5885Z" fill="white">
                    </path>
                    <path d="M92.5086 35.1792C92.6856 36.762 94.2232 37.8012 96.3244 37.8012C98.3377 37.8012 99.7862 36.7619 99.7862 35.3348C99.7862 34.0959 98.9126 33.3541 96.844 32.8457L94.7755 32.3474C91.8446 31.6395 90.484 30.2688 90.484 28.0446C90.484 25.2907 92.8839 23.3992 96.2918 23.3992C99.6644 23.3992 101.977 25.2907 102.054 28.0446H99.6431C99.4988 26.4518 98.1821 25.4903 96.2578 25.4903C94.3336 25.4903 93.0169 26.4631 93.0169 27.879C93.0169 29.0074 93.8579 29.6714 95.9152 30.1797L97.6737 30.6115C100.948 31.3859 102.309 32.7014 102.309 35.036C102.309 38.0221 99.9305 39.8923 96.1474 39.8923C92.6077 39.8923 90.2179 38.066 90.0635 35.1791L92.5086 35.1792Z" fill="white">
                    </path>
                    <path d="M107.465 25.2356V27.9895H109.678V29.8811H107.465V36.2963C107.465 37.2929 107.908 37.7574 108.881 37.7574C109.144 37.7528 109.406 37.7343 109.667 37.7021V39.5824C109.229 39.6641 108.785 39.7011 108.34 39.6928C105.984 39.6928 105.065 38.8079 105.065 36.5511V29.8811H103.373V27.9895H105.065V25.2356H107.465Z" fill="white">
                    </path>
                    <path d="M110.959 33.8086C110.959 30.1472 113.115 27.8464 116.478 27.8464C119.852 27.8464 121.998 30.1471 121.998 33.8086C121.998 37.48 119.863 39.7707 116.478 39.7707C113.094 39.7707 110.959 37.48 110.959 33.8086ZM119.565 33.8086C119.565 31.297 118.414 29.8146 116.478 29.8146C114.543 29.8146 113.393 31.3082 113.393 33.8086C113.393 36.3303 114.543 37.8013 116.478 37.8013C118.414 37.8013 119.565 36.3303 119.565 33.8086H119.565Z" fill="white">
                    </path>
                    <path d="M123.967 27.9895H126.245V29.9702H126.3C126.454 29.3516 126.817 28.8049 127.327 28.422C127.836 28.0391 128.462 27.8434 129.099 27.8677C129.375 27.8668 129.649 27.8967 129.918 27.9569V30.1911C129.57 30.0849 129.208 30.0362 128.844 30.0468C128.497 30.0327 128.152 30.0939 127.83 30.2261C127.509 30.3584 127.221 30.5585 126.984 30.8129C126.748 31.0672 126.569 31.3697 126.46 31.6996C126.352 32.0295 126.316 32.379 126.355 32.7241V39.6264H123.967L123.967 27.9895Z" fill="white">
                    </path>
                    <path d="M140.931 36.2085C140.609 38.321 138.552 39.7707 135.92 39.7707C132.535 39.7707 130.434 37.5026 130.434 33.8638C130.434 30.2137 132.546 27.8464 135.82 27.8464C139.039 27.8464 141.064 30.0581 141.064 33.5864V34.4048H132.845V34.5491C132.807 34.9774 132.861 35.4088 133.002 35.8148C133.144 36.2208 133.37 36.5919 133.666 36.9037C133.962 37.2154 134.321 37.4606 134.719 37.623C135.118 37.7853 135.546 37.8611 135.975 37.8453C136.54 37.8982 137.106 37.7674 137.59 37.4725C138.075 37.1776 138.451 36.7343 138.663 36.2085L140.931 36.2085ZM132.856 32.7354H138.674C138.695 32.3503 138.637 31.965 138.502 31.6035C138.368 31.2421 138.16 30.9124 137.892 30.635C137.624 30.3577 137.302 30.1388 136.945 29.992C136.588 29.8452 136.205 29.7737 135.82 29.7819C135.431 29.7796 135.045 29.8544 134.685 30.0018C134.325 30.1493 133.998 30.3666 133.722 30.6412C133.447 30.9158 133.229 31.2422 133.08 31.6017C132.931 31.9611 132.855 32.3464 132.856 32.7354V32.7354Z" fill="white">
                    </path>
                    <path d="M48.9557 11.651C49.4565 11.6151 49.959 11.6908 50.427 11.8725C50.895 12.0543 51.3168 12.3377 51.6621 12.7023C52.0073 13.0668 52.2673 13.5034 52.4233 13.9806C52.5794 14.4578 52.6276 14.9637 52.5644 15.4618C52.5644 17.9119 51.2402 19.3203 48.9557 19.3203H46.1855V11.651H48.9557ZM47.3767 18.2357H48.8227C49.1805 18.2571 49.5386 18.1984 49.8709 18.064C50.2032 17.9295 50.5014 17.7226 50.7437 17.4584C50.9859 17.1942 51.1662 16.8793 51.2715 16.5366C51.3767 16.1939 51.4042 15.8321 51.3519 15.4774C51.4004 15.1242 51.3701 14.7646 51.2633 14.4244C51.1564 14.0842 50.9757 13.7719 50.734 13.5098C50.4922 13.2477 50.1955 13.0423 49.8651 12.9083C49.5347 12.7743 49.1787 12.7151 48.8227 12.7348H47.3767V18.2357Z" fill="white">
                    </path>
                    <path d="M53.9104 16.4236C53.874 16.0433 53.9175 15.6595 54.0381 15.297C54.1587 14.9344 54.3538 14.6011 54.6108 14.3184C54.8678 14.0356 55.181 13.8097 55.5304 13.6551C55.8798 13.5005 56.2577 13.4207 56.6398 13.4207C57.0219 13.4207 57.3997 13.5005 57.7491 13.6551C58.0986 13.8097 58.4118 14.0356 58.6688 14.3184C58.9258 14.6011 59.1208 14.9344 59.2415 15.297C59.3621 15.6595 59.4056 16.0433 59.3692 16.4236C59.4063 16.8044 59.3633 17.1887 59.243 17.5518C59.1227 17.9149 58.9277 18.2489 58.6707 18.5322C58.4136 18.8155 58.1002 19.0419 57.7504 19.1968C57.4006 19.3517 57.0223 19.4317 56.6398 19.4317C56.2572 19.4317 55.8789 19.3517 55.5292 19.1968C55.1794 19.0419 54.8659 18.8155 54.6089 18.5322C54.3518 18.2489 54.1569 17.9149 54.0366 17.5518C53.9163 17.1887 53.8733 16.8044 53.9104 16.4236ZM58.1943 16.4236C58.1943 15.1691 57.6307 14.4354 56.6417 14.4354C55.6488 14.4354 55.0903 15.1691 55.0903 16.4236C55.0903 17.6883 55.6488 18.4163 56.6417 18.4163C57.6308 18.4162 58.1943 17.6832 58.1943 16.4236H58.1943Z" fill="white">
                    </path>
                    <path d="M66.6249 19.3201H65.4401L64.2439 15.0575H64.1535L62.9623 19.3201H61.7887L60.1934 13.5325H61.3519L62.3887 17.9488H62.474L63.664 13.5325H64.7597L65.9497 17.9488H66.04L67.0718 13.5325H68.214L66.6249 19.3201Z" fill="white">
                    </path>
                    <path d="M69.5557 13.5327H70.6552V14.4521H70.7406C70.8854 14.1219 71.1296 13.8451 71.4392 13.6602C71.7488 13.4754 72.1083 13.3918 72.4677 13.421C72.7493 13.3998 73.0321 13.4423 73.2951 13.5452C73.558 13.6482 73.7945 13.809 73.9869 14.0157C74.1793 14.2224 74.3227 14.4698 74.4065 14.7395C74.4903 15.0092 74.5123 15.2943 74.471 15.5736V19.3203H73.3288V15.8605C73.3288 14.9304 72.9246 14.4678 72.0799 14.4678C71.8887 14.4589 71.6978 14.4915 71.5203 14.5632C71.3429 14.635 71.1831 14.7443 71.0518 14.8836C70.9205 15.0229 70.8209 15.1889 70.7599 15.3703C70.6988 15.5517 70.6776 15.7442 70.6979 15.9345V19.3204H69.5557L69.5557 13.5327Z" fill="white">
                    </path>
                    <path d="M76.291 11.2732H77.4332V19.3202H76.291V11.2732Z" fill="white">
                    </path>
                    <path d="M79.0217 16.4237C78.9853 16.0434 79.0288 15.6596 79.1495 15.297C79.2701 14.9345 79.4652 14.6011 79.7222 14.3184C79.9793 14.0356 80.2925 13.8097 80.642 13.6551C80.9914 13.5005 81.3693 13.4207 81.7514 13.4207C82.1335 13.4207 82.5114 13.5005 82.8608 13.6551C83.2103 13.8097 83.5235 14.0356 83.7806 14.3184C84.0376 14.6011 84.2326 14.9345 84.3533 15.297C84.4739 15.6596 84.5175 16.0434 84.4811 16.4237C84.5181 16.8045 84.4751 17.1888 84.3548 17.5519C84.2344 17.915 84.0395 18.249 83.7824 18.5323C83.5253 18.8156 83.2118 19.042 82.862 19.1969C82.5123 19.3518 82.1339 19.4318 81.7514 19.4318C81.3688 19.4318 80.9905 19.3518 80.6407 19.1969C80.291 19.042 79.9775 18.8156 79.7204 18.5323C79.4633 18.249 79.2683 17.915 79.148 17.5519C79.0277 17.1888 78.9846 16.8045 79.0217 16.4237ZM83.3056 16.4237C83.3056 15.1692 82.742 14.4355 81.753 14.4355C80.7601 14.4355 80.2016 15.1692 80.2016 16.4238C80.2016 17.6884 80.7601 18.4164 81.753 18.4164C82.742 18.4164 83.3056 17.6833 83.3056 16.4237H83.3056Z" fill="white">
                    </path>
                    <path d="M85.6826 17.6833C85.6826 16.6415 86.4583 16.0409 87.8353 15.9555L89.403 15.8651V15.3656C89.403 14.7543 88.9988 14.4091 88.2181 14.4091C87.5805 14.4091 87.1386 14.6432 87.0119 15.0524H85.906C86.0228 14.0583 86.9579 13.4207 88.2708 13.4207C89.7218 13.4207 90.5402 14.143 90.5402 15.3656V19.32H89.4407V18.5067H89.3503C89.1668 18.7984 88.9093 19.0363 88.6038 19.1959C88.2984 19.3556 87.9561 19.4313 87.6118 19.4154C87.3689 19.4407 87.1233 19.4147 86.891 19.3393C86.6586 19.2639 86.4447 19.1406 86.2629 18.9774C86.0812 18.8142 85.9356 18.6147 85.8357 18.3918C85.7357 18.1689 85.6836 17.9275 85.6826 17.6833ZM89.403 17.1887V16.7048L87.9897 16.7952C87.1926 16.8486 86.8311 17.1197 86.8311 17.6299C86.8311 18.1508 87.283 18.4539 87.9043 18.4539C88.0864 18.4724 88.2703 18.454 88.4451 18.3999C88.6199 18.3458 88.7821 18.2571 88.9219 18.139C89.0617 18.021 89.1764 17.876 89.259 17.7128C89.3417 17.5495 89.3906 17.3713 89.403 17.1887Z" fill="white">
                    </path>
                    <path d="M92.042 16.4239C92.042 14.5951 92.9821 13.4365 94.4444 13.4365C94.8061 13.4199 95.1651 13.5065 95.4794 13.6863C95.7937 13.8661 96.0503 14.1317 96.2193 14.4519H96.3046V11.2732H97.4468V19.3202H96.3523V18.4058H96.2619C96.0799 18.7239 95.8144 18.9862 95.494 19.1641C95.1736 19.3421 94.8107 19.4291 94.4444 19.4156C92.9721 19.4157 92.042 18.2571 92.042 16.4239ZM93.2219 16.4239C93.2219 17.6515 93.8006 18.3901 94.7683 18.3901C95.731 18.3901 96.326 17.6408 96.326 16.4289C96.326 15.2227 95.7248 14.4626 94.7683 14.4626C93.8068 14.4626 93.2219 15.2063 93.2219 16.4239H93.2219Z" fill="white">
                    </path>
                    <path d="M102.173 16.4239C102.137 16.0435 102.18 15.6598 102.301 15.2972C102.421 14.9347 102.616 14.6013 102.873 14.3186C103.13 14.0359 103.444 13.8099 103.793 13.6553C104.143 13.5008 104.52 13.4209 104.902 13.4209C105.285 13.4209 105.662 13.5008 106.012 13.6553C106.361 13.8099 106.674 14.0359 106.931 14.3186C107.188 14.6013 107.384 14.9347 107.504 15.2972C107.625 15.6598 107.668 16.0435 107.632 16.4239C107.669 16.8046 107.626 17.1889 107.506 17.552C107.385 17.9152 107.19 18.2491 106.933 18.5324C106.676 18.8157 106.363 19.0421 106.013 19.197C105.663 19.352 105.285 19.432 104.902 19.432C104.52 19.432 104.142 19.352 103.792 19.197C103.442 19.0421 103.129 18.8157 102.872 18.5324C102.615 18.2491 102.42 17.9152 102.299 17.552C102.179 17.1889 102.136 16.8046 102.173 16.4239ZM106.457 16.4239C106.457 15.1693 105.893 14.4357 104.904 14.4357C103.912 14.4357 103.353 15.1693 103.353 16.4239C103.353 17.6885 103.912 18.4165 104.904 18.4165C105.893 18.4165 106.457 17.6835 106.457 16.4239Z" fill="white">
                    </path>
                    <path d="M109.163 13.5327H110.263V14.4521H110.348C110.493 14.1219 110.737 13.8451 111.047 13.6602C111.356 13.4754 111.716 13.3918 112.075 13.421C112.357 13.3998 112.64 13.4423 112.902 13.5452C113.165 13.6482 113.402 13.809 113.594 14.0157C113.787 14.2224 113.93 14.4698 114.014 14.7395C114.098 15.0092 114.12 15.2943 114.078 15.5736V19.3203H112.936V15.8605C112.936 14.9304 112.532 14.4678 111.687 14.4678C111.496 14.4589 111.305 14.4915 111.128 14.5632C110.95 14.635 110.79 14.7443 110.659 14.8836C110.528 15.0229 110.428 15.1889 110.367 15.3703C110.306 15.5517 110.285 15.7442 110.305 15.9345V19.3204H109.163V13.5327Z" fill="white">
                    </path>
                    <path d="M120.533 12.0916V13.5589H121.787V14.521H120.533V17.497C120.533 18.1033 120.783 18.3688 121.351 18.3688C121.497 18.3683 121.642 18.3595 121.787 18.3424V19.2938C121.582 19.3305 121.374 19.35 121.166 19.3522C119.895 19.3522 119.39 18.9053 119.39 17.7895V14.5209H118.471V13.5588H119.39V12.0916H120.533Z" fill="white">
                    </path>
                    <path d="M123.349 11.2732H124.481V14.4626H124.571C124.723 14.1293 124.974 13.8509 125.29 13.6654C125.606 13.4799 125.971 13.3962 126.336 13.4258C126.616 13.4106 126.896 13.4574 127.156 13.5628C127.416 13.6683 127.65 13.8298 127.84 14.0359C128.03 14.242 128.173 14.4875 128.257 14.7551C128.342 15.0226 128.367 15.3055 128.329 15.5835V19.3202H127.186V15.8653C127.186 14.9408 126.755 14.4727 125.948 14.4727C125.752 14.4566 125.554 14.4835 125.37 14.5517C125.185 14.6199 125.017 14.7277 124.878 14.8674C124.74 15.0072 124.633 15.1756 124.566 15.3609C124.499 15.5461 124.473 15.7438 124.491 15.94V19.3202H123.349L123.349 11.2732Z" fill="white">
                    </path>
                    <path d="M134.988 17.7574C134.833 18.2864 134.497 18.7439 134.038 19.05C133.58 19.3561 133.029 19.4913 132.48 19.4318C132.099 19.4419 131.72 19.3689 131.37 19.2178C131.02 19.0668 130.707 18.8413 130.452 18.5571C130.198 18.2728 130.008 17.9366 129.897 17.5718C129.785 17.207 129.755 16.8224 129.807 16.4445C129.756 16.0655 129.787 15.68 129.899 15.3141C130.01 14.9482 130.198 14.6105 130.451 14.3237C130.704 14.037 131.016 13.808 131.365 13.6522C131.714 13.4964 132.093 13.4175 132.475 13.4208C134.086 13.4208 135.057 14.521 135.057 16.3384V16.737H130.97V16.801C130.953 17.0134 130.979 17.2272 131.049 17.4286C131.118 17.6301 131.229 17.8148 131.374 17.9709C131.52 18.127 131.696 18.2511 131.892 18.3352C132.087 18.4192 132.299 18.4614 132.512 18.459C132.785 18.4918 133.062 18.4426 133.307 18.3177C133.552 18.1928 133.755 17.9977 133.889 17.7574L134.988 17.7574ZM130.97 15.8922H133.894C133.908 15.698 133.882 15.5029 133.816 15.3194C133.751 15.136 133.648 14.9683 133.513 14.8271C133.379 14.6859 133.217 14.5743 133.037 14.4995C132.857 14.4248 132.664 14.3884 132.469 14.3929C132.272 14.3904 132.076 14.4275 131.893 14.502C131.71 14.5765 131.543 14.6868 131.404 14.8265C131.264 14.9663 131.154 15.1326 131.079 15.3156C131.005 15.4986 130.968 15.6947 130.97 15.8922H130.97Z" fill="white">
                    </path>
                  </g>
                  <defs>
                    <clipPath id="clip0_949_545">
                      <rect width="153.806" height="51.4126" fill="white" transform="translate(0.337891 0.429199)">
                      </rect>
                    </clipPath>
                  </defs>
                </svg>
</a>
                <a href="https://play.google.com/store/apps/details?id=zenjob.android" id="appDlFooter-and" class="app-buttons-link app-button-link--google" title="Zenjob in Google Play Store" aria-label="Follow Zenjob onZenjob in Google Play Store" rel="nofollow noopener noreferrer" target="_blank">                <svg width="174" height="52" viewBox="0 0 174 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_949_525)">
                    <path d="M167.234 51.8418H6.57012C3.03551 51.8418 0.143555 48.9498 0.143555 45.4152V6.85581C0.143555 3.32119 3.03551 0.429237 6.57012 0.429237H167.234C170.769 0.429237 173.661 3.32119 173.661 6.85581V45.4152C173.661 48.9498 170.769 51.8418 167.234 51.8418Z" fill="#100F0D">
                    </path>
                    <path d="M167.234 0.429237H6.57012C3.03551 0.429237 0.143555 3.32119 0.143555 6.85581V45.4152C0.143555 48.9498 3.03551 51.8418 6.57012 51.8418H167.234C170.769 51.8418 173.661 48.9498 173.661 45.4152V6.85581C173.661 3.32119 170.769 0.429237 167.234 0.429237ZM167.234 1.45697C170.211 1.45697 172.633 3.87902 172.633 6.85581V45.4152C172.633 48.392 170.211 50.814 167.234 50.814H6.57012C3.59331 50.814 1.17231 48.392 1.17231 45.4152V6.85581C1.17231 3.87902 3.59331 1.45697 6.57012 1.45697H167.234Z" fill="#A2A2A1">
                    </path>
                    <path d="M59.3052 16.0181V13.9092H57.5697V13.0361H60.3571V16.4073C59.9469 16.6983 59.4946 16.9192 59.0002 17.07C58.5058 17.2172 57.9781 17.2909 57.4172 17.2909C56.19 17.2909 55.2293 16.9332 54.5351 16.218C53.8444 15.4992 53.499 14.5 53.499 13.2202C53.499 11.9369 53.8444 10.9377 54.5351 10.2224C55.2293 9.50367 56.19 9.14429 57.4172 9.14429C57.9291 9.14429 58.4147 9.2074 58.874 9.33362C59.3368 9.45984 59.7628 9.64567 60.152 9.8911V11.0218C59.7593 10.6888 59.342 10.4381 58.9003 10.2698C58.4585 10.1015 57.9939 10.0173 57.5066 10.0173C56.5459 10.0173 55.8236 10.2855 55.3398 10.822C54.8594 11.3584 54.6192 12.1578 54.6192 13.2202C54.6192 14.2791 54.8594 15.0767 55.3398 15.6132C55.8236 16.1496 56.5459 16.4178 57.5066 16.4178C57.8817 16.4178 58.2166 16.3863 58.5111 16.3232C58.8056 16.2565 59.0703 16.1549 59.3052 16.0181Z" fill="white">
                    </path>
                    <path d="M62.7949 9.28638H67.7596V10.1804H63.8573V12.505H67.5966V13.3991H63.8573V16.2444H67.8543V17.1384H62.7949V9.28638Z" fill="white">
                    </path>
                    <path d="M67.7588 9.28638H74.4012V10.1804H71.6138V17.1384H70.5462V10.1804H67.7588V9.28638Z" fill="white">
                    </path>
                    <path d="M77.4629 9.28638H78.5253V17.1384H77.4629V9.28638Z" fill="white">
                    </path>
                    <path d="M79.1328 9.28638H85.7752V10.1804H82.9878V17.1384H81.9202V10.1804H79.1328V9.28638Z" fill="white">
                    </path>
                    <path d="M91.8083 10.0068C91.037 10.0068 90.4234 10.2943 89.9676 10.8693C89.5153 11.4443 89.2892 12.228 89.2892 13.2202C89.2892 14.2089 89.5153 14.9908 89.9676 15.5658C90.4234 16.1408 91.037 16.4283 91.8083 16.4283C92.5797 16.4283 93.1898 16.1408 93.6386 15.5658C94.0909 14.9908 94.317 14.2089 94.317 13.2202C94.317 12.228 94.0909 11.4443 93.6386 10.8693C93.1898 10.2943 92.5797 10.0068 91.8083 10.0068ZM91.8083 9.14429C92.9093 9.14429 93.7893 9.51419 94.4485 10.254C95.1076 10.9903 95.4372 11.979 95.4372 13.2202C95.4372 14.4579 95.1076 15.4466 94.4485 16.1864C93.7893 16.9227 92.9093 17.2909 91.8083 17.2909C90.7039 17.2909 89.8203 16.9227 89.1577 16.1864C88.4985 15.4501 88.1689 14.4614 88.1689 13.2202C88.1689 11.979 88.4985 10.9903 89.1577 10.254C89.8203 9.51419 90.7039 9.14429 91.8083 9.14429Z" fill="white">
                    </path>
                    <path d="M97.5635 9.28638H98.994L102.476 15.8552V9.28638H103.506V17.1384H102.076L98.5943 10.5696V17.1384H97.5635V9.28638Z" fill="white">
                    </path>
                    <path d="M61.026 13.0192H57.2946V13.9431H60.0901C60.0157 14.6962 59.7146 15.2886 59.2084 15.7184C58.7024 16.1482 58.0577 16.3631 57.2946 16.3631C56.455 16.3631 55.7441 16.0739 55.1637 15.4935C54.5934 14.9011 54.3042 14.17 54.3042 13.2884C54.3042 12.4047 54.5934 11.6736 55.1637 11.0833C55.7441 10.5008 56.455 10.2116 57.2946 10.2116C57.7243 10.2116 58.132 10.2859 58.5096 10.4486C58.8852 10.6093 59.1863 10.8342 59.4233 11.1255L60.1323 10.4165C59.811 10.0509 59.4012 9.76984 58.8971 9.56496C58.3911 9.36214 57.8628 9.26574 57.2946 9.26574C56.1759 9.26574 55.2279 9.65134 54.4548 10.4265C53.6796 11.2017 53.292 12.1577 53.292 13.2884C53.292 14.417 53.6796 15.375 54.4548 16.1482C55.2279 16.9234 56.1759 17.311 57.2946 17.311C58.4654 17.311 59.4012 16.9334 60.1223 16.1703C60.7568 15.5356 61.0802 14.6761 61.0802 13.5997C61.0802 13.4169 61.0581 13.2221 61.026 13.0192V13.0192ZM62.5126 9.43643V17.1383H67.0072V16.1924H63.5007V13.7503H66.6638V12.8244H63.5007V10.3844H67.0072V9.43643H62.5126ZM73.3408 10.3844V9.43643H68.0489V10.3844H70.1999V17.1383H71.1879V10.3844H73.3408ZM78.1699 9.43643H77.1817V17.1383H78.1699V9.43643ZM84.7154 10.3844V9.43643H79.4236V10.3844H81.5744V17.1383H82.5625V10.3844H84.7154ZM94.7389 10.4365C93.9757 9.65134 93.0398 9.26574 91.9212 9.26574C90.8026 9.26574 89.8668 9.65134 89.1035 10.4265C88.3405 11.1897 87.9628 12.1477 87.9628 13.2884C87.9628 14.427 88.3405 15.385 89.1035 16.1482C89.8668 16.9234 90.8026 17.311 91.9212 17.311C93.0298 17.311 93.9757 16.9234 94.7389 16.1482C95.504 15.385 95.8796 14.427 95.8796 13.2884C95.8796 12.1577 95.504 11.2017 94.7389 10.4365V10.4365ZM89.8125 11.0833C90.3828 10.5008 91.0818 10.2116 91.9212 10.2116C92.7606 10.2116 93.4596 10.5008 94.0199 11.0833C94.5882 11.6536 94.8693 12.3947 94.8693 13.2884C94.8693 14.18 94.5882 14.9232 94.0199 15.4935C93.4596 16.0739 92.7606 16.3631 91.9212 16.3631C91.0818 16.3631 90.3828 16.0739 89.8125 15.4935C89.2542 14.9111 88.975 14.18 88.975 13.2884C88.975 12.3947 89.2542 11.6636 89.8125 11.0833ZM98.2695 12.3405L98.2272 10.8563H98.2695L102.186 17.1383H103.218V9.43643H102.228V13.9431L102.272 15.4272H102.228L98.4843 9.43643H97.2814V17.1383H98.2695V12.3405Z" stroke="white" stroke-width="0.281175" stroke-miterlimit="10">
                    </path>
                    <path d="M137.59 38.9886H139.988V22.9201H137.59V38.9886ZM159.192 28.7087L156.443 35.675H156.361L153.507 28.7087H150.924L155.204 38.4449L152.763 43.8613H155.264L161.859 28.7087H159.192ZM145.59 37.1636C144.806 37.1636 143.709 36.7704 143.709 35.799C143.709 34.5588 145.074 34.0834 146.252 34.0834C147.305 34.0834 147.803 34.3103 148.443 34.6206C148.257 36.1093 146.975 37.1636 145.59 37.1636ZM145.88 28.3572C144.144 28.3572 142.345 29.1223 141.601 30.8174L143.73 31.706C144.185 30.8174 145.032 30.5282 145.921 30.5282C147.162 30.5282 148.422 31.2717 148.443 32.5952V32.7604C148.009 32.5123 147.078 32.1403 145.942 32.1403C143.646 32.1403 141.311 33.401 141.311 35.7577C141.311 37.9077 143.192 39.2929 145.3 39.2929C146.912 39.2929 147.803 38.5694 148.359 37.7214H148.443V38.9625H150.759V32.8015C150.759 29.9488 148.628 28.3572 145.88 28.3572ZM131.058 30.6647H127.647V25.157H131.058C132.851 25.157 133.869 26.6411 133.869 27.9108C133.869 29.156 132.851 30.6647 131.058 30.6647ZM130.996 22.9201H125.249V38.9886H127.647V32.901H130.996C133.654 32.901 136.267 30.977 136.267 27.9108C136.267 24.8452 133.654 22.9201 130.996 22.9201ZM99.6584 37.1666C98.0015 37.1666 96.6147 35.7788 96.6147 33.8745C96.6147 31.9481 98.0015 30.5406 99.6584 30.5406C101.294 30.5406 102.578 31.9481 102.578 33.8745C102.578 35.7788 101.294 37.1666 99.6584 37.1666ZM102.412 29.6084H102.329C101.791 28.9666 100.755 28.3868 99.4516 28.3868C96.7177 28.3868 94.2124 30.7892 94.2124 33.8745C94.2124 36.9387 96.7177 39.32 99.4516 39.32C100.755 39.32 101.791 38.74 102.329 38.0779H102.412V38.8641C102.412 40.9563 101.294 42.0739 99.4927 42.0739C98.0231 42.0739 97.1119 41.018 96.7388 40.1278L94.6477 40.9974C95.2477 42.4464 96.8417 44.2278 99.4927 44.2278C102.309 44.2278 104.691 42.5709 104.691 38.5327V28.7182H102.412V29.6084ZM106.348 38.9886H108.748V22.9201H106.348V38.9886ZM112.29 33.6877C112.228 31.5754 113.926 30.499 115.147 30.499C116.1 30.499 116.907 30.9755 117.177 31.6584L112.29 33.6877ZM119.744 31.8652C119.289 30.6441 117.901 28.3868 115.065 28.3868C112.248 28.3868 109.908 30.6025 109.908 33.8534C109.908 36.9181 112.228 39.32 115.333 39.32C117.838 39.32 119.289 37.7881 119.889 36.8974L118.026 35.6548C117.404 36.5661 116.556 37.1666 115.333 37.1666C114.112 37.1666 113.242 36.6073 112.684 35.5098L119.992 32.4867L119.744 31.8652ZM61.5092 30.0642V32.3833H67.0586C66.8929 33.6877 66.4581 34.6402 65.7954 35.3029C64.9875 36.1102 63.7243 37.0009 61.5092 37.0009C58.0925 37.0009 55.4215 34.247 55.4215 30.8304C55.4215 27.4137 58.0925 24.6594 61.5092 24.6594C63.3522 24.6594 64.6978 25.3843 65.6919 26.3162L67.3282 24.68C65.9405 23.355 64.0978 22.3403 61.5092 22.3403C56.8287 22.3403 52.8945 26.1505 52.8945 30.8304C52.8945 35.5098 56.8287 39.32 61.5092 39.32C64.0351 39.32 65.9405 38.4916 67.4312 36.9387C68.9635 35.4063 69.44 33.2529 69.44 31.5132C69.44 30.9755 69.3982 30.4784 69.3154 30.0642H61.5092ZM75.7491 37.1666C74.0922 37.1666 72.6633 35.7999 72.6633 33.8534C72.6633 31.8862 74.0922 30.5406 75.7491 30.5406C77.4053 30.5406 78.8342 31.8862 78.8342 33.8534C78.8342 35.7999 77.4053 37.1666 75.7491 37.1666ZM75.7491 28.3868C72.725 28.3868 70.2613 30.6852 70.2613 33.8534C70.2613 37.0009 72.725 39.32 75.7491 39.32C78.772 39.32 81.2362 37.0009 81.2362 33.8534C81.2362 30.6852 78.772 28.3868 75.7491 28.3868ZM87.719 37.1666C86.0632 37.1666 84.6338 35.7999 84.6338 33.8534C84.6338 31.8862 86.0632 30.5406 87.719 30.5406C89.3759 30.5406 90.8042 31.8862 90.8042 33.8534C90.8042 35.7999 89.3759 37.1666 87.719 37.1666ZM87.719 28.3868C84.696 28.3868 82.2323 30.6852 82.2323 33.8534C82.2323 37.0009 84.696 39.32 87.719 39.32C90.743 39.32 93.2067 37.0009 93.2067 33.8534C93.2067 30.6852 90.743 28.3868 87.719 28.3868Z" fill="white">
                    </path>
                    <path d="M26.772 25.3953L13.0879 39.9194C13.0884 39.9224 13.0894 39.9249 13.0899 39.9279C13.5096 41.505 14.9501 42.6663 16.6597 42.6663C17.3431 42.6663 17.9847 42.4815 18.5349 42.1571L18.5786 42.1315L33.9818 33.2433L26.772 25.3953Z" fill="#EB3131">
                    </path>
                    <path d="M40.616 22.9223L40.6029 22.9133L33.9529 19.0582L26.4609 25.7249L33.979 33.2419L40.5939 29.4252C41.7536 28.7991 42.5409 27.5765 42.5409 26.1667C42.5409 24.767 41.7641 23.5504 40.616 22.9223Z" fill="#F6B60B">
                    </path>
                    <path d="M13.0864 12.3537C13.0042 12.657 12.9609 12.9747 12.9609 13.3047V38.9693C12.9609 39.2986 13.0037 39.6174 13.0869 39.9197L27.242 25.7672L13.0864 12.3537Z" fill="#5778C5">
                    </path>
                    <path d="M26.8724 26.1365L33.9553 19.0557L18.5695 10.1353C18.0103 9.80039 17.3576 9.60708 16.6592 9.60708C14.9496 9.60708 13.5072 10.7704 13.0874 12.3494C13.0869 12.351 13.0869 12.352 13.0869 12.3534L26.8724 26.1365Z" fill="#3BAD49">
                    </path>
                  </g>
                  <defs>
                    <clipPath id="clip0_949_525">
                      <rect width="173.517" height="51.4126" fill="white" transform="translate(0.143555 0.429199)">
                      </rect>
                    </clipPath>
                  </defs>
                </svg>
</a>
              </div>
            </div>
          </div>
          <div class="copyright themeBranded">
            <div class="container centerMaxWidthContainer container-copyright">
              <a href="https://www.zenjob.com/de/" class="logo" aria-label="Zenjob DE">              <svg width="112" height="36" viewBox="0 0 112 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M68.7054 29.2333C68.7054 32.4307 66.3075 34.356 63.547 34.356H58.9343V29.2694H61.8028V8.34342H68.7054V29.2333Z" fill="#ffffff">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M79.857 8.05187C85.1608 8.05191 89.4839 11.2491 89.484 17.7158C89.484 24.1826 85.3061 27.5252 79.857 27.5252C74.408 27.5252 70.1207 23.9282 70.1207 17.7158C70.1207 11.5767 74.5532 8.05187 79.857 8.05187ZM79.821 13.0661C78.1492 13.0661 77.0963 14.774 77.0963 17.7158C77.0963 20.6577 78.1863 22.548 79.821 22.548C81.4557 22.5479 82.5093 20.6587 82.5093 17.7158C82.5093 14.773 81.4928 13.0662 79.821 13.0661Z" fill="#ffffff">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M97.8389 11.2132H98.057C99.0016 9.57853 100.71 8.30645 103.325 8.30642C107.684 8.30642 110.591 12.23 110.591 18.0067C110.591 23.7834 107.684 27.5246 103.325 27.5246C100.636 27.5245 99.0376 26.2164 98.057 24.5817V24.5827H97.8389V27.2353H90.9363V1.76746H97.8389V11.2132ZM100.674 13.285C98.494 13.285 97.8398 15.6098 97.8398 17.8986C97.8398 20.1872 98.4939 22.5114 100.637 22.5119C102.635 22.5116 103.543 20.5137 103.543 17.9346C103.543 15.5006 102.744 13.285 100.674 13.285Z" fill="#ffffff">
                </path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8551 8.05187C34.1589 8.05191 38.482 11.176 38.482 17.6788V19.1324H25.9853C26.1666 21.5303 27.3296 22.8373 28.8551 22.8373C30.054 22.8372 30.8895 22.038 31.2892 20.6577H38.2275C37.2097 24.9449 33.4687 27.5242 28.8551 27.5243C23.5986 27.5243 19.2563 24.0388 19.1219 18.0042L19.1187 17.7158C19.1188 11.5767 23.5513 8.05187 28.8551 8.05187ZM28.8177 12.7025C27.3643 12.7026 26.3105 13.574 26.02 15.5363H31.4703C31.3251 14.0828 30.6348 12.7025 28.8177 12.7025Z" fill="#ffffff">
                </path>
                <path d="M52.5405 8.05283C56.2827 8.05283 58.934 10.5962 58.934 15.7187V27.2349H52.0317V16.8807C52.0317 14.5559 51.3415 13.2116 49.5976 13.2116C47.7084 13.2116 47.1635 14.8463 47.1635 17.2444V27.2349H40.2609V8.34342H47.1635V11.0678H47.3817C48.6899 8.88817 50.47 8.05283 52.5405 8.05283Z" fill="#ffffff">
                </path>
                <path d="M18.6109 12.6295L9.78299 21.8937V22.0752H18.4655V27.2337H1.39111V22.9837L10.0736 13.647V13.4288H1.82683V8.34214H18.6109V12.6295Z" fill="#ffffff">
                </path>
                <path d="M68.8148 6.34632H61.6937V1.80478H68.8148V6.34632Z" fill="#ffffff">
                </path>
              </svg>
</a>
              <nav class="copyright-menu">
                <ul class="menu">
                  <li>
                    <a class="menu-link" href="https://www.zenjob.com/de/agb/">                    AGB
</a>
                  </li>
                  <li>
                    <a class="menu-link" href="https://www.zenjob.com/de/datenschutz/">                    Datenschutzerklärung
</a>
                  </li>
                  <li>
                    <a class="menu-link" href="https://www.zenjob.com/de/impressum/">                    Impressum
</a>
                  </li>
                  <li>
                    <a class="menu-link" href="https://www.zenjob.com/de/barrierefreiheitserklaerung/">                    Barrierefreiheitserklärung
</a>
                  </li>
                  <li>
                    <a class="menu-link" href="https://www.zenjob.com/de/lieferkette/" target="_blank">                    Lieferkette
</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
    <div class="wpFooter">
      <link rel="stylesheet" id="interactive-geo-maps_main-css" href="https://www.zenjob.com/de/wp-content/plugins/interactive-geo-maps-premium/assets/css/styles.css?ver=1.5.0" media="all" />
      <script type="rocketlazyloadscript" id="rocket-browser-checker-js-after">
        &#34;use strict&#34;;var _createClass=function(){function defineProperties(target,props){for(var i=0;i&lt;props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,&#34;value&#34;in descriptor&amp;&amp;(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&amp;&amp;defineProperties(Constructor.prototype,protoProps),staticProps&amp;&amp;defineProperties(Constructor,staticProps),Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError(&#34;Cannot call a class as a function&#34;)}var RocketBrowserCompatibilityChecker=function(){function RocketBrowserCompatibilityChecker(options){_classCallCheck(this,RocketBrowserCompatibilityChecker),this.passiveSupported=!1,this._checkPassiveOption(this),this.options=!!this.passiveSupported&amp;&amp;options}return _createClass(RocketBrowserCompatibilityChecker,[{key:&#34;_checkPassiveOption&#34;,value:function(self){try{var options={get passive(){return!(self.passiveSupported=!0)}};window.addEventListener(&#34;test&#34;,null,options),window.removeEventListener(&#34;test&#34;,null,options)}catch(err){self.passiveSupported=!1}}},{key:&#34;initRequestIdleCallback&#34;,value:function(){!1 in window&amp;&amp;(window.requestIdleCallback=function(cb){var start=Date.now();return setTimeout(function(){cb({didTimeout:!1,timeRemaining:function(){return Math.max(0,50-(Date.now()-start))}})},1)}),!1 in window&amp;&amp;(window.cancelIdleCallback=function(id){return clearTimeout(id)})}},{key:&#34;isDataSaverModeOn&#34;,value:function(){return&#34;connection&#34;in navigator&amp;&amp;!0===navigator.connection.saveData}},{key:&#34;supportsLinkPrefetch&#34;,value:function(){var elem=document.createElement(&#34;link&#34;);return elem.relList&amp;&amp;elem.relList.supports&amp;&amp;elem.relList.supports(&#34;prefetch&#34;)&amp;&amp;window.IntersectionObserver&amp;&amp;&#34;isIntersecting&#34;in IntersectionObserverEntry.prototype}},{key:&#34;isSlowConnection&#34;,value:function(){return&#34;connection&#34;in navigator&amp;&amp;&#34;effectiveType&#34;in navigator.connection&amp;&amp;(&#34;2g&#34;===navigator.connection.effectiveType||&#34;slow-2g&#34;===navigator.connection.effectiveType)}}]),RocketBrowserCompatibilityChecker}();
      </script>
      <script id="rocket-preload-links-js-extra">
        var RocketPreloadLinksConfig = {&#34;excludeUris&#34;:&#34;\/(?:.+\/)?feed(?:\/(?:.+\/?)?)?$|\/(?:.+\/)?embed\/|\/(index.php\/)?(.*)wp-json(\/.*|$)|\/refer\/|\/go\/|\/recommend\/|\/recommends\/&#34;,&#34;usesTrailingSlash&#34;:&#34;1&#34;,&#34;imageExt&#34;:&#34;jpg|jpeg|gif|png|tiff|bmp|webp|avif|pdf|doc|docx|xls|xlsx|php&#34;,&#34;fileExt&#34;:&#34;jpg|jpeg|gif|png|tiff|bmp|webp|avif|pdf|doc|docx|xls|xlsx|php|html|htm&#34;,&#34;siteUrl&#34;:&#34;https:\/\/www.zenjob.com\/de&#34;,&#34;onHoverDelay&#34;:&#34;100&#34;,&#34;rateThrottle&#34;:&#34;3&#34;};
      </script>
      <script type="rocketlazyloadscript" id="rocket-preload-links-js-after">
        (function() {
&#34;use strict&#34;;var r=&#34;function&#34;==typeof Symbol&amp;&amp;&#34;symbol&#34;==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&amp;&amp;&#34;function&#34;==typeof Symbol&amp;&amp;e.constructor===Symbol&amp;&amp;e!==Symbol.prototype?&#34;symbol&#34;:typeof e},e=function(){function i(e,t){for(var n=0;n&lt;t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,&#34;value&#34;in i&amp;&amp;(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(e,t,n){return t&amp;&amp;i(e.prototype,t),n&amp;&amp;i(e,n),e}}();function i(e,t){if(!(e instanceof t))throw new TypeError(&#34;Cannot call a class as a function&#34;)}var t=function(){function n(e,t){i(this,n),this.browser=e,this.config=t,this.options=this.browser.options,this.prefetched=new Set,this.eventTime=null,this.threshold=1111,this.numOnHover=0}return e(n,[{key:&#34;init&#34;,value:function(){!this.browser.supportsLinkPrefetch()||this.browser.isDataSaverModeOn()||this.browser.isSlowConnection()||(this.regex={excludeUris:RegExp(this.config.excludeUris,&#34;i&#34;),images:RegExp(&#34;.(&#34;+this.config.imageExt+&#34;)$&#34;,&#34;i&#34;),fileExt:RegExp(&#34;.(&#34;+this.config.fileExt+&#34;)$&#34;,&#34;i&#34;)},this._initListeners(this))}},{key:&#34;_initListeners&#34;,value:function(e){-1&lt;this.config.onHoverDelay&amp;&amp;document.addEventListener(&#34;mouseover&#34;,e.listener.bind(e),e.listenerOptions),document.addEventListener(&#34;mousedown&#34;,e.listener.bind(e),e.listenerOptions),document.addEventListener(&#34;touchstart&#34;,e.listener.bind(e),e.listenerOptions)}},{key:&#34;listener&#34;,value:function(e){var t=e.target.closest(&#34;a&#34;),n=this._prepareUrl(t);if(null!==n)switch(e.type){case&#34;mousedown&#34;:case&#34;touchstart&#34;:this._addPrefetchLink(n);break;case&#34;mouseover&#34;:this._earlyPrefetch(t,n,&#34;mouseout&#34;)}}},{key:&#34;_earlyPrefetch&#34;,value:function(t,e,n){var i=this,r=setTimeout(function(){if(r=null,0===i.numOnHover)setTimeout(function(){return i.numOnHover=0},1e3);else if(i.numOnHover&gt;i.config.rateThrottle)return;i.numOnHover++,i._addPrefetchLink(e)},this.config.onHoverDelay);t.addEventListener(n,function e(){t.removeEventListener(n,e,{passive:!0}),null!==r&amp;&amp;(clearTimeout(r),r=null)},{passive:!0})}},{key:&#34;_addPrefetchLink&#34;,value:function(i){return this.prefetched.add(i.href),new Promise(function(e,t){var n=document.createElement(&#34;link&#34;);n.rel=&#34;prefetch&#34;,n.href=i.href,n.onload=e,n.onerror=t,document.head.appendChild(n)}).catch(function(){})}},{key:&#34;_prepareUrl&#34;,value:function(e){if(null===e||&#34;object&#34;!==(void 0===e?&#34;undefined&#34;:r(e))||!1 in e||-1===[&#34;http:&#34;,&#34;https:&#34;].indexOf(e.protocol))return null;var t=e.href.substring(0,this.config.siteUrl.length),n=this._getPathname(e.href,t),i={original:e.href,protocol:e.protocol,origin:t,pathname:n,href:t+n};return this._isLinkOk(i)?i:null}},{key:&#34;_getPathname&#34;,value:function(e,t){var n=t?e.substring(this.config.siteUrl.length):e;return n.startsWith(&#34;/&#34;)||(n=&#34;/&#34;+n),this._shouldAddTrailingSlash(n)?n+&#34;/&#34;:n}},{key:&#34;_shouldAddTrailingSlash&#34;,value:function(e){return this.config.usesTrailingSlash&amp;&amp;!e.endsWith(&#34;/&#34;)&amp;&amp;!this.regex.fileExt.test(e)}},{key:&#34;_isLinkOk&#34;,value:function(e){return null!==e&amp;&amp;&#34;object&#34;===(void 0===e?&#34;undefined&#34;:r(e))&amp;&amp;(!this.prefetched.has(e.href)&amp;&amp;e.origin===this.config.siteUrl&amp;&amp;-1===e.href.indexOf(&#34;?&#34;)&amp;&amp;-1===e.href.indexOf(&#34;#&#34;)&amp;&amp;!this.regex.excludeUris.test(e.href)&amp;&amp;!this.regex.images.test(e.href))}}],[{key:&#34;run&#34;,value:function(){&#34;undefined&#34;!=typeof RocketPreloadLinksConfig&amp;&amp;new n(new RocketBrowserCompatibilityChecker({capture:!0,passive:!0}),RocketPreloadLinksConfig).init()}}]),n}();t.run();
}());
      </script>
      <script id="Flynt/assets-js-extra">
        var FlyntData = {&#34;templateDirectoryUri&#34;:&#34;https:\/\/www.zenjob.com\/de\/wp-content\/themes\/zenjob-website-2022&#34;,&#34;componentsWithScript&#34;:{&#34;AbTestComponent&#34;:&#34;AbTestComponent&#34;,&#34;BlockAccordion&#34;:&#34;BlockAccordion&#34;,&#34;BlockCitiesDropdown&#34;:&#34;BlockCitiesDropdown&#34;,&#34;BlockEmbedInteract&#34;:&#34;BlockEmbedInteract&#34;,&#34;BlockIframe&#34;:&#34;BlockIframe&#34;,&#34;BlockJobTypes&#34;:&#34;BlockJobTypes&#34;,&#34;BlockTabs&#34;:&#34;BlockTabs&#34;,&#34;BlockTalents&#34;:&#34;BlockTalents&#34;,&#34;BlockTextImage&#34;:&#34;BlockTextImage&#34;,&#34;BlockToTop&#34;:&#34;BlockToTop&#34;,&#34;BlockTopBar&#34;:&#34;BlockTopBar&#34;,&#34;ElementQrCode&#34;:&#34;ElementQrCode&#34;,&#34;ElementVideoBlock&#34;:&#34;ElementVideoBlock&#34;,&#34;ElementVideoOverlay&#34;:&#34;ElementVideoOverlay&#34;,&#34;FormApply&#34;:&#34;FormApply&#34;,&#34;FormCompanySignup&#34;:&#34;FormCompanySignup&#34;,&#34;FormDownload&#34;:&#34;FormDownload&#34;,&#34;FormLongTailSignup&#34;:&#34;FormLongTailSignup&#34;,&#34;FormProSignup&#34;:&#34;FormProSignup&#34;,&#34;GridImageText&#34;:&#34;GridImageText&#34;,&#34;GridPosts&#34;:&#34;GridPosts&#34;,&#34;GridPostsArchive&#34;:&#34;GridPostsArchive&#34;,&#34;HeroSlider&#34;:&#34;HeroSlider&#34;,&#34;ListComponents&#34;:&#34;ListComponents&#34;,&#34;ListJobs&#34;:&#34;ListJobs&#34;,&#34;NavigationAnchors&#34;:&#34;NavigationAnchors&#34;,&#34;NavigationFooter&#34;:&#34;NavigationFooter&#34;,&#34;NavigationMain&#34;:&#34;NavigationMain&#34;,&#34;NavigationPartner&#34;:&#34;NavigationPartner&#34;,&#34;SliderBenefits&#34;:&#34;SliderBenefits&#34;,&#34;SliderCta&#34;:&#34;SliderCta&#34;,&#34;SliderJobs&#34;:&#34;SliderJobs&#34;,&#34;SliderJobsLocations&#34;:&#34;SliderJobsLocations&#34;,&#34;SliderLogos&#34;:&#34;SliderLogos&#34;,&#34;SliderSteps&#34;:&#34;SliderSteps&#34;,&#34;SliderTextLogo&#34;:&#34;SliderTextLogo&#34;},&#34;segment&#34;:{&#34;apiWriteKey&#34;:&#34;FtEAV5ooUZYMeoM9TqHCz4YZrQSe0GIA&#34;,&#34;sectionName&#34;:&#34;homepage&#34;,&#34;successStoryName&#34;:null,&#34;companySectionName&#34;:&#34;company_signup&#34;},&#34;absmartly&#34;:{&#34;endpoint&#34;:&#34;https:\/\/zenjob.absmartly.io\/v1&#34;,&#34;apiKey&#34;:&#34;pBXf9nnTto7Xk_ZvVI7D-oGBYZ__-heeJBfnOjmqmB2VxrtltBX1hXlXtB66tlTr&#34;,&#34;environment&#34;:&#34;Production&#34;,&#34;application&#34;:&#34;zenjob-website&#34;}};
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://www.zenjob.com/de/wp-content/themes/zenjob-website-2022/dist/assets/main.2a5be00d19d8511eecc9.js?ver=6.4.3" id="Flynt/assets-js" defer="">
      </script>
      <script id="Flynt/absmartly-js-extra">
        var FlyntABsmartlyData = {&#34;endpoint&#34;:&#34;https:\/\/zenjob.absmartly.io\/v1&#34;,&#34;apiKey&#34;:&#34;pBXf9nnTto7Xk_ZvVI7D-oGBYZ__-heeJBfnOjmqmB2VxrtltBX1hXlXtB66tlTr&#34;,&#34;environment&#34;:&#34;Production&#34;,&#34;application&#34;:&#34;zenjob-website&#34;};
      </script>
      <script src="https://www.zenjob.com/de/wp-content/themes/zenjob-website-2022/dist/assets/absmartly.b4878eee52cd5d288ad2.js?ver=6.4.3" id="Flynt/absmartly-js" async="" data-wp-strategy="async">
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://cdn.amcharts.com/lib/version/4.9.30/core.js?ver=1.5.0" id="interactive-geo-maps_amcharts_core-js">
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://cdn.amcharts.com/lib/version/4.9.30/maps.js?ver=1.5.0" id="interactive-geo-maps_amcharts_maps-js">
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://cdn.amcharts.com/lib/version/4.9.30/themes/animated.js?ver=1.5.0" id="interactive-geo-maps_amcharts_animated-js">
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://cdn.amcharts.com/lib/4/geodata/germanyHigh.js?ver=1.5.0" id="interactive-geo-maps_germanyHigh-js">
      </script>
      <script id="interactive-geo-maps_map_service-js-extra">
        var iMapsData = {&#34;options&#34;:{&#34;animations&#34;:true,&#34;lazyLoad&#34;:true,&#34;async&#34;:false,&#34;hold&#34;:false,&#34;locale&#34;:false},&#34;data&#34;:[{&#34;map&#34;:&#34;germanyHigh&#34;,&#34;mapURL&#34;:&#34;https:\/\/cdn.amcharts.com\/lib\/4\/geodata\/germanyHigh.js&#34;,&#34;usaWarning&#34;:&#34;&#34;,&#34;projection&#34;:&#34;Miller&#34;,&#34;albersUsaWarning&#34;:&#34;&#34;,&#34;description&#34;:&#34;&#34;,&#34;grid&#34;:{&#34;color&#34;:&#34;#cccccc&#34;,&#34;projectionBackgroundColor&#34;:&#34;#cccccc&#34;},&#34;visual&#34;:{&#34;backgroundColor&#34;:&#34;transparent&#34;,&#34;borderColor&#34;:&#34;#ffffff&#34;,&#34;borderWidth&#34;:&#34;1&#34;,&#34;paddingTop&#34;:&#34;100&#34;,&#34;maxWidth&#34;:&#34;2000&#34;,&#34;fontFamily&#34;:&#34;inherit&#34;,&#34;bgImage&#34;:{&#34;url&#34;:&#34;&#34;,&#34;id&#34;:&#34;&#34;,&#34;width&#34;:&#34;&#34;,&#34;height&#34;:&#34;&#34;,&#34;thumbnail&#34;:&#34;&#34;,&#34;alt&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;,&#34;description&#34;:&#34;&#34;}},&#34;viewport&#34;:{&#34;zoomLevel&#34;:&#34;1&#34;,&#34;homeGeoPoint&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;&#34;,&#34;longitude&#34;:&#34;&#34;},&#34;offset&#34;:{&#34;latitude&#34;:&#34;0&#34;,&#34;longitude&#34;:&#34;0&#34;}},&#34;regions_info&#34;:&#34;&#34;,&#34;regions&#34;:[{&#34;name&#34;:&#34;Berlin&#34;,&#34;id&#34;:&#34;DE-BE&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;name&#34;:&#34;Bremen&#34;,&#34;id&#34;:&#34;DE-HB&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;name&#34;:&#34;NRW&#34;,&#34;id&#34;:&#34;DE-NW&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;name&#34;:&#34;Hessen&#34;,&#34;id&#34;:&#34;DE-HE&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;name&#34;:&#34;Bayern&#34;,&#34;id&#34;:&#34;DE-BY&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;name&#34;:&#34;Bavaria&#34;,&#34;id&#34;:&#34;DE-BY&#34;,&#34;tooltipContent&#34;:&#34;&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;fill&#34;:&#34;#99d8c9&#34;,&#34;hover&#34;:&#34;#2ca25f&#34;,&#34;action&#34;:&#34;default&#34;,&#34;value&#34;:&#34;&#34;}],&#34;regionDefaults&#34;:{&#34;fill&#34;:&#34;#2d31ff&#34;,&#34;hover&#34;:&#34;#2d31ff&#34;,&#34;inactiveColor&#34;:&#34;#2d31ff&#34;,&#34;action&#34;:&#34;none&#34;,&#34;customAction&#34;:&#34;&#34;,&#34;triggerClickOnHover&#34;:&#34;&#34;},&#34;onlyIncludeActive&#34;:&#34;&#34;,&#34;include&#34;:&#34;&#34;,&#34;exclude&#34;:&#34;AQ&#34;,&#34;regionsDataSource&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;categories&#34;,&#34;raw&#34;:&#34;&#34;,&#34;google_api_key&#34;:&#34;&#34;,&#34;google_sheet_id&#34;:&#34;&#34;,&#34;google_sheet_range&#34;:&#34;Sheet1&#34;,&#34;google_data_id&#34;:&#34;&#34;,&#34;google_data_content&#34;:&#34;&#34;,&#34;json&#34;:&#34;&#34;,&#34;json_id&#34;:&#34;id&#34;,&#34;json_data_source&#34;:&#34;&#34;,&#34;json_action_content&#34;:&#34;&#34;,&#34;custom_tax&#34;:&#34;&#34;,&#34;categoriesIncludeEmpty&#34;:&#34;&#34;,&#34;tagsIncludeEmpty&#34;:&#34;&#34;},&#34;regionActiveState&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;source&#34;:&#34;hover&#34;,&#34;fill&#34;:&#34;#99d8c9&#34;},&#34;regionLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;regionLabels&#34;:{&#34;source&#34;:&#34;0&#34;,&#34;customSource&#34;:&#34;name&#34;,&#34;activeOnly&#34;:&#34;1&#34;,&#34;fontSize&#34;:&#34;15&#34;,&#34;mobileFontSize&#34;:&#34;100&#34;,&#34;fill&#34;:&#34;#111111&#34;,&#34;hover&#34;:&#34;#000000&#34;,&#34;horizontalCenter&#34;:&#34;middle&#34;,&#34;verticalCenter&#34;:&#34;middle&#34;,&#34;nonScaling&#34;:&#34;1&#34;,&#34;regionLabelCustomCoordinates&#34;:&#34;&#34;},&#34;regionsGroupHover&#34;:&#34;&#34;,&#34;heatMapRegions&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;gradient&#34;,&#34;minColor&#34;:&#34;#f5f5f5&#34;,&#34;maxColor&#34;:&#34;#333333&#34;,&#34;legend&#34;:&#34;&#34;,&#34;minLabel&#34;:&#34;Min&#34;,&#34;maxLabel&#34;:&#34;Max&#34;,&#34;label&#34;:&#34;&#34;,&#34;noHover&#34;:&#34;&#34;,&#34;source&#34;:&#34;value&#34;},&#34;regionsTooltipTemplate&#34;:&#34;&#34;,&#34;roundMarkers_info&#34;:&#34;&#34;,&#34;roundMarkers&#34;:[{&#34;id&#34;:&#34;Aachen &#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.775345&#34;,&#34;longitude&#34;:&#34;6.083887&#34;},&#34;tooltipContent&#34;:&#34;Aachen&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Aschaffenburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.973019&#34;,&#34;longitude&#34;:&#34;9.149010&#34;},&#34;tooltipContent&#34;:&#34;Aschaffenburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Augsburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;48.370544&#34;,&#34;longitude&#34;:&#34;10.897790&#34;},&#34;tooltipContent&#34;:&#34;Augsburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Berlin&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;52.520008&#34;,&#34;longitude&#34;:&#34;13.404954&#34;},&#34;tooltipContent&#34;:&#34;Berlin&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/berlin\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Bielefeld&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;52.023071&#34;,&#34;longitude&#34;:&#34;8.533210&#34;},&#34;tooltipContent&#34;:&#34;Bielefeld&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Bochum&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.48221971019216&#34;,&#34;longitude&#34;:&#34;7.212853161214223&#34;},&#34;tooltipContent&#34;:&#34;Bochum&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Bonn&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.73409129242429&#34;,&#34;longitude&#34;:&#34;7.086188074706502&#34;},&#34;tooltipContent&#34;:&#34;Bonn&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/bonn\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Braunschweig&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;52.266716372470405&#34;,&#34;longitude&#34;:&#34;10.521776612862935&#34;},&#34;tooltipContent&#34;:&#34;Braunschweig&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Bremen&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;53.083258024509675&#34;,&#34;longitude&#34;:&#34;8.822797205275698&#34;},&#34;tooltipContent&#34;:&#34;Bremen&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Darmstadt&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.87673058859185&#34;,&#34;longitude&#34;:&#34;8.645893315297263&#34;},&#34;tooltipContent&#34;:&#34;Darmstadt&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Dortmund&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.51448744953307&#34;,&#34;longitude&#34;:&#34;7.463737821360281&#34;},&#34;tooltipContent&#34;:&#34;Dortmund&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Dresden&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.05172181201026&#34;,&#34;longitude&#34;:&#34;13.737560612523302&#34;},&#34;tooltipContent&#34;:&#34;Dresden&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;D\u00fcsseldorf&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.21902176280611&#34;,&#34;longitude&#34;:&#34;6.826703668033598&#34;},&#34;tooltipContent&#34;:&#34;D\u00fcsseldorf&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Duisburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.43459013696268&#34;,&#34;longitude&#34;:&#34;6.760196711101507&#34;},&#34;tooltipContent&#34;:&#34;Duisburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Erfurt&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.977538190306426&#34;,&#34;longitude&#34;:&#34;11.027350233395731&#34;},&#34;tooltipContent&#34;:&#34;Erfurt&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Essen&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.45607789720116&#34;,&#34;longitude&#34;:&#34;7.006746937600573&#34;},&#34;tooltipContent&#34;:&#34;Essen&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Frankfurt am Main&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.115844410362634&#34;,&#34;longitude&#34;:&#34;8.657843526357967&#34;},&#34;tooltipContent&#34;:&#34;Frankfurt am Main&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/frankfurt-am-main\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Freiburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;48.00084536057923&#34;,&#34;longitude&#34;:&#34;7.838647098782464&#34;},&#34;tooltipContent&#34;:&#34;Freiburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Gie\u00dfen&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.5838211443135&#34;,&#34;longitude&#34;:&#34; 8.678171230808232&#34;},&#34;tooltipContent&#34;:&#34;Gie\u00dfen&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Halle&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.48120115592412&#34;,&#34;longitude&#34;:&#34;11.973401470312636&#34;},&#34;tooltipContent&#34;:&#34;Halle&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Hamburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;53.513192525591094&#34;,&#34;longitude&#34;:&#34;9.99922675947916&#34;},&#34;tooltipContent&#34;:&#34;Hamburg&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/hamburg\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Hannover&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;52.370213896979166&#34;,&#34;longitude&#34;:&#34;9.734347433390186&#34;},&#34;tooltipContent&#34;:&#34;Hannover&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Heidelberg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.399228234118524&#34;,&#34;longitude&#34;:&#34; 8.67365618386232&#34;},&#34;tooltipContent&#34;:&#34;Heidelberg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Kiel&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;54.32451611867036&#34;,&#34;longitude&#34;:&#34;10.124297939106736&#34;},&#34;tooltipContent&#34;:&#34;Kiel&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Koblenz&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.360729816267046&#34;,&#34;longitude&#34;:&#34;7.595076251402781&#34;},&#34;tooltipContent&#34;:&#34;Koblenz&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;K\u00f6ln&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.937286449500206&#34;,&#34;longitude&#34;:&#34;6.954956548231478&#34;},&#34;tooltipContent&#34;:&#34;K\u00f6ln&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/koeln\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Krefeld&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.3396087713014&#34;,&#34;longitude&#34;:&#34;6.589333416622613&#34;},&#34;tooltipContent&#34;:&#34;Krefeld&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Leipzig&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.33826740927045&#34;,&#34;longitude&#34;:&#34;12.367536235095772&#34;},&#34;tooltipContent&#34;:&#34;Leipzig&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Mainz&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.99362546492145&#34;,&#34;longitude&#34;:&#34;8.243902299651682&#34;},&#34;tooltipContent&#34;:&#34;Mainz&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Mannheim&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.49020748928511&#34;,&#34;longitude&#34;:&#34;8.46911456387597&#34;},&#34;tooltipContent&#34;:&#34;Mannheim&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;M\u00fcnchen&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;48.13495937250753&#34;,&#34;longitude&#34;:&#34;11.575479735239671&#34;},&#34;tooltipContent&#34;:&#34;M\u00fcnchen&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/muenchen\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;M\u00fcnster&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.95888889118056&#34;,&#34;longitude&#34;:&#34;7.626151021889773&#34;},&#34;tooltipContent&#34;:&#34;M\u00fcnster&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;N\u00fcrnberg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.44404572613368&#34;,&#34;longitude&#34;:&#34;11.072606137448481&#34;},&#34;tooltipContent&#34;:&#34;N\u00fcrnberg&#34;,&#34;content&#34;:&#34;\/de\/personal\/region\/nuernberg\/&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Offenbach&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.096096557415464&#34;,&#34;longitude&#34;:&#34;8.773117725040464&#34;},&#34;tooltipContent&#34;:&#34;Offenbach&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Paderborn&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;51.7171643141414&#34;,&#34;longitude&#34;:&#34;8.75778800506479&#34;},&#34;tooltipContent&#34;:&#34;Paderborn&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Potsdam&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;52.39064316974821&#34;,&#34;longitude&#34;:&#34;13.057279857349542&#34;},&#34;tooltipContent&#34;:&#34;Potsdam&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Stuttgart&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;48.77443663449359&#34;,&#34;longitude&#34;:&#34;9.170347120855554&#34;},&#34;tooltipContent&#34;:&#34;Stuttgart&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Wiesbaden&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;50.082816852748216&#34;,&#34;longitude&#34;:&#34;8.237708807287508&#34;},&#34;tooltipContent&#34;:&#34;Wiesbaden&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;W\u00fcrzburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.7913&#34;,&#34;longitude&#34;:&#34;9.9534&#34;},&#34;tooltipContent&#34;:&#34;W\u00fcrzburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Karlsruhe&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.0068901&#34;,&#34;longitude&#34;:&#34;8.4036527 &#34;},&#34;tooltipContent&#34;:&#34;Karlsruhe&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;&#34;,&#34;fill&#34;:&#34;&#34;,&#34;hover&#34;:&#34;&#34;,&#34;action&#34;:&#34;none&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Regensburg&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;49.013432&#34;,&#34;longitude&#34;:&#34;12.101624&#34;},&#34;tooltipContent&#34;:&#34;Regensburg&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;10&#34;,&#34;fill&#34;:&#34;#99d8c9&#34;,&#34;hover&#34;:&#34;#2ca25f&#34;,&#34;action&#34;:&#34;default&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Ulm&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;48.400002&#34;,&#34;longitude&#34;:&#34;9.983333&#34;},&#34;tooltipContent&#34;:&#34;Ulm&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;10&#34;,&#34;fill&#34;:&#34;#99d8c9&#34;,&#34;hover&#34;:&#34;#2ca25f&#34;,&#34;action&#34;:&#34;default&#34;,&#34;value&#34;:&#34;&#34;},{&#34;id&#34;:&#34;Konstanz&#34;,&#34;coordinates&#34;:{&#34;name&#34;:&#34;&#34;,&#34;latitude&#34;:&#34;47.8167&#34;,&#34;longitude&#34;:&#34;8.8833&#34;},&#34;tooltipContent&#34;:&#34;Konstanz&#34;,&#34;content&#34;:&#34;&#34;,&#34;useDefaults&#34;:&#34;1&#34;,&#34;radius&#34;:&#34;10&#34;,&#34;fill&#34;:&#34;#99d8c9&#34;,&#34;hover&#34;:&#34;#2ca25f&#34;,&#34;action&#34;:&#34;default&#34;,&#34;value&#34;:&#34;&#34;}],&#34;markerDefaults&#34;:{&#34;radius&#34;:&#34;4&#34;,&#34;fill&#34;:&#34;#dfff6d&#34;,&#34;hover&#34;:&#34;#ffffff&#34;,&#34;action&#34;:&#34;open_url_new&#34;,&#34;customAction&#34;:&#34;&#34;,&#34;triggerClickOnHover&#34;:&#34;&#34;},&#34;markersDataSource&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;raw_legacy&#34;,&#34;google_api_key&#34;:&#34;&#34;,&#34;google_sheet_id&#34;:&#34;&#34;,&#34;google_sheet_range&#34;:&#34;Sheet1&#34;,&#34;google_data_id&#34;:&#34;&#34;,&#34;google_data_latitude&#34;:&#34;&#34;,&#34;google_data_longitude&#34;:&#34;&#34;,&#34;google_data_content&#34;:&#34;&#34;,&#34;raw&#34;:&#34;&#34;,&#34;json&#34;:&#34;&#34;,&#34;json_data_source&#34;:&#34;&#34;,&#34;json_id&#34;:&#34;id&#34;,&#34;json_lat&#34;:&#34;latitude&#34;,&#34;json_lon&#34;:&#34;longitude&#34;,&#34;json_action_content&#34;:&#34;&#34;},&#34;roundMarkerLabels&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;fontSize&#34;:&#34;15&#34;,&#34;fill&#34;:&#34;#111111&#34;},&#34;heatMapMarkers&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;gradient&#34;,&#34;minRadius&#34;:&#34;8&#34;,&#34;maxRadius&#34;:&#34;25&#34;,&#34;minColor&#34;:&#34;#f5f5f5&#34;,&#34;maxColor&#34;:&#34;#333333&#34;,&#34;legend&#34;:&#34;&#34;,&#34;minLabel&#34;:&#34;Min&#34;,&#34;maxLabel&#34;:&#34;Max&#34;,&#34;source&#34;:&#34;value&#34;},&#34;clusterMarkers&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;zoomLevel&#34;:&#34;5&#34;,&#34;maxBias&#34;:&#34;0.5&#34;,&#34;tooltipTemplate&#34;:&#34;&#34;},&#34;roundMarkersLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;roundMarkersMobileSize&#34;:&#34;100&#34;,&#34;roundMarkersTooltipTemplate&#34;:&#34;&#34;,&#34;imageMarkers_info&#34;:&#34;&#34;,&#34;imageMarkers&#34;:&#34;&#34;,&#34;imageMarkerDefaults&#34;:{&#34;image&#34;:{&#34;url&#34;:&#34;&#34;,&#34;id&#34;:&#34;&#34;,&#34;width&#34;:&#34;&#34;,&#34;height&#34;:&#34;&#34;,&#34;thumbnail&#34;:&#34;&#34;,&#34;alt&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;,&#34;description&#34;:&#34;&#34;},&#34;size&#34;:&#34;20&#34;,&#34;nonScaling&#34;:&#34;1&#34;,&#34;horizontalCenter&#34;:&#34;middle&#34;,&#34;verticalCenter&#34;:&#34;middle&#34;,&#34;action&#34;:&#34;none&#34;,&#34;customAction&#34;:&#34;&#34;,&#34;triggerClickOnHover&#34;:&#34;&#34;},&#34;imageMarkersLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;imageMarkersMobileSize&#34;:&#34;100&#34;,&#34;imageMarkersTooltipTemplate&#34;:&#34;&#34;,&#34;iconMarkers_info&#34;:&#34;&#34;,&#34;iconMarkers&#34;:&#34;&#34;,&#34;iconMarkerDefaults&#34;:{&#34;icon&#34;:&#34;fa fa-star&#34;,&#34;horizontalCenter&#34;:&#34;middle&#34;,&#34;verticalCenter&#34;:&#34;middle&#34;,&#34;scale&#34;:&#34;1&#34;,&#34;rotation&#34;:&#34;0&#34;,&#34;fill&#34;:&#34;#3182bd&#34;,&#34;hover&#34;:&#34;#2171b5&#34;,&#34;action&#34;:&#34;none&#34;,&#34;customAction&#34;:&#34;&#34;,&#34;triggerClickOnHover&#34;:&#34;&#34;},&#34;iconMarkerLabels&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;fontSize&#34;:&#34;15&#34;,&#34;fill&#34;:&#34;#111111&#34;},&#34;iconMarkersDataSource&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;raw_legacy&#34;,&#34;raw&#34;:&#34;&#34;,&#34;json&#34;:&#34;&#34;,&#34;json_data_source&#34;:&#34;&#34;,&#34;json_id&#34;:&#34;id&#34;,&#34;json_lat&#34;:&#34;latitude&#34;,&#34;json_lon&#34;:&#34;longitude&#34;,&#34;json_action_content&#34;:&#34;&#34;},&#34;iconMarkersLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;iconMarkersMobileSize&#34;:&#34;100&#34;,&#34;iconMarkersTooltipTemplate&#34;:&#34;&#34;,&#34;labels&#34;:&#34;&#34;,&#34;labelDefaults&#34;:{&#34;fontSize&#34;:&#34;15&#34;,&#34;fill&#34;:&#34;#111111&#34;,&#34;hover&#34;:&#34;#000000&#34;,&#34;action&#34;:&#34;none&#34;,&#34;customAction&#34;:&#34;&#34;,&#34;triggerClickOnHover&#34;:&#34;&#34;},&#34;labelPosition&#34;:{&#34;horizontalCenter&#34;:&#34;middle&#34;,&#34;verticalCenter&#34;:&#34;middle&#34;},&#34;labelStyle&#34;:{&#34;fontFamily&#34;:&#34;inherit&#34;,&#34;fontWeight&#34;:&#34;normal&#34;},&#34;labelsLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;labelsMobileSize&#34;:&#34;100&#34;,&#34;labelsTooltipTemplate&#34;:&#34;&#34;,&#34;lines_info&#34;:&#34;&#34;,&#34;lines&#34;:&#34;&#34;,&#34;lineDefaults&#34;:{&#34;stroke&#34;:&#34;#CCC&#34;,&#34;strokeDash&#34;:&#34;2&#34;,&#34;strokeWidth&#34;:&#34;6&#34;,&#34;curvature&#34;:&#34;0&#34;},&#34;linesLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;title&#34;:&#34;&#34;},&#34;legend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;clickable&#34;:&#34;false&#34;,&#34;position&#34;:&#34;bottom&#34;,&#34;align&#34;:&#34;left&#34;,&#34;valign&#34;:&#34;bottom&#34;,&#34;style&#34;:&#34;default&#34;,&#34;fill&#34;:&#34;#000000&#34;},&#34;customLegend&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;internal&#34;,&#34;position&#34;:&#34;bottom&#34;,&#34;align&#34;:&#34;left&#34;,&#34;valign&#34;:&#34;bottom&#34;,&#34;style&#34;:&#34;default&#34;,&#34;fill&#34;:&#34;#000000&#34;},&#34;overlay&#34;:&#34;&#34;,&#34;overlayOrder&#34;:&#34;&#34;,&#34;allowEmpty&#34;:&#34;&#34;,&#34;drillDownOnClick&#34;:&#34;&#34;,&#34;alwaysKeepBase&#34;:&#34;&#34;,&#34;liveFilter&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;type&#34;:&#34;menu&#34;,&#34;position&#34;:&#34;above&#34;,&#34;allLabel&#34;:&#34;All&#34;,&#34;default&#34;:&#34;345&#34;,&#34;includeCount&#34;:&#34;&#34;,&#34;keepBase&#34;:&#34;&#34;},&#34;tooltip&#34;:{&#34;enabled&#34;:&#34;1&#34;,&#34;fixed&#34;:&#34;&#34;,&#34;showTooltipOn&#34;:&#34;hover&#34;,&#34;template&#34;:&#34;{tooltipContent}&#34;,&#34;onlyWithData&#34;:&#34;&#34;,&#34;disableMobile&#34;:&#34;&#34;,&#34;holdAction&#34;:&#34;&#34;,&#34;backgroundColor&#34;:&#34;#FFFFFF&#34;,&#34;color&#34;:&#34;#000000&#34;,&#34;fontFamily&#34;:&#34;inherit&#34;,&#34;fontSize&#34;:&#34;&#34;,&#34;fontWeight&#34;:&#34;normal&#34;,&#34;cornerRadius&#34;:&#34;20&#34;,&#34;borderColor&#34;:&#34;#f5f5f5&#34;,&#34;borderWidth&#34;:&#34;1&#34;,&#34;maxWidth&#34;:&#34;&#34;,&#34;customShadow&#34;:&#34;&#34;,&#34;customShadowOpts&#34;:{&#34;dx&#34;:&#34;1&#34;,&#34;dy&#34;:&#34;1&#34;,&#34;blur&#34;:&#34;1&#34;,&#34;opacity&#34;:&#34;0.5&#34;,&#34;color&#34;:&#34;#000000&#34;}},&#34;zoom&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;draggable&#34;:&#34;1&#34;,&#34;mobileResizable&#34;:&#34;1&#34;,&#34;doubleHitZoom&#34;:&#34;1&#34;,&#34;wheelable&#34;:&#34;1&#34;,&#34;zoomOnClick&#34;:&#34;&#34;,&#34;controls&#34;:&#34;1&#34;,&#34;homeButton&#34;:&#34;1&#34;,&#34;maxZoomLevel&#34;:&#34;32&#34;,&#34;controlsPositions&#34;:{&#34;align&#34;:&#34;right&#34;,&#34;valign&#34;:&#34;bottom&#34;},&#34;externalControls&#34;:&#34;&#34;},&#34;touchInterface&#34;:{&#34;tapToActivate&#34;:&#34;&#34;,&#34;tapTimeout&#34;:&#34;3000&#34;,&#34;dragGrip&#34;:&#34;&#34;,&#34;dragGripAutoHideDelay&#34;:&#34;3000&#34;},&#34;fullScreen&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;mobileOnly&#34;:&#34;&#34;,&#34;align&#34;:&#34;right&#34;,&#34;valign&#34;:&#34;top&#34;},&#34;externalDropdown&#34;:{&#34;enabled&#34;:&#34;&#34;,&#34;mobileOnly&#34;:&#34;&#34;,&#34;namePropery&#34;:&#34;&#34;,&#34;placeholder&#34;:&#34;Select&#34;,&#34;noResults&#34;:&#34;No Matches&#34;,&#34;select&#34;:&#34;Tap to Select&#34;,&#34;groupOverlay&#34;:&#34;&#34;},&#34;exportMenu&#34;:{&#34;enable&#34;:&#34;&#34;,&#34;align&#34;:&#34;right&#34;},&#34;custom_css&#34;:&#34;&#34;,&#34;custom_js&#34;:&#34;&#34;,&#34;id&#34;:&#34;14758&#34;,&#34;container&#34;:&#34;map_14758&#34;,&#34;title&#34;:&#34;New B2B Maps&#34;,&#34;urls&#34;:{&#34;germanyHigh&#34;:&#34;https:\/\/cdn.amcharts.com\/lib\/4\/geodata\/germanyHigh.js&#34;},&#34;allEntries&#34;:[],&#34;performance&#34;:{&#34;animations&#34;:true,&#34;lazyLoad&#34;:true},&#34;zoomMaster&#34;:false}],&#34;async&#34;:[],&#34;version&#34;:&#34;1.5.0&#34;};
      </script>
      <script type="rocketlazyloadscript" data-rocket-src="https://www.zenjob.com/de/wp-content/plugins/interactive-geo-maps-premium/assets/map-service/app.min.js?ver=1.5.0" id="interactive-geo-maps_map_service-js" defer="">
      </script>
    </div>
    <script defer="" src="https://static.cloudflareinsights.com/beacon.min.js/v8c78df7c7c0f484497ecbca7046644da1771523124516" integrity="sha512-8DS7rgIrAmghBFwoOTujcf6D9rXvH8xm8JQ1Ja01h9QX8EzXldiszufYa4IFfKdLUKTTrnSFXLDkUEOTrZQ8Qg==" data-cf-beacon="{&#34;version&#34;:&#34;2024.11.0&#34;,&#34;token&#34;:&#34;e5a21a3f18334cdcb15208219d5a85f7&#34;,&#34;server_timing&#34;:{&#34;name&#34;:{&#34;cfCacheStatus&#34;:true,&#34;cfEdge&#34;:true,&#34;cfExtPri&#34;:true,&#34;cfL4&#34;:true,&#34;cfOrigin&#34;:true,&#34;cfSpeedBrain&#34;:true},&#34;location_startswith&#34;:null}}" crossorigin="anonymous">
    </script>
  </body>
</html>
<!-- This website is like a Rocket, isn't it? Performance optimized by WP Rocket. Learn more: https://wp-rocket.me - Debug: cached@1774528669 -->
