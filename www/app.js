/* Miru site behaviour.
   Three things: the reading-mode switcher, the scroll entrances, and a
   gentle parallax on the product band. Everything degrades: without this
   file the page still reads and every mode is still on it. */

(function () {
  'use strict'

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* ------------------------------------------------- reading mode switcher */

  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tab'))
  var figures = Array.prototype.slice.call(document.querySelectorAll('.mode-figure'))

  function select(mode, focus) {
    tabs.forEach(function (tab) {
      var active = tab.dataset.mode === mode
      tab.classList.toggle('is-active', active)
      tab.setAttribute('aria-selected', active ? 'true' : 'false')
      tab.tabIndex = active ? 0 : -1
      if (active && focus) tab.focus()
    })

    figures.forEach(function (figure) {
      var active = figure.dataset.mode === mode
      figure.classList.toggle('is-active', active)
      if (active) {
        figure.removeAttribute('hidden')
      } else {
        figure.setAttribute('hidden', '')
      }
    })
  }

  if (tabs.length && figures.length) {
    /* Start from the markup's active mode rather than assuming the first. */
    var initial = tabs.find(function (tab) {
      return tab.classList.contains('is-active')
    })
    select(initial ? initial.dataset.mode : tabs[0].dataset.mode, false)

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () {
        select(tab.dataset.mode, false)
      })

      tab.addEventListener('keydown', function (event) {
        var next = null
        if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length]
        else if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length]
        else if (event.key === 'Home') next = tabs[0]
        else if (event.key === 'End') next = tabs[tabs.length - 1]
        if (!next) return
        event.preventDefault()
        select(next.dataset.mode, true)
      })
    })
  }

  /* ------------------------------------------------------ scroll entrances */

  var revealable = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'))

  if (revealable.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealable.forEach(function (el) {
        el.classList.add('is-in')
      })
    } else {
      /* Stagger the members of a section so the heading lands before its
         own content rather than everything arriving at once. */
      var bySection = new Map()
      revealable.forEach(function (el) {
        var section = el.closest('section') || document.body
        if (!bySection.has(section)) bySection.set(section, [])
        bySection.get(section).push(el)
      })
      bySection.forEach(function (group) {
        group.forEach(function (el, index) {
          el.style.setProperty('--reveal-delay', index * 70 + 'ms')
        })
      })

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return
            entry.target.classList.add('is-in')
            observer.unobserve(entry.target)
          })
        },
        { rootMargin: '0px 0px -12% 0px', threshold: 0.05 }
      )

      revealable.forEach(function (el) {
        observer.observe(el)
      })
    }
  }

  /* --------------------------------------------------------- band parallax */

  var parallax = document.querySelector('[data-parallax]')

  if (parallax && !reducedMotion) {
    var ticking = false

    function update() {
      ticking = false
      var rect = parallax.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      /* The band drifts a fraction of its height as it passes the viewport.
         It never leaves the frame it was drawn in. */
      var progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      var offset = (progress - 0.5) * 40
      parallax.style.transform = 'translate3d(0,' + offset.toFixed(2) + 'px,0)'
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return
        ticking = true
        window.requestAnimationFrame(update)
      },
      { passive: true }
    )

    update()
  }

  /* ---------------------------------------------------------- the product clip */

  var clip = document.querySelector('.band-video')
  var toggle = document.querySelector('[data-video-toggle]')

  if (clip && toggle) {
    toggle.setAttribute('aria-pressed', 'false')

    /* A reader who asked for less motion gets the still poster instead of
       a moving clip. */
    if (reducedMotion) {
      clip.removeAttribute('autoplay')
      clip.pause()
      toggle.setAttribute('aria-pressed', 'true')
      toggle.setAttribute('aria-label', 'Play the product clip')
    }

    toggle.addEventListener('click', function () {
      if (clip.paused) {
        clip.play()
        toggle.setAttribute('aria-pressed', 'false')
        toggle.setAttribute('aria-label', 'Pause the product clip')
      } else {
        clip.pause()
        toggle.setAttribute('aria-pressed', 'true')
        toggle.setAttribute('aria-label', 'Play the product clip')
      }
    })
  }
})()
