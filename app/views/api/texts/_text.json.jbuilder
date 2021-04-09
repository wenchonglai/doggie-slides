json.partial! "api/textboxes/textbox", textbox: textbox

json.textstyles_attributes do
  (textbox.textstyles).map do |textstyle|
    json.set! textstyle.id do
      json.partial! "api/textstyles/textstyle", textstyle: textstyle
    end
  end
end