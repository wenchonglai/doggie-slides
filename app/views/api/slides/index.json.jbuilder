@slides.map do |slide|
  json.set! slide.id do
    json.partial! "slide", slide: slide
  end
end