json.users ({})
json.docs ({})
json.slides ({})
json.wrappers({})
json.textboxes({})
json.textstyles({})

if @user
  json.users do 
    json.set! @user.id do
      json.partial! "user", user: @user
      json.doc_ids @user.doc_ids
      json.slide_ids @user.slide_ids
    end
  end

  json.docs do
    (@user.docs).map do |doc|
      json.set! doc.id do
        json.partial! "api/docs/doc", doc: doc
        json.slide_ids doc.slide_ids
      end
    end
  end

  json.slides do
    (@user.slides).map do |slide|
      json.set! slide.id do
        json.partial! "api/slides/slide", slide: slide
      end
    end
  end

  json.wrappers do
    (@user.wrappers).map do |wrapper|
      json.set! wrapper.id do
        json.partial! "api/wrappers/wrapper", wrapper: wrapper
      end
    end
  end

  json.textboxes do
    (@user.textboxes).map do |textbox|
      json.set! textbox.id do
        json.partial! "api/textboxes/textbox", textbox: textbox
      end
    end
  end

  json.textstyles do
    (@user.textstyles).map do |textstyle|
      json.set! textstyle.id do
        json.partial! "api/textstyles/textstyle", textstyle: textstyle
      end
    end
  end
end