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
else
  json.users ({})
  json.docs ({})
  json.slides ({})
end