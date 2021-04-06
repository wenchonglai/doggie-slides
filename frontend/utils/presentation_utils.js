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

export const asyncUpdateSlide = (slideId) => $.ajax({
  method: 'PATCH',
  url: `/api/slides/${slideId}`,
});

export const asyncMoveSlide = (data) => $.ajax({
  method: 'PATCH',
  url: `/api/slides/move`,
  data: {slide: data}
});