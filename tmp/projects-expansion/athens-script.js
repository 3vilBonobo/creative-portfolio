// const burgerMenu = document.querySelector('.burger-menu');
// const menu = document.querySelector('.menu');

// burgerMenu.addEventListener('click', () => {
//   menu.classList.toggle('active');
// });
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.menu');

  menuToggle.addEventListener('click', function () {
    menu.classList.toggle('active');
  });
});

// Get the modal
var modal = document.querySelector('.modal');

// Get the image and insert it inside the modal
var images = document.querySelectorAll('.thumbnail img');
var modalImg = document.getElementById('modal-img');

images.forEach(function (img) {
  img.addEventListener('click', function () {
    modal.style.display = 'block';
    modalImg.src = this.src;
  });
});

// Get the <span> element that closes the modal
var closeBtn = document.querySelector('.close');

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
  modal.style.display = 'none';
};

//FAQ

document.addEventListener('DOMContentLoaded', function () {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    const question = item.querySelector('.question');
    const answer = item.querySelector('.answer');

    question.addEventListener('click', function () {
      // Toggle open class on click
      item.classList.toggle('open');

      // Toggle display of answer
      if (item.classList.contains('open')) {
        answer.style.display = 'block';
      } else {
        answer.style.display = 'none';
      }
    });
  });
});
