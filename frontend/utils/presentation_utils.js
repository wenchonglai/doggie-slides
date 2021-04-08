// Textbox.create!({
//   text: 0,
//   wrapper_attributes: {slide_id: 103,
//     sequence: 1,
//     width: 100,
//     height: 100,
//     transform_string: ""},
//   text_styles_attributes: [{
//     style_string: "a",
//     offset: 0
//   }]
// });

export const asyncFetchPresentation = () => $.ajax({
  method: 'GET',
  url: '/api/users'
});

export const asyncUpdateDoc = (doc) => $.ajax({
  method: 'PATCH',
  url: `/api/docs/${doc.id}`,
  data: {doc}
});

export const asyncAddSlide = (slide) => $.ajax({
  method: 'POST',
  url: `/api/slides`,
  data: {slide}
});

export const asyncDeleteSlide = (slideId) => $.ajax({
  method: 'DELETE',
  url: `/api/slides/${slideId}`,
});

export const asyncUpdateSlide = (slide) => $.ajax({
  method: 'PATCH',
  url: `/api/slides/${slide.id}`,
  data: {slide}
});

export const asyncMoveSlide = (data) => $.ajax({
  method: 'PATCH',
  url: `/api/slides/move`,
  data: {slide: data}
});