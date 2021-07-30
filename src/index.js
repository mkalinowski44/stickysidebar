class StickySidebar {
   constructor({el, includeTop, includeBottom, includeBefore, includeAfter, mode, onMediaQuery}) {
      this.sidebar = document.querySelector(el)
      this.container = this.getContainer()
      this.mode = this.getMode(mode)
      this.onMediaQuery = onMediaQuery
      this.status = 1

      this.includeTop = includeTop || 0
      this.topMargin = 0
      this.setTopMargin()

      this.includeBottom = includeBottom || 0
      this.bottomMargin = 0
      this.setBottomMargin()

      this.includeBefore = includeBefore || this.topMargin
      this.beforeMargin = 0
      this.setBeforeMargin()

      this.includeAfter = includeAfter || this.afterMargin
      this.afterMargin = 0
      this.setAfterMargin()

      this.initEvents()
   }

   getMode(mode) {
      switch(mode) {
         case 'top':
         case 'scroll':
         case 'bottom': return mode
         default: return 'top'
      }
   }

   initEvents() {
      this.onScroll()
      this.onResize()
      window.addEventListener('scroll', this.throttle(this.onScroll.bind(this), 10))
      if(this.onMediaQuery) {
         window.addEventListener('resize', this.throttle(this.onResize.bind(this), 10))
      }
      this.sidebarStyleDefault = this.sidebar.style
      this.containerStyleDefault = this.container.el.style
   }

   onResize() {
      const width = window.innerWidth
      const from = this.onMediaQuery[0]
      const to = this.onMediaQuery[1] || 'max'


      if(width > from && (to === 'max' || width < to) && this.status === 0) {
         this.status = 1
         this.onScroll()
      }
      else if(width <= from && (to === 'max' || width >= to) && this.status === 1) {
         this.status = 0
         this.sidebar.classList.remove('ss-fixed-top')
         this.sidebar.classList.remove('ss-fixed-bottom')
         this.restoreStyles()
      }
      else {
         this.sidebar.classList.remove('ss-fixed-top')
         this.sidebar.classList.remove('ss-fixed-bottom')
         this.onScroll()
      }
   }

   onScroll() {
      // const direction = this.getScrollDirection()
      const documentHeight = this.getDocumentHeight()
      if(this.status === 1) {
         switch(this.mode) {
            case 'top': {
               if(documentHeight - this.beforeMargin - this.afterMargin > this.sidebar.clientHeight) {
                  if(
                     window.scrollY >= (this.container.y - this.topMargin) &&
                     window.scrollY + this.topMargin < (documentHeight - this.bottomMargin - this.sidebar.clientHeight) &&
                     !this.sidebar.classList.contains('ss-fixed-top')
                  ) {
                     this.sidebar.classList.remove('ss-fixed-bottom')
                     this.sidebar.classList.add('ss-fixed-top')
                     this.saveStyles()
                     this.sidebar.style.position = 'fixed'
                     this.sidebar.style.width = this.container.width + 'px'
                     this.sidebar.style.top = this.topMargin + 'px'
                  }
                  if(
                     window.scrollY < (this.container.y - this.topMargin) &&
                     this.sidebar.classList.contains('ss-fixed-top')
                  ) {
                     this.sidebar.classList.remove('ss-fixed-top')
                     this.sidebar.classList.remove('ss-fixed-bottom')
                     this.restoreStyles()
                  }
                  if(
                     window.scrollY + this.topMargin >= (documentHeight - this.bottomMargin - this.sidebar.clientHeight) &&
                     !this.sidebar.classList.contains('ss-fixed-bottom')
                  ) {
                     this.sidebar.classList.remove('ss-fixed-top')
                     this.sidebar.classList.add('ss-fixed-bottom')
                     this.saveStyles()
                     this.sidebar.style.position = 'absolute'
                     this.sidebar.style.width = this.container.width + 'px'
                     this.sidebar.style.top = (documentHeight - this.bottomMargin - this.sidebar.clientHeight) + 'px'
                  }
               }
               break;
            }
         }
      }
   }

   getDocumentHeight() {
      const body = document.body,
            html = document.documentElement

      return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )
   }

   saveStyles() {
      this.restoreStyles()
      this.sidebarStyleDefault = this.sidebar.style
      // this.containerStyleDefault = this.container.el.style
   }

   restoreStyles() {
      this.sidebar.style = this.sidebarStyleDefault
      // this.container.el.style = this.containerStyleDefault
   }

   getScrollDirection() {
      if(!this.lastScrollPos) {
         this.lastScrollPos = 0
      }

      const scrollDifference = window.scrollY - this.lastScrollPos
      this.lastScrollPos = window.scrollY

      if(scrollDifference === 0) return 0
      else if(scrollDifference > 0) return -1
      else if(scrollDifference < 0) return 1
   }

   getContainer() {
      const container = this.sidebar.parentNode
      const containerPos = this.getBoundingClientRect(container)
      containerPos.y += window.scrollY
      containerPos.x += window.scrollX
      return {
         el: container,
         ...containerPos
      }
   }

   getBoundingClientRect(element) {
      const {top, right, bottom, left, width, height, x, y} = element.getBoundingClientRect()
      return {top, right, bottom, left, width, height, x, y}
   }

   getElementOffsetHeight(element) {
      const base = element.clientHeight
      const styles = window.getComputedStyle(element)
      const marginTop = parseFloat(styles.marginTop)
      const marginBottom = parseFloat(styles.marginBottom)
      return base + marginTop + marginBottom
   }

   getIncludeMargin(elements) {
      switch(typeof elements) {
         case 'number': {
            return elements
         }
         case 'string': {
            const el = document.querySelector(elements)
            return this.getElementOffsetHeight(el)
         }
         case 'object': {
            if(this.isDOMObject(elements)) {
               return this.getElementOffsetHeight(elements)
            }
            if(!Array.isArray(elements)) {
               elements = Object.values(elements)
            }
         }
         case 'array': {
            let height = 0
            elements.forEach(element => {
               height += this.getIncludeMargin(element)
            })
            return height
         }
         default: {
            return 0
         }
      }
   }

   setTopMargin(elements = null) {
      if(elements !== null) {
         this.includeTop = elements
      }

      this.topMargin = this.getIncludeMargin(this.includeTop)
      return this.topMargin
   }

   setBottomMargin(elements = null) {
      if(elements !== null) {
         this.includeBottom = elements
      }

      this.bottomMargin = this.getIncludeMargin(this.includeBottom)
      return this.bottomMargin
   }

   setBeforeMargin(elements = null) {
      if(elements !== null) {
         this.includeBefore = elements
      }

      this.beforeMargin = this.getIncludeMargin(this.includeBefore)
      return this.beforeMargin
   }

   setAfterMargin(elements = null) {
      if(elements !== null) {
         this.includeAfter = elements
      }

      this.afterMargin = this.getIncludeMargin(this.includeAfter)
      return this.afterMargin
   }

   isDOMObject(obj) {
      try {
        return obj instanceof HTMLElement
      }
      catch(e) {
        return (typeof obj === "object") &&
          (obj.nodeType === 1) && (typeof obj.style === "object") &&
          (typeof obj.ownerDocument === "object")
      }
   }

   // debounce(func, timeout = 300){
   //    let timer
   //    return (...args) => {
   //      clearTimeout(timer)
   //      timer = setTimeout(() => { func.apply(this, args); }, timeout)
   //    }
   // }

   throttle (callback, limit) {
      var waiting = false;                      // Initially, we're not waiting
      return function () {                      // We return a throttled function
         if (!waiting) {                       // If we're not waiting
            callback.apply(this, arguments);  // Execute users function
            waiting = true;                   // Prevent future invocations
            setTimeout(function () {          // After a period of time
               waiting = false;              // And allow future invocations
            }, limit);
         }
      }
  }
}
window.StickySidebar = StickySidebar