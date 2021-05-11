if @slide
  json.slides do 
    json.set! @slide.id do
      json.partial! "slide", slide: @slide
    end
  end

  json.wrappers do
    (@slide.wrappers).map do |wrapper|
      json.set! wrapper.id do
        json.partial! "api/wrappers/wrapper", wrapper: wrapper
      end
    end
  end

  json.textboxes do
    (@slide.textboxes).map do |textbox|
      json.set! textbox.id do
        json.partial! "api/textboxes/textbox", textbox: textbox
      end
    end
  end

  json.textstyles do
    (@slide.textstyles).map do |textstyle|
      json.set! textstyle.id do
        json.partial! "api/textstyles/textstyle", textstyle: textstyle
      end
    end
  end

  json.images do
    (@slide.images).map do |image|
      json.set! image.id do
        json.partial! "api/images/image", image: image
      end
    end
  end
end