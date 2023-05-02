const script = `<div
			    class="inspector-overlay">
			    <svg
			        class="inspector-overlay-svg"
			        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
			    ></svg>
			    <style>
			        .inspector-overlay {
			        position: fixed;
			        top: 0;
			        left: 0;
			        width: 100%;
			        height: 100%;
			        z-index: 9999;
			        pointer-events: none;
			        }
			        body{
			            background-color: #fff;
			        }
			        .disabled{
			            pointer-events: none;
			            display: none;
			        }
			    </style>
			    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
				<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/ScrollTrigger.min.js"></script>
				<script src="https://unpkg.com/split-type"></script>
				<script src="SCRIPT_URL"></script>

			    <script>
			    const inspector = document.querySelector('.inspector-overlay');
			    const body = document.querySelector('body');
				
			  
		
				// toggle gsap scroll aniamtion markers
				function toggleMarkers() {
					const markers = [document.querySelector('.gsap-marker-scroller-start'), document.querySelector('.gsap-marker-scroller-end'), document.querySelector('.gsap-marker-start'), document.querySelector('.gsap-marker-end')];
					markers.forEach(marker => {
						marker.style.display === 'block' ? marker.style.display = 'none' : marker.style.display = 'block';
					})
				}
				let isScroll = false;
				let isTrigger = false;

				window.addEventListener('message', function (event) {
					isScroll = false;
					isTrigger = false;
					
					if(event.data === 'chooseTarget')
					{
						chooseTargetHandler()
						return;
					} 
					if(event.data === 'chooseTriggerTarget')
					{
						isTrigger = true;
						chooseTargetHandler()
						return;
					} 
					if(event.data === 'chooseScrollTarget')
					{
						isScroll = true;
						chooseTargetHandler()
						return;
					}
					if(event.data[0] === 'preview')
					{
						createFunctionFromString(event.data[1])
						window.mtl.play();
						return;
					} 
					if(event.data ==='showMarkers')
					{
						toggleMarkers();
						return;
					}
				});

				
			      function createFunctionFromString(str) {
					
					//  return new Function('return ' + str)();
					let anim = new Function('let tl = gsap.timeline();' + str + ';return tl;')
					window.mtl.add(anim());
									
			        }
					
				
			    const children = body.children;

			    function mouseoverHandler(e) {
			        const hova = document.querySelector('.hova');
			        if (hova) {
			            hova.classList.remove('hova');
			        }
			        convertBoundingBoxtoPath(e.target.getBoundingClientRect());
			        e.target.classList.add('hova');
			    }

			    function mouseoutHandler(e) {
					if(overlay.children.length > 0)
			        overlay.children[overlay.children.length - 1].remove();
			        e.target.classList.remove('hova');
			    }

			    function clickHandler(e) {
			        let isText = false;
					e.target.childNodes[0] && (e.target.childNodes[0].nodeType === 3 ? (isText = true) : (isText = false))
			        removeTargetHandler(e)
					const elementClasses =[...e.target.classList];
					const elementId = e.target.id;
					const parentClasses = [...e.target.parentNode.classList];
					const parentId = e.target.parentNode.id;
					const grandparentClasses = [...e.target.parentNode.parentNode.classList];
					const grandparentId = e.target.parentNode.parentNode.id;
					const message = [{element: [elementClasses, elementId], parent: [parentClasses, parentId], grandparent: [grandparentClasses, grandparentId]}, isText, isTrigger, isScroll]
					window.parent.postMessage(message, '*');
			        e.preventDefault();
			    }

					

			    function chooseTargetHandler(isTrigger, isScroll) {
			    for (let i = 0; i < children.length; i++) {
			        const child = children[i];
			        child.addEventListener('mouseover', mouseoverHandler);
			        child.addEventListener('mouseout', mouseoutHandler);
			        child.addEventListener('click', clickHandler);
			    }
			}
			function removeTargetHandler(e) {
			    mouseoutHandler(e);
			    for (let i = 0; i < children.length; i++) {
			        const child = children[i];
			        child.removeEventListener('mouseover', mouseoverHandler);
			        child.removeEventListener('mouseout', mouseoutHandler);
			        child.removeEventListener('click', clickHandler);
			    }
			}
			    const overlay = document.querySelector('.inspector-overlay-svg');
			    function convertBoundingBoxtoPath(boundingBox) {
			        const x = boundingBox.x;
			        const y = boundingBox.y;
			        const width = boundingBox.width;
			        const height = boundingBox.height;
			        const path =
			            'M' + x + ' ' + y + 'h' + width + 'v' + height + 'h-' + width + 'z';
			        overlay.appendChild(
			            document.createElementNS('http://www.w3.org/2000/svg', 'path')
			        );
			        overlay.lastChild.setAttribute('d', path);
			        overlay.lastChild.setAttribute('fill', '#ff000025');
			        overlay.lastChild.setAttribute('stroke', 'red');
			    }



				//splittype Function	
				function splitType(target) {
					let typeSplit = new SplitType(target, {
						types: 'words, chars',
						tagName: 'span',
					});
				}

				// splitType('.hero-title');
			</script>
			    `;
export default script;
