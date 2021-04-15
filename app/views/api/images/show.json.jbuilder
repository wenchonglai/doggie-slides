json.partial! "image", image: @image

json.wrapper_attributes do
  wrapper = @image.wrapper
  json.set! wrapper.id do
    json.partial! "api/wrappers/wrapper", wrapper: wrapper
  end
end