// ==UserScript==
// @name         Remove Read Galleries from LANraragi
// @namespace    http://tampermonkey.net/
// @version      0.1
// @icon         https://raw.githubusercontent.com/Difegue/LANraragi/dev/public/favicon.ico
// @description  Removes <div> elements with a crown emoji 👑
// @author       TsukinoYuuki
// @match        *10.24.19.14:3000/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

window.addEventListener('load', function() {
  'use strict';

  function processSwiperSlides() {
    const thumbsContainer = document.getElementById('thumbs_container');
    const swiperSlides = Array.from(document.querySelectorAll('.swiper-slide, .swiper-slide.swiper-slide-visible, .swiper-slide.swiper-slide-visible.swiper-slide-next, .swiper-slide.swiper-slide-visible.swiper-slide-active'));

    if (thumbsContainer) {
      const id1Elements = thumbsContainer.querySelectorAll('.id1.context-menu.swiper-slide');

      id1Elements.forEach((id1Element) => {
        const id2Element = id1Element.querySelector('.id2');
        const isNewElement = id2Element && id2Element.querySelector('.isnew');

        if (isNewElement && isNewElement.innerHTML.trim() === '👑') {
          id1Element.remove();
        }
      });
    }

    swiperSlides.forEach((slideElement, index) => {
      const id2Element = slideElement.querySelector('.id2');
      const isNewElement = id2Element && id2Element.querySelector('.isnew');

      if (isNewElement && isNewElement.innerHTML.trim() === '👑') {
        const nextSlide = slideElement.nextElementSibling;
        const nextNextSlide = nextSlide && nextSlide.nextElementSibling;

        if (slideElement.classList.contains('swiper-slide-visible') && slideElement.classList.contains('swiper-slide-active')) {
          if (nextSlide) {
            nextSlide.classList.add('swiper-slide-visible', 'swiper-slide-active');
            nextSlide.classList.remove('swiper-slide-next');
          }
        }

        if (nextSlide && nextSlide.classList.contains('swiper-slide-visible') && nextSlide.classList.contains('swiper-slide-next')) {
          if (nextNextSlide) {
            nextNextSlide.classList.add('swiper-slide-visible', 'swiper-slide-next');
          }
        }

        // Remove all children of the direct child of the slideElement
        const directChild = slideElement.firstElementChild;
        if (directChild) {
          while (directChild.firstChild) {
            directChild.removeChild(directChild.firstChild);
          }
        }
      }

      if (index === 0) {
        slideElement.classList.add('swiper-slide-visible', 'swiper-slide-active');
      } else if (index === 1) {
        slideElement.classList.add('swiper-slide-visible', 'swiper-slide-next');
      } else if (index >= 2 && index <= 3) {
        slideElement.classList.add('swiper-slide-visible');
      } else {
        slideElement.classList.remove('swiper-slide-visible');
      }
    });
  }

  // Run the function to process swiper slides initially
  processSwiperSlides();

  // Re-run the function when DOM updates (e.g., after AJAX requests)
  const observer = new MutationObserver(processSwiperSlides);
  observer.observe(document.body, { childList: true, subtree: true });

});
