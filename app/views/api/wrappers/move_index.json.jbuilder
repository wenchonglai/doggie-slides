@slide_wrappers.map do |wrapper|
  json.set! wrapper.id do
    json.partial! "wrapper", wrapper: wrapper
  end
end