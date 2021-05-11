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

export const asyncFetchSlideContent = (slideId) => $.ajax({
  method: 'GET',
  url: `/api/slides/${slideId}/show_content`,
});

export const asyncUpdateWrapper = (wrapper) => $.ajax({ // params: { wrapper: { ...wrapper, width, height, x, y, rotate } }
  method: 'PATCH',
  url: `/api/wrappers/${wrapper.id}`,
  data: { wrapper }
});

export const asyncCreateText = (textData) => $.ajax({ // params: { textbox: { text, textstylesParams: {styleString, offset, _destroy} } }
  method: 'POST',
  url: `/api/texts`,
  data: {
    textbox: textData
  }
});

export const asyncUpdateText = (textboxId, textData) => $.ajax({ // params: { textbox: { text, textstylesParams: {styleString, offset, _destroy} } }
  method: 'PATCH',
  url: `/api/texts/${textboxId}`,
  data: {
    textbox: textData
  }
});

export const asyncDeleteWrappers = (slideId, slideData) => $.ajax({ // params: { textbox: { text, textstylesParams: {styleString, offset, _destroy} } }
  method: 'PATCH',
  url: `/api/slides/${slideId}`,
  data: {slide: slideData}
});

export const asyncUploadImage = (formData) => $.ajax({
  url: '/api/images',
  method: 'post',
  data: formData, 
  contentType: false,
  processData: false
});

export const asyncMoveWrapper = (data) => $.ajax({
  method: 'patch',
  url: 'api/wrappers/move',
  data
})