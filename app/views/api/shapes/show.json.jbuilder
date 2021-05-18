json.partial! "shape", shape: @shape

json.wrapper_attributes do
  wrapper = @shape.wrapper
  json.set! wrapper.id do
    json.partial! "api/wrappers/wrapper", wrapper: wrapper
  end
end